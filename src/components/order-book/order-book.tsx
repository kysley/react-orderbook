import React, { useEffect } from 'react';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';

import {
  asksAtom,
  bidsAtom,
  spreadAtom,
  updateAsksAtom,
  updateBidsAtom,
} from '../../state';
import { socket } from '../../utils/websocket';
import { BookAsks, BookBids } from '.';

export const OrderBook: React.FunctionComponent<{}> = () => {
  const updateBids = useUpdateAtom(updateBidsAtom);
  const updateAsks = useUpdateAtom(updateAsksAtom);
  const spread = useAtomValue(spreadAtom);

  useEffect(() => {
    let amt = -2;
    socket.onmessage = (e) => {
      if (amt === 0) {
        const jsonData = JSON.parse(e.data);
        updateBids(jsonData.bids);
        updateAsks(jsonData.asks);
      }
      if (amt > 0 && amt < 1500) {
        const jsonData = JSON.parse(e.data);

        if (jsonData?.bids.length > 0) {
          updateBids(jsonData.bids);
        }
        if (jsonData?.asks.length > 0) {
          updateAsks(jsonData.asks);
        }
      }
      amt++;
    };
  }, []);

  return (
    <>
      {spread}
      <main style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <BookBids />
        <BookAsks />
      </main>
    </>
  );
};

// useDraggable = () => {
//   return {
//     styles: {},

//   }
// }

// use css grid to define a grid space
// each 25px dragged is like 1fr, simple math from there
// boom, its resizeable
// corner drag ... maybe drag+drop
