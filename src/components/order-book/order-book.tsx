import React from 'react';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';

import {
  asksAtom,
  bidsAtom,
  spreadAtom,
  updateAsksAtom,
  updateBidsAtom,
} from '../../state';
import { BookAsks, BookBids } from '.';
import { styled } from '../../utils/stitches.conf';
import { useOrderBookSocket } from '../../hooks/';

export const OrderBook: React.FunctionComponent<{}> = () => {
  const { connected, reconnect } = useOrderBookSocket();
  const spread = useAtomValue(spreadAtom);

  return (
    <OrderBookContainer connected={connected}>
      {connected !== 1 && (
        <OrderBookReconnect>
          <button onClick={reconnect}>reconnect</button>
        </OrderBookReconnect>
      )}
      <>
        <OrderBookHeader>Order BOok Spread: {spread}</OrderBookHeader>
        <BidsContainer>
          <OrderBookColumns>
            {COLUMN_NAMES.map((colName) => (
              <h4 key={colName}>{colName}</h4>
            ))}

            {COLUMN_NAMES.map((colName) => (
              <h4 key={colName}>{colName}</h4>
            ))}
          </OrderBookColumns>
          <BookBids />
          <BookAsks />
        </BidsContainer>
      </>
    </OrderBookContainer>
  );
};

export const OrderBookContainer = styled('section', {
  display: 'grid',
  position: 'relative',
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

export const OrderBookReconnect = styled('div', {
  position: 'absolute',
  height: '100%',
  width: '100%',
  background: 'Black',
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
