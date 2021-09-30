import type {
  OrderBookAction,
  OrderBookData,
  OrderBookStateAction,
  SpreadState,
} from '../state';

export type EventMessage = {
  feed: string;
  product_id: string;
  bids: OrderBookAction;
  asks: OrderBookAction;
  numLevels?: number;
  event?: 'subscribed' | 'unsubscribed' | undefined;
};
class OrderBookController {
  bids: OrderBookData = [];
  asks: OrderBookData = [];
  highestTotal: number = 0;
  spread: SpreadState = { value: 0, percent: 0 };

  ingest(message: MessageEvent['data']): OrderBookStateAction {
    const messageData = JSON.parse(message) as EventMessage;

    if (messageData.event === 'unsubscribed') {
      this.bids = [];
      this.asks = [];
      this.highestTotal = 0;
      this.spread = { value: 0, percent: 0 };
      return this;
    }

    if (messageData.asks) {
      const nextAsks = this.processAsks(messageData.asks);
      this.asks = nextAsks;
    }
    if (messageData.bids) {
      const nextBids = this.processBids(messageData.bids);
      this.bids = nextBids;
    }

    const highestBid = this.bids.length
      ? this.bids[this.bids.length - 1][2]
      : 0;
    const highestAsk = this.asks.length
      ? this.asks[this.asks.length - 1][2]
      : 0;

    const firstBid = this.bids.length ? this.bids[0][0] : 0;
    const firstAsk = this.asks.length ? this.asks[0][0] : 0;

    this.highestTotal = Math.max(highestBid, highestAsk);

    const spread = {
      value: Number(Math.abs(firstBid - firstAsk).toFixed(1)),
      percent: Number(Math.abs(100 - (firstBid / firstAsk) * 100).toFixed(2)),
    };
    this.spread = spread;
    return this;
  }

  processBids(incomingBids: OrderBookAction): OrderBookData {
    if (!Array.isArray(incomingBids)) {
      throw new Error(
        `Unrecognized bid data format, expected array, got ${typeof incomingBids}`,
      );
    }
    const nextBids: Record<string, number> = Object.fromEntries(this.bids);

    incomingBids.forEach((bid) => {
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

    return bidsWithTotal;
  }

  processAsks(incomingAsks: OrderBookAction): OrderBookData {
    if (!Array.isArray(incomingAsks)) {
      throw new Error(
        `Unrecognized bid data format, expected array, got ${typeof incomingAsks}`,
      );
    }
    const nextAsks: Record<string, number> = Object.fromEntries(this.asks);

    incomingAsks.forEach((ask) => {
      const [price, size] = ask;
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
      asArray.length = 25;
    }

    let prevTotal = 0;
    const asksWithTotal: OrderBookData = asArray.map((ask, idx) => {
      const [price, size] = ask;
      const numericPrice = Number(price);
      prevTotal += size;

      return [numericPrice, size, prevTotal];
    });
    return asksWithTotal;
  }
}

const controller = new OrderBookController();
onmessage = (data: MessageEvent['data']) => {
  const result = controller.ingest(data.data);
  self.postMessage(result);
};
