import React, { PureComponent } from 'react'
import './styles.css'

export default class Score extends PureComponent {
  render () {
    const { lap, displayScore, tableScore } = this.props;
    return (
      <div className='wrap-score'>
        <p className='score'>Score: {displayScore}</p>
        <p className='lap'>Lap: {lap}</p>
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
