import React from 'react';
import { animated } from 'react-spring';

import type { OrderBookItem } from '../../state';
import { styled } from '../../utils/stitches.conf';

type BookItemProps = {
  kind: 'bid' | 'ask';
  data: OrderBookItem;
  highest: number;
};

/*
  Another option for rendering the depth bar
  here would be using translateX: depth%
  I ran into orientation issues using this method though,
  since you translate by +depth and -depth depending on if
  youre rendering a bid or ask respectively.

  The performance difference seems negligible during
  benchmarking, so i went with the easier approach.

  I also added the translateZ "hack" to try to offload the
  rendering to the gpu
*/

export const BookItem: React.FunctionComponent<BookItemProps> = ({
  kind,
  data,
  highest,
}) => {
  return (
    <BookItemContainer flipped={kind === 'bid'}>
      <BookItemWrapper colored kind={kind}>
        <span>
          {data[0].toLocaleString('en-us', { minimumFractionDigits: 2 })}
        </span>
      </BookItemWrapper>
      <BookItemWrapper kind={kind}>
        <span>{data[1].toLocaleString('en-us')}</span>
      </BookItemWrapper>
      <BookItemWrapper kind={kind}>
        <span>{data[2].toLocaleString('en-us')}</span>
      </BookItemWrapper>
      <BookItemDepth
        style={{
          width: `${(data[2] / highest) * 100}%`,
          translateZ: 0,
        }}
        kind={kind}
      />
    </BookItemContainer>
  );
};

const BookItemContainer = styled('div', {
  display: 'flex',
  height: '25px',
  position: 'relative',
  overflow: 'hidden',

  variants: {
    flipped: {
      true: {
        direction: 'rtl',
        '@bp1': {
          direction: 'ltr',
        },
      },
    },
  },
});

const BookItemWrapper = styled('div', {
  textAlign: 'right',
  width: '100%',
  zIndex: 1,
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
    {
      colored: false,
      kind: 'bid',
      css: {
        color: '$text',
      },
    },
  ],
  defaultVariants: {
    colored: false,
  },
});

const BookItemDepth = styled(animated.div, {
  height: '100%',
  width: '100%',
  position: 'absolute',
  zIndex: 0,
  variants: {
    kind: {
      ask: {
        backgroundColor: '$bgRed',
      },
      bid: {
        backgroundColor: '$bgGreen',
        '@bp1': {
          left: 0,
        },
      },
    },
  },
});
