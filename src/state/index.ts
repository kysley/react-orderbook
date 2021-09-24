import { atom } from 'jotai';

export const bidsAtom = atom<[number | string, number][]>([]);
export const asksAtom = atom<[number | string, number][]>([]);

export const updateBidsAtom = atom(
  null,
  (get, set, action: [number, number][]) => {
    const currentBids = get(bidsAtom);

    const nextBids = Object.fromEntries(currentBids);

    action.forEach((bid) => {
      const [price, size] = bid;
      if (size === 0) {
        delete nextBids[price];
        return;
      }
      nextBids[price] = size;
    });

    // turn object back into array of price,size
    const asArray = Object.entries(nextBids);

    asArray.sort((a, b) => {
      return Number(b[0]) - Number(a[0]);
    });

    // cull extra bids before after sorting
    if (asArray.length >= 26) {
      console.log('too many bids');
      asArray.length = 25;
    }

    set(bidsAtom, asArray);
  },
);

export const updateAsksAtom = atom(
  null,
  (get, set, action: [number, number][]) => {
    const currentAsks = get(asksAtom);

    const nextAsks = Object.fromEntries(currentAsks);

    action.forEach((bid) => {
      const [price, size] = bid;
      if (size === 0) {
        delete nextAsks[price];
        return;
      }
      nextAsks[price] = size;
    });

    // turn object back into array of price,size
    const asArray = Object.entries(nextAsks);

    asArray.sort((a, b) => {
      return Number(a[0]) - Number(b[0]);
    });

    // cull extra bids before after sorting
    if (asArray.length >= 26) {
      console.log('too many bids');
      asArray.length = 25;
    }

    set(asksAtom, asArray);
  },
);
