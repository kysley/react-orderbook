import React from 'react';
import { useAtomValue } from 'jotai/utils';

import { spreadAtom } from '../../state';
import { BookAsks, BookBids } from '.';
import { css, styled } from '../../utils/stitches.conf';
import { useOrderBookSocket } from '../../hooks/';
import { Button } from '../Button';

export const OrderBook: React.FunctionComponent<{}> = () => {
  const { connected, reconnect } = useOrderBookSocket();
  const spread = useAtomValue(spreadAtom);

  return (
    <OrderBookContainer>
      {connected !== 1 && (
        <OrderBookReconnect>
          <Button onClick={reconnect}>Reconnect to Order Book</Button>
        </OrderBookReconnect>
      )}
      <OrderBookHeader>Order Book</OrderBookHeader>
      <OrderBookSpread>Spread {spread}</OrderBookSpread>
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
      <OrderBookActions>
        <Button>Toggle Feed</Button>
      </OrderBookActions>
    </OrderBookContainer>
  );
};

const OrderBookContainer = styled('section', {
  display: 'grid',
  position: 'relative',
  gridTemplateAreas:
    '"name spread " "columns columns " "bids asks " "actions actions "',
  backgroundColor: '$bg',
  color: '$text',
  '@bp1': {
    gridTemplateAreas: `
    'name'
    'columns'
    'asks'
    'spread'
    'bids'
    'actions'
  `,
  },
});

const OrderBookSpread = styled('div', {
  color: '$text200',
  gridArea: 'spread',
  padding: '0.25em',
  '@bp1': {
    justifyContent: 'center',
  },
});

const OrderBookReconnect = styled('div', {
  position: 'absolute',
  height: '100%',
  width: '100%',
  background: '$bg060',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const OrderBookActions = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gridArea: 'actions',
  paddingTop: '1em',
});

const OrderBookHeader = styled('header', {
  gridArea: 'name',
  padding: '0.25em',
});

const OrderBookColumns = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(6, 1fr)',
  textTransform: 'uppercase',
  textAlign: 'right',
  gridArea: 'columns',
  borderTop: '$border 1px solid',
  borderBottom: '$border200 1px solid',
  h4: {
    margin: '.25em 0',
  },
  '@bp1': {
    gridTemplateColumns: 'repeat(3, 1fr)',
    '& h4:nth-child(n+4)': {
      display: 'none',
    },
  },
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
