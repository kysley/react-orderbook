import React from 'react';
import { useAtomValue } from 'jotai/utils';
import { asksAtom } from '../../state';

export const BookAsks = () => {
  const asks = useAtomValue(asksAtom);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {asks.map((ask) => (
        <div key={ask[0]}>
          <span style={{ color: 'red' }}>{ask[0]}</span>
          {'-'}
          <span>{ask[1]}</span>
          {'-'}
          <span>{ask[2]}</span>
        </div>
      ))}
    </div>
  );
};
