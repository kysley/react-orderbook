import React from 'react';
import { useAtomValue } from 'jotai/utils';
import { bidsAtom } from '../../state';
import { BookItem } from './book-item';

export const BookBids = () => {
  const bids = useAtomValue(bidsAtom);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {bids.map((bid) => (
        <BookItem data={bid} kind="bid" />
      ))}
    </div>
  );
};
