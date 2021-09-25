import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';

import {
  subscribeMessageAtom,
  unsubscribeMessageAtom,
  updateAsksAtom,
  updateBidsAtom,
} from '../state';
import { CF_WSS } from '../utils/websocket';
import { useWindowFocus } from './useWindowFocus';

export enum SOCKET_STATE {
  DISCONNECTED = 0,
  CONNECTED = 1,
}

// Returning this from a function in setState would cause 2 connections to be created
export const DEFAULT_SOCKET_STATE = new WebSocket(CF_WSS);

export const useWebSocketS = () => {
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
  const { socket, closeSocket, restartSocket, socketState } = useWebSocketS();
  const tabFocus = useWindowFocus();

  const subMessage = useAtomValue(subscribeMessageAtom);
  const unsubMessage = useAtomValue(unsubscribeMessageAtom);

  const updateBids = useUpdateAtom(updateBidsAtom);
  const updateAsks = useUpdateAtom(updateAsksAtom);

  const didMount = useRef<boolean>(false);

  useEffect(() => {
    if (tabFocus !== undefined && !tabFocus && socketState === 1) {
      console.info('[Focus lost] -> closing socket');
      closeSocket();
    }
  }, [tabFocus, socketState]);

  useEffect(() => {
    socket.onopen = () => {
      console.info('[Socket open] -> sending subscription message');
      socket.send(subMessage);
    };
    let amt = 0;
    socket.onmessage = (e) => {
      if (amt < 1500) {
        const jsonData = JSON.parse(e.data);

        // Knowing that the snapshot message is the same format as a
        // delta, i dont see why we would need to handle the
        // cases individually
        if (jsonData?.bids?.length > 0) {
          updateBids(jsonData.bids);
        }
        if (jsonData?.asks?.length > 0) {
          updateAsks(jsonData.asks);
        }
      }
      amt++;
    };
  }, [socket]);

  useEffect(() => {
    if (didMount.current) {
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
  My initial implementation of a socket hook system was to provide a WebSocket singleton
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
