import SithRow from 'components/sith-row'

export default class SithList extends React.Component {
  render() {
    // if a specific row is still loading, we should
    // just treat it as an empty row
    const siths = this.props.siths.map( sith => !sith || sith.request ? null : sith )
    const isOnHomeworld = this.props.isOnHomeworld

    return (
      <ul className='css-slots'>
        {
          siths.map( ( sith, i ) =>
            <SithRow key={i}
                     sith={sith}
                     isOnHomeworld={isOnHomeworld} />
          )
        }
      </ul>
    )
  }
}
