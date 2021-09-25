import React from 'react';
import { useAtomValue } from 'jotai/utils';
import { asksAtom } from '../../state';
import { BookItem } from './book-item';

export const BookAsks = () => {
  const asks = useAtomValue(asksAtom);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {asks.map((ask) => (
        <BookItem data={ask} kind="ask" />
      ))}
    </div>
  );
};
