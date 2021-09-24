import { atom } from 'jotai';

type OrderBookItem = [number, number, number];
type OrderBookData = OrderBookItem[];
type OrderBookAction = [number, number][];

export const bidsAtom = atom<OrderBookData>([]);
export const asksAtom = atom<OrderBookData>([]);

export const updateBidsAtom = atom(
  null,
  (get, set, action: OrderBookAction) => {
    const currentBids = get(bidsAtom);

    const nextBids: Record<string, number> = Object.fromEntries(currentBids);

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

    let prevTotal = 0;
    const bidsWithTotal: OrderBookData = asArray.map((bid, idx) => {
      const [price, size] = bid;
      const numericPrice = Number(price);
      prevTotal += size;
      if (idx === 0) {
        return [numericPrice, size, size];
      } else {
        return [numericPrice, size, prevTotal];
      }
    });

    set(bidsAtom, bidsWithTotal);
  },
);

export const updateAsksAtom = atom(
  null,
  (get, set, action: OrderBookAction) => {
    const currentAsks = get(asksAtom);

    const nextAsks: Record<string, number> = Object.fromEntries(currentAsks);

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

    // cull extra asks before after sorting
    if (asArray.length >= 26) {
      console.log('too many asks');
      asArray.length = 25;
    }

    let prevTotal = 0;
    const asksWithTotal: OrderBookData = asArray.map((ask, idx) => {
      const [price, size] = ask;
      const numericPrice = Number(price);
      prevTotal += size;
      if (idx === 0) {
        return [numericPrice, size, size];
      } else {
        return [numericPrice, size, prevTotal];
      }
    });

    set(asksAtom, asksWithTotal);
  },
);

export const spreadAtom = atom((get) => {
  const topAsk = get(asksAtom)[0] || [0, 0];
  const topBid = get(bidsAtom)[0] || [0, 0];

  return topAsk[0] - topBid[0];
});
