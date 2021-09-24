import React, { useEffect } from 'react';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';

import { asksAtom, bidsAtom, updateAsksAtom, updateBidsAtom } from '../state';
import { socket } from '../utils/websocket';

export const BookBids = () => {
  const bids = useAtomValue(bidsAtom);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {bids.map((bid) => (
        <div key={bid[0]}>
          <span style={{ color: 'green' }}>{bid[0]}</span>
          {'-'}
          <span>{bid[1]}</span>
        </div>
      ))}
    </div>
  );
};

export const BookAsks = () => {
  const asks = useAtomValue(asksAtom);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {asks.map((ask) => (
        <div key={ask[0]}>
          <span style={{ color: 'red' }}>{ask[0]}</span>
          {'-'}
          <span>{ask[1]}</span>
        </div>
      ))}
    </div>
  );
};

export const OrderBook: React.FunctionComponent<{}> = () => {
  const updateBids = useUpdateAtom(updateBidsAtom);
  const updateAsks = useUpdateAtom(updateAsksAtom);

  useEffect(() => {
    let amt = -2;
    socket.onmessage = (e) => {
      if (amt === 0) {
        console.log('hey');
        const jsonData = JSON.parse(e.data);
        // console.log(jsonData);
        updateBids(jsonData.bids);
        updateAsks(jsonData.asks);
      }
      if (amt > 0 && amt < 1500) {
        const jsonData = JSON.parse(e.data);

        if (jsonData?.bids.length > 0) {
          updateBids(jsonData.bids);
        }
        if (jsonData?.asks.length > 0) {
          updateAsks(jsonData.asks);
        }
      }
      amt++;
    };
  }, []);

  return (
    <main style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      <BookBids />
      <BookAsks />
    </main>
  );
};
