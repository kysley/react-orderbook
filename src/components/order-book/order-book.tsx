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
import { styled } from '../../utils/stitches.conf';

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
      <OrderBookContainer>
        <OrderBookHeader>Order BOok Spread: {spread}</OrderBookHeader>
        <BidsContainer>
          <OrderBookColumns>
            {COLUMN_NAMES.map((colName) => (
              <h4>{colName}</h4>
            ))}

            {COLUMN_NAMES.map((colName) => (
              <h4>{colName}</h4>
            ))}
          </OrderBookColumns>
          <BookBids />
          <BookAsks />
        </BidsContainer>
      </OrderBookContainer>
    </>
  );
};

export const OrderBookContainer = styled('section', {
  display: 'grid',
  gridTemplateAreas: `
    'title'
    'bids'
  `,
  gridTemplateRows: '1fr 9fr',
  backgroundColor: 'DarkViolet',
});

export const BidsContainer = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
});

export const OrderBookHeader = styled('header', {});

const OrderBookColumns = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(6, 1fr)',
  textAlign: 'right',
  gridColumn: 'span 2',
});

const COLUMN_NAMES = ['total', 'size', 'price'];

// useDraggable = () => {
//   return {
//     styles: {},

//   }
// }

// use css grid to define a grid space
// each 25px dragged is like 1fr, simple math from there
// boom, its resizeable
// corner drag ... maybe drag+drop
