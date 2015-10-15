import superagent from 'superagent'

export default function loadSiths( dispatch, siths ) {
  // determine which siths we can load and kick off requests

  let toLoad = []
  let foundAny = false

  siths.forEach( ( sith, i ) => {
    if( sith == null ) {
      // we can look up this index if we have an
      // adjacent row to base the request on

      const prev = i > 0 && siths[i-1]
      const next = i < (siths.length - 1) && siths[i+1]

      if( prev && prev.apprentice && prev.apprentice.id ) {
        toLoad.push( { index: i, id: prev.apprentice.id } )
      }
      if( next && next.master && next.master.id ) {
        toLoad.push( { index: i, id: next.master.id } )
      }
    }
    else {
      foundAny = true
    }
  } )
  if( !foundAny && toLoad.length == 0 ) {
    // load Sidious
    toLoad.push( { index: 2, id: 3616 } )
  }

  toLoad.forEach( ( { index, id } ) => {
    let action = { type: 'LOADING_SITH', index, id }
    action.request = superagent
      .get( `${API_BASE}/dark-jedis/${id}` )
      .end( ( err, r ) => {
        if( err ) {
          throw new Error(`Could not load sith ${id}. Maybe the server is down?`)
        }
        dispatch( { type: 'LOADED_SITH', sith: r.body } )
      } )
    dispatch( action )
  } )
}
