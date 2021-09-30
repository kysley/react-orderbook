import React from 'react';
import { useAtomValue } from 'jotai/utils';

import { bidsAtom, highestTotalAtom } from '../../state';
import { BookItem } from './book-item';
import { styled } from '../../utils/stitches.conf';

export const BookBids = () => {
  const bids = useAtomValue(bidsAtom);
  const highest = useAtomValue(highestTotalAtom);

  return (
    <BookBidsContainer>
      {bids.map((bid) => (
        <BookItem
          data={bid}
          kind="bid"
          key={`bid-${bid[0]}`}
          width={`${(bid[2] / highest) * 100}%`}
        />
      ))}
    </BookBidsContainer>
  );
};

const BookBidsContainer = styled('div', {
  gridArea: 'bids',
  width: '300px',
  '@bp1': {
    height: '40vh',
    overflowY: 'scroll',
  },
});
