import React from 'react';

import type { OrderBookItem } from '../../state';
import { styled } from '../../utils/stitches.conf';

type BidProps = {
  kind: 'bid' | 'ask';
  data: OrderBookItem;
};

export const BookItem: React.FunctionComponent<BidProps> = ({ kind, data }) => {
  return (
    <BookItemP flipped={kind === 'bid'}>
      {data.map((value, idx) => (
        <BookItemSpan kind={kind} type={idx}>
          {value}
        </BookItemSpan>
      ))}
    </BookItemP>
  );
};

export const BookItemP = styled('p', {
  display: 'flex',
  justifyContent: 'space-between',
  margin: 0,

  variants: {
    flipped: {
      true: {
        flexDirection: 'row-reverse',
      },
    },
  },
});

//kind = which color
//type = if colored
export const BookItemSpan = styled('span', {
  color: 'White',
  textAlign: 'right',
  flex: 1,
  variants: {
    type: {
      '0': {
        color: 'white',
      },
      '1': {
        color: 'white !important', // this is bad
      },
      '2': {
        color: 'white !important', // this is bad
      },
    },
    kind: {
      ask: {
        color: 'red',
      },
      bid: {
        color: 'green',
      },
    },
  },
});
