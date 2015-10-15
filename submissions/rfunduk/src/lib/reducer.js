import times from 'lodash/utility/times'

import checkHomeworlds from 'lib/check-homeworlds'
import { SCROLL_INCREMENT } from 'lib/scroll-rules'

export default function reducer( state, action ) {
  console.groupCollapsed( '=>', action.type )
  console.log( 'ACTION:', action )
  const newState = (ACTIONS[action.type]||ACTIONS.DEFAULT)( state, action )
  console.log( 'NEW STATE:', newState )
  console.groupEnd()
  return newState
}

const ACTIONS = {
  CHANGE_PLANET( state, action ) {
    return {
      ...state,
      planet: action.planet,
      ...checkHomeworlds( state.siths, action.planet )
    }
  },

  SCROLL( state, action ) {
    let siths = [ ...state.siths ]
    const fns = action.direction == 'DOWN' ? [ 'shift', 'push' ] :
                action.direction == 'UP' ? [ 'pop', 'unshift' ] : null
    if( !fns ) {
      throw new Error("Specify direction 'UP' or 'DOWN' to scroll.")
    }

    // remove 2 siths from the top or bottom...
    let newEntries = []
    times( SCROLL_INCREMENT, function() {
      const sith = siths[fns[0]]()
      // cancel any ongoing request for this
      // about-to-be-scrolled-out sith
      if( sith && sith.request ) { sith.request.abort() }
      newEntries.push( null )
    } )

    // ...and replace them with nulls on the other end
    siths[fns[1]]( ...newEntries )

    return {
      ...state,
      siths
    }
  },

  LOADING_SITH( state, action ) {
    let siths = [ ...state.siths ]
    siths[action.index] = {
      id: action.id,
      request: action.request
    }
    return {
      ...state,
      siths
    }
  },

  LOADED_SITH( state, action ) {
    let siths = [ ...state.siths ]

    // find index of the loaded sith
    // (it might have changed due to scrolling)
    const foundSith = siths.find( s => s && s.id == action.sith.id )
    const foundIndex = siths.indexOf( foundSith )

    // we should always find it because we cancel
    // requests for scrolled-out siths, but just in
    // case, let's be safe here
    if( foundIndex != -1 ) {
      // we should never get a loaded sith while frozen
      // because we cancel all pending requests.
      // however, browsers :)... so to keep with the spec
      // just paper over a loaded sith while frozen
      siths[foundIndex] = state.frozen ? null : action.sith
    }

    return {
      ...state,
      ...checkHomeworlds( siths, state.planet )
    }
  },

  DEFAULT( state, action ) {
    return state || {
      planet: { id: null, name: null },
      siths: [ null, null, null, null, null ],
      frozen: false
    }
  }
}
