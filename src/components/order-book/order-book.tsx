import React from 'react';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';

import { contractAtom, spreadAtom, updateContractAtom } from '../../state';
import { BookAsks, BookBids } from '.';
import { styled } from '../../utils/stitches.conf';
import { useOrderBookSocket } from '../../hooks/';
import { Button } from '../button';
import { CONTRACT_DICT } from '../../utils/constants';

export const OrderBook: React.FunctionComponent<{}> = () => {
  const { connected, reconnect } = useOrderBookSocket();
  const swapContract = useUpdateAtom(updateContractAtom);
  const spread = useAtomValue(spreadAtom);
  const contract = useAtomValue(contractAtom);

  return (
    <OrderBookContainer>
      {connected !== 1 && (
        <OrderBookReconnect>
          <Button onClick={reconnect}>Reconnect to Order Book</Button>
        </OrderBookReconnect>
      )}
      <OrderBookHeader>Order Book ({CONTRACT_DICT[contract]})</OrderBookHeader>
      <OrderBookSpread>
        Spread: {spread.value} ({spread.percent}%)
      </OrderBookSpread>
      <OrderBookColumns>
        {COLUMN_NAMES.map((colName) => (
          <h4 key={colName}>{colName}</h4>
        ))}

        {COLUMN_NAMES_REVERSE.map((colName) => (
          <h4 key={colName}>{colName}</h4>
        ))}
      </OrderBookColumns>
      <BookBids />
      <BookAsks />
      <OrderBookActions>
        <Button onClick={() => swapContract()}>Toggle Feed</Button>
      </OrderBookActions>
    </OrderBookContainer>
  );
};

const OrderBookContainer = styled('section', {
  minHeight: '650px',
  display: 'grid',
  position: 'relative',
  border: '$border200 1px solid',
  gridTemplateAreas:
    '"name spread " "columns columns " "bids asks" "actions actions "',
  backgroundColor: '$bg',
  color: '$text',
  '@bp1': {
    maxHeight: '100vh',
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
  zIndex: 2,
});

const OrderBookActions = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gridArea: 'actions',
  padding: '1em',
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
const COLUMN_NAMES_REVERSE = [...COLUMN_NAMES].reverse();
