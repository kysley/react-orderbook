import { atom } from 'jotai';

import { CONTRACTS } from '../utils/constants';

export type OrderBookItem = [number, number, number];
export type OrderBookData = OrderBookItem[];
export type OrderBookAction = [number, number][];
export type SpreadState = { value: number; percent: number };

export type OrderBookStateAction = {
  asks: OrderBookData;
  bids: OrderBookData;
  spread: SpreadState;
  highestTotal: number;
};

export const bidsAtom = atom<OrderBookData>([]);
export const asksAtom = atom<OrderBookData>([]);

export const spreadAtom = atom<SpreadState>({ value: 0, percent: 0 });

export const highestTotalAtom = atom(0);

export const updateOrderBookState = atom(
  null,
  (get, set, action: OrderBookStateAction) => {
    if (action.asks.length) {
      set(asksAtom, action.asks);
    }
    if (action.bids.length) {
      set(bidsAtom, action.bids);
    }
    if (action.spread) {
      set(spreadAtom, action.spread);
    }
    if (action.highestTotal) {
      set(highestTotalAtom, action.highestTotal);
    }
  },
);

export const contractAtom = atom(CONTRACTS.XBT_USD);

export const updateContractAtom = atom(null, (get, set) => {
  const currentContract = get(contractAtom);
  // We can get away with this because we are only
  // toggling between 2 contracts
  // If there was selection from a list, you would set the contract
  // based on the action
  if (currentContract === CONTRACTS.XBT_USD) {
    set(contractAtom, CONTRACTS.ETH_USD);
  } else {
    set(contractAtom, CONTRACTS.XBT_USD);
  }
  set(bidsAtom, []);
  set(asksAtom, []);
});

export const subscribeMessageAtom = atom((get) => {
  const contract = get(contractAtom);
  return `{"event":"subscribe","feed":"book_ui_1","product_ids":["${contract}"]}`;
});

export const unsubscribeMessageAtom = atom((get) => {
  const contract = get(contractAtom);
  // If we had N options I would keep an atom for the previus selection
  // maybe for a csgo QQ-style order book swap, haha
  const prevContract =
    contract === CONTRACTS.ETH_USD ? CONTRACTS.XBT_USD : CONTRACTS.ETH_USD;
  return `{"event":"unsubscribe","feed":"book_ui_1","product_ids":["${prevContract}"]}`;
});

export const debugIntervalAtom = atom(1000);

/*
  #####
  Old order book logic before moving work to a Web Worker
  #####

*/

// export const updateBidsAtom = atom(
//   null,
//   (get, set, action: OrderBookAction) => {
//     const currentBids = get(bidsAtom);

//     const nextBids: Record<string, number> = Object.fromEntries(currentBids);

//     action.forEach((bid) => {
//       const [price, size] = bid;
//       if (size === 0) {
//         delete nextBids[price];
//         return;
//       }
//       nextBids[price] = size;
//     });

//     // turn object back into array of price,size
//     const asArray = Object.entries(nextBids);

//     asArray.sort((a, b) => {
//       return Number(b[0]) - Number(a[0]);
//     });

//     // cull extra bids before after sorting
//     if (asArray.length >= 26) {
//       // console.log('too many bids');
//       asArray.length = 25;
//     }

//     let prevTotal = 0;
//     const bidsWithTotal: OrderBookData = asArray.map((bid, idx) => {
//       const [price, size] = bid;
//       const numericPrice = Number(price);
//       prevTotal += size;
//       if (idx === 0) {
//         return [numericPrice, size, size];
//       } else {
//         return [numericPrice, size, prevTotal];
//       }
//     });

//     set(bidsAtom, bidsWithTotal);
//   },
// );

// export const updateAsksAtom = atom(
//   null,
//   (get, set, action: OrderBookAction) => {
//     const currentAsks = get(asksAtom);

//     const nextAsks: Record<string, number> = Object.fromEntries(currentAsks);

//     action.forEach((bid) => {
//       const [price, size] = bid;
//       if (size === 0) {
//         delete nextAsks[price];
//         return;
//       }
//       nextAsks[price] = size;
//     });

//     // turn object back into array of price,size
//     const asArray = Object.entries(nextAsks);

//     asArray.sort((a, b) => {
//       return Number(a[0]) - Number(b[0]);
//     });

//     // cull extra asks before after sorting
//     if (asArray.length >= 26) {
//       // console.log('too many asks');
//       asArray.length = 25;
//     }

//     let prevTotal = 0;
//     const asksWithTotal: OrderBookData = asArray.map((ask, idx) => {
//       const [price, size] = ask;
//       const numericPrice = Number(price);
//       prevTotal += size;
//       if (idx === 0) {
//         return [numericPrice, size, size];
//       } else {
//         return [numericPrice, size, prevTotal];
//       }
//     });

//     set(asksAtom, asksWithTotal);
//   },
// );

// export const spreadAtom = atom((get) => {
//   const topAsk = get(asksAtom)[0] || [0, 0];
//   const topBid = get(bidsAtom)[0] || [0, 0];

//   return topAsk[0] - topBid[0];
// });

// export const highestBidAtom = atom((get) => {
//   const bids = get(bidsAtom);
//   return bids[bids.length - 1] || [1, 1, 1];
// });

// export const highestAskAtom = atom((get) => {
//   const asks = get(asksAtom);

//   return asks[asks.length - 1] || [1, 1, 1];
// });
