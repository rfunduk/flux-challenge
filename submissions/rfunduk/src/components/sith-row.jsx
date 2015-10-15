export default class SithRow extends React.Component {
  render() {
    const { sith, isOnHomeworld } = this.props
    const styles = isOnHomeworld( sith ) ? { color: 'red' } : null
    return (
      <li className='css-slot' style={styles}>
        <h3>{sith && sith.name}</h3>
        { sith &&
          <h6>Homeworld: {sith && sith.homeworld.name}</h6> }
      </li>
    )
  }
}
