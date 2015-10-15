import { render } from 'react-dom'
import { createStore } from 'redux'

import loadSiths from 'lib/load-siths'
import App from 'components/app'

const getReducer = function() { return require('lib/reducer') }
const store = createStore( getReducer() )

// hot reloading for store
if( module.hot ) {
  module.hot.accept( 'lib/reducer', function() {
    store.replaceReducer( getReducer() )
  } )
}

// new planets come over the websocket
new WebSocket( WEBSOCKET ).onmessage = function( e ) {
  const planet = JSON.parse( e.data )
  store.dispatch( { type: 'CHANGE_PLANET', planet } )
}

// re-render and kick off loading new siths
// whenever the store changes
store.subscribe( function() {
  const dispatch = store.dispatch.bind( store )
  const state = store.getState()

  render(
    <App {...{ dispatch, state }} />,
    document.getElementById('root')
  )

  // keep populating the list if applicable
  if( !state.frozen ) {
    requestAnimationFrame( function() {
      loadSiths( dispatch, state.siths )
    } )
  }
} )

// bootstrap!
store.dispatch( { type: 'INIT' } )
