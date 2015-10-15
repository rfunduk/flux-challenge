import any from 'lodash/collection/any'

import isOnHomeworld from 'lib/is-on-homeworld'

// figure out which, if any, of the loaded siths
// match the current planet.
// if found, freeze the entire UI and cancel any
// pending/ongoing requests to load more siths
export default function checkHomeworlds( siths, planet ) {
  const onHomeworld = siths.filter( isOnHomeworld( planet ) )
  let frozen = false

  if( any( onHomeworld ) ) {
    frozen = true

    // cancel all pending requests
    // and set the rows back to null so
    // we can pick them up later as needing-to-be-loaded
    siths = siths.map( sith => {
      if( sith && sith.request ) {
        sith.request.abort()
        return null
      }
      else {
        return sith
      }
    } )
  }

  return { siths, frozen }
}
