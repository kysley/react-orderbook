import React from 'react';
import { useAtomValue } from 'jotai/utils';
import { bidsAtom } from '../../state';

export const BookBids = () => {
  const bids = useAtomValue(bidsAtom);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {bids.map((bid) => (
        <div key={bid[0]}>
          <span style={{ color: 'green' }}>{bid[0]}</span>
          {'-'}
          <span>{bid[1]}</span>
          {'-'}
          <span>{bid[2]}</span>
        </div>
      ))}
    </div>
  );
};
