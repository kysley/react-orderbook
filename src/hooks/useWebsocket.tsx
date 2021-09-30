import { useCallback, useEffect, useRef, useState } from 'react';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';
import { useInterval } from 'rooks';

import {
  debugIntervalAtom,
  OrderBookStateAction,
  subscribeMessageAtom,
  unsubscribeMessageAtom,
  updateOrderBookState,
} from '../state';
import { CF_WSS } from '../utils/constants';
import { useWindowFocus } from './useWindowFocus';
import { feedWorker } from '../utils/feed-worker';
import type { EventMessage } from '../utils/feed.worker';

export enum SOCKET_STATE {
  DISCONNECTED = 0,
  CONNECTED = 1,
}

// Returning this from a function in setState would cause 2 connections to be created
export const DEFAULT_SOCKET_STATE = new WebSocket(CF_WSS);

export const useWebSocket = () => {
  const [socket, setSocket] = useState<WebSocket>(DEFAULT_SOCKET_STATE);
  const [socketState, setSocketState] = useState<SOCKET_STATE>(1);

  const closeSocket = useCallback(() => {
    socket.close();
  }, [socket]);

  const restartSocket = useCallback(() => {
    setSocketState(1);
    const newSocket = new WebSocket(CF_WSS);
    setSocket(newSocket);
  }, []);

  // Whenever we create a new socket, attach default error and close handlers
  useEffect(() => {
    socket.onerror = () => {
      setSocketState(0);
    };
    socket.onclose = () => {
      console.log('socket close callback');
      setSocketState(0);
    };
  }, [socket]);

  return {
    socket,
    closeSocket,
    restartSocket,
    socketState,
  };
};

export const useOrderBookSocket = () => {
  const { socket, closeSocket, restartSocket, socketState } = useWebSocket();
  const tabFocus = useWindowFocus();

  const subMessage = useAtomValue(subscribeMessageAtom);
  const unsubMessage = useAtomValue(unsubscribeMessageAtom);
  const refreshInterval = useAtomValue(debugIntervalAtom);

  const updateState = useUpdateAtom(updateOrderBookState);

  const bookCache = useRef<OrderBookStateAction | null>(null);
  const didMount = useRef<boolean>(false);

  // If the socket is currently connected & the user leaves the tab
  useEffect(() => {
    if (tabFocus !== undefined && !tabFocus && socketState === 1) {
      console.info('[Focus lost] -> closing socket');
      closeSocket();
    }
  }, [tabFocus, socketState, closeSocket]);

  const flushBookCache = useCallback(() => {
    if (socket.OPEN) {
      if (bookCache.current) {
        updateState(bookCache.current);
      }
    }
    bookCache.current = null;
  }, [socket.OPEN, updateState]);

  useInterval(flushBookCache, refreshInterval, true);

  useEffect(() => {
    socket.onopen = () => {
      console.info('[Socket open] -> sending subscription message');
      socket.send(subMessage);
    };
    socket.onmessage = (e: MessageEvent<EventMessage>) => {
      feedWorker.postMessage(e.data);
      feedWorker.onmessage = (d) => {
        bookCache.current = d.data as OrderBookStateAction;
      };
    };
  }, [socket, subMessage]);

  // Fire off our (un)subscribe messages
  // when the contract changes. We don't
  // want this to fire on the first render ofc
  // so we protect it with a didMount boolean

  // We also purposely exclude `socket` from the dep array
  // since we dont want this to run when that reference changes
  useEffect(() => {
    if (didMount.current) {
      bookCache.current = null;

      socket.send(unsubMessage);
      socket.send(subMessage);
    } else {
      didMount.current = true;
    }
  }, [unsubMessage, subMessage]);

  return {
    connected: socketState,
    reconnect: restartSocket,
  };
};

/*
  My initial implementation of a socket hook was to provide a WebSocket singleton
  through context + ref.

  This approach is nice because its rerender frieldly with the ws being in a ref, but that makes
  it very tricky to track when the socket is closed & have consumers react accordingly. This quickly
  became an issue I started to implement the orderbook focus teardown & restart functionality.

  Another benefit of this was that a single ws can be shared across a Tree with useContext..
  This of course could still be done, but the more I thought about the case, I like the hook explicitly
  returning a new socket instance for each consumer.
*/

// export const WebsocketProvider: React.FunctionComponent = ({ children }) => {
//   const socketRef = useRef<WebSocket>(socket);

//   const closeWebsocketConnection = useCallback(() => {
//     if (socketRef.current?.OPEN) {
//       socketRef.current.close();
//       console.log('closed');
//     }
//   }, []);

//   const restartWebsocketConnection = useCallback(() => {
//     if (socketRef.current?.CLOSED && !socketRef.current.CONNECTING) {
//       socketRef.current = new WebSocket(CF_WSS);
//       console.log('reopenb');
//     }
//   }, []);

//   const value = useMemo(
//     () => ({
//       closeWebsocket: closeWebsocketConnection,
//       restartWebsocket: restartWebsocketConnection,
//       socket: socketRef.current,
//     }),
//     [closeWebsocketConnection, restartWebsocketConnection],
//   );

//   return (
//     <websocketContext.Provider value={value}>
//       {children}
//     </websocketContext.Provider>
//   );
// };

// export type DefaultWebsocketContext = {
//   socket: WebSocket;
//   closeWebsocket: () => void;
//   restartWebsocket: () => void;
// };

// const websocketContext = createContext<DefaultWebsocketContext>({
//   socket,
//   closeWebsocket: () => {},
//   restartWebsocket: () => {},
// });
