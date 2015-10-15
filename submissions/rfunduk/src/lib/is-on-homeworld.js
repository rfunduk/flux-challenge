export default function isOnHomeworld( planet ) {
  return sith => sith && sith.homeworld && sith.homeworld.id == planet.id
}
