import find from 'lodash/collection/find'
import findLast from 'lodash/collection/findLast'
import any from 'lodash/collection/any'

export const SCROLL_INCREMENT = 2

export function firstHasMaster( siths ) {
  const firstLoadedSith = find( siths, sith => sith && sith.id && !sith.request )
  return firstLoadedSith && firstLoadedSith.master && firstLoadedSith.master.id
}

export function lastHasApprentice( siths ) {
  const lastLoadedSith = findLast( siths, sith => sith && sith.id && !sith.request )
  return lastLoadedSith && lastLoadedSith.apprentice && lastLoadedSith.apprentice.id
}

export function wontClearList( siths, side ) {
  const args = side == 'bottom' ? [ 0, -(SCROLL_INCREMENT + 1) ] :
               side == 'top' ? [ SCROLL_INCREMENT + 1 ] : null
  if( !args ) { throw new Error("side to check must be 'top' or 'bottom'") }
  return any( siths.slice( ...args ) )
}
