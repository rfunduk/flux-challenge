import classNames from 'classnames'

import isOnHomeworld from 'lib/is-on-homeworld'
import { firstHasMaster, lastHasApprentice, wontClearList } from 'lib/scroll-rules'

import SithList from 'components/sith-list'

export default class App extends React.Component {
  render() {
    const { planet, siths, frozen } = this.props.state
    const canScrollUp = wontClearList( siths, 'bottom' ) && firstHasMaster( siths )
    const canScrollDown = wontClearList( siths, 'top' ) && lastHasApprentice( siths )

    return (
      <div className='app-container'>
        <div className='css-root'>
          <h1 className='css-planet-monitor'>Obi-Wan currently on {planet.name}</h1>

          <section className='css-scrollable-list'>
            <SithList siths={siths} isOnHomeworld={isOnHomeworld(planet)} />

            <div className='css-scroll-buttons'>
              <button className={classNames('css-button-up', { 'css-button-disabled': !canScrollUp })}
                      onClick={!frozen && canScrollUp && this.scrollUp}></button>
              <button className={classNames('css-button-down', { 'css-button-disabled': !canScrollDown })}
                      onClick={!frozen && canScrollDown && this.scrollDown}></button>
            </div>
          </section>
        </div>
      </div>
    )
  }

  scrollDown = () => { this.props.dispatch( { type: 'SCROLL', direction: 'DOWN' } ) }
  scrollUp = () => { this.props.dispatch( { type: 'SCROLL', direction: 'UP' } ) }
}
