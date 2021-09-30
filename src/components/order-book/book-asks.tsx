import React from 'react';
import { useAtomValue } from 'jotai/utils';

import { asksAtom, highestTotalAtom } from '../../state';
import { BookItem } from './book-item';
import { styled } from '../../utils/stitches.conf';

export const BookAsks = () => {
  const asks = useAtomValue(asksAtom);
  const highest = useAtomValue(highestTotalAtom);

  return (
    <BookAsksContainer>
      {asks.map((ask) => (
        <BookItem
          data={ask}
          kind="ask"
          key={`ask-${ask[0]}`}
          width={`${(ask[2] / highest) * 100}%`}
        />
      ))}
    </BookAsksContainer>
  );
};

const BookAsksContainer = styled('div', {
  gridArea: 'asks',
  width: '300px',
  '@bp1': {
    height: '40vh',
    overflowY: 'scroll',
  },
});
