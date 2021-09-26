import React from 'react';

import type { OrderBookItem } from '../../state';
import { styled } from '../../utils/stitches.conf';

type BookItemProps = {
  kind: 'bid' | 'ask';
  data: OrderBookItem;
};

export const BookItem: React.FunctionComponent<BookItemProps> = ({
  kind,
  data,
}) => {
  return (
    <BookItemContainer flipped={kind === 'bid'}>
      {data.map((value, idx) => (
        <BookItemWrapper colored={idx === 0} kind={kind}>
          <span>
            {idx === 0 ? (
              <>{value.toLocaleString('en-us', { minimumFractionDigits: 2 })}</>
            ) : (
              <>{value.toLocaleString('en-us')}</>
            )}
          </span>
        </BookItemWrapper>
      ))}
    </BookItemContainer>
  );
};

const BookItemContainer = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  margin: 0,

  variants: {
    flipped: {
      true: {
        flexDirection: 'row-reverse',
      },
    },
  },
});

const BookItemWrapper = styled('div', {
  textAlign: 'right',
  width: '100%',
  variants: {
    colored: {
      false: {
        color: '$text',
      },
      true: {
        color: 'inherit',
      },
    },
    kind: {
      bid: {
        color: '$green',
      },
      ask: {
        color: '$red',
      },
    },
  },
  compoundVariants: [
    {
      colored: false,
      kind: 'ask',
      css: {
        color: '$text',
      },
    },
  ],
});
