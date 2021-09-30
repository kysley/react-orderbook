# react-orderbook

Check it out here 👉 [react-orderbook.netlify.app](http://react-orderbook.netlify.app)
# Performance Considerations
Due to the rapid message rate from our websocket, all of the orderbook computations have been offloaded to a Web Worker. The Worker will parse the message, order the delta's present, and post a message back to the main thread for the UI to update.

The depth bars are also rendered with performance in mind by using rAF and offloading what little compositing to the gpu by using translateZ.
## Running locally

### yarn start

Runs the app in the development mode.
Open http://localhost:8080 to view it in the browser.

### yarn build

Builds a static copy of your site to the `build/` folder.
Your app is ready to be deployed!
