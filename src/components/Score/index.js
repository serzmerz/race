import React, { PureComponent } from 'react'
import './styles.css'

/**
 * Component for displaying score, table score for each lap
 */
export default class Score extends PureComponent {
  render () {
    const { isGameActive, lap, displayScore, tableScore } = this.props
    return (
      <div className='wrap-score'>
        <p className='score'>Score: {displayScore}</p>
        <p className='lap'>{isGameActive ? `Lap: ${lap}` : 'Start the game'}</p>
        <table>
          <tbody>
            {tableScore.map((score, idx) => (
              <tr key={idx}><td>Lap {idx + 1}</td><td>{score}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}
