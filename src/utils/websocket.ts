export const socket = new WebSocket('wss://www.cryptofacilities.com/ws/v1');

type ContractFactoryParams = {};

export function contractStringFactory(params: ContractFactoryParams) {
  const message = {};
}

socket.onopen = () => {
  socket.send(
    JSON.stringify({
      event: 'subscribe',
      feed: 'book_ui_1',
      product_ids: ['PI_XBTUSD'],
    }),
  );
};
