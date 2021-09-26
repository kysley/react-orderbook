import React from 'react';
import { useAtomValue } from 'jotai/utils';

import { asksAtom } from '../../state';
import { BookItem } from './book-item';
import { styled } from '../../utils/stitches.conf';

export const BookAsks = () => {
  const asks = useAtomValue(asksAtom);

  return (
    <BookAsksContainer>
      {asks.map((ask) => (
        <BookItem data={ask} kind="ask" key={ask[0]} />
      ))}
    </BookAsksContainer>
  );
};

const BookAsksContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
});
