import React from 'react';
import { useAtomValue } from 'jotai/utils';

import { bidsAtom } from '../../state';
import { BookItem } from './book-item';
import { styled } from '../../utils/stitches.conf';

export const BookBids = () => {
  const bids = useAtomValue(bidsAtom);

  return (
    <BookBidsContainer>
      {bids.map((bid) => (
        <BookItem data={bid} kind="bid" key={bid[0]} />
      ))}
    </BookBidsContainer>
  );
};

const BookBidsContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gridArea: 'bids',
});
