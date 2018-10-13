import React, { PureComponent } from 'react'
import { getRandomInt } from '../../helpers'
import enemyCar from '../../images/enemy.png'
import pothole from '../../images/pothole.png'
import './styles.css'

export default class Road extends PureComponent {
  initialEnemiesCoords = [
    { top: getRandomInt(-50, -150), left: `${getRandomInt(0, 80)}%` },
    { top: getRandomInt(-225, -300), left: `${getRandomInt(0, 80)}%` },
    { top: getRandomInt(-400, -500), left: `${getRandomInt(0, 80)}%` }
  ]

  initialPotsCoords = [
    { top: getRandomInt(-50, -100), left: `${getRandomInt(0, 80)}%` },
    { top: getRandomInt(-300, -400), left: `${getRandomInt(0, 80)}%` },
    { top: getRandomInt(-500, -600), left: `${getRandomInt(0, 80)}%` },
    { top: getRandomInt(-650, -700), left: `${getRandomInt(0, 80)}%` }
  ]

  carDown = (car) => {
    const { speed } = this.props
    let carCurrentTop = parseInt(car.style.top)
    if (carCurrentTop > this.container.clientHeight) {
      carCurrentTop = -200
      car.style.left = `${Math.random() * (this.container.clientWidth - car.clientWidth)}px`
    }
    car.style.top = `${carCurrentTop + speed}px`
  }

  lineDown = (line) => {
    const { lineSpeed } = this.props
    let lineCurrentTop = parseInt(line.style.top)
    if (lineCurrentTop > this.container.clientHeight) {
      lineCurrentTop = -300
    }
    line.style.top = `${lineCurrentTop + lineSpeed}px`
  }

  pitDown = (pit) => {
    const { lineSpeed } = this.props
    let pitCurrentTop = parseInt(pit.style.top)
    if (pitCurrentTop > this.container.clientHeight) {
      pitCurrentTop = -300
    }
    pit.style.top = `${pitCurrentTop + lineSpeed}px`
  }

  render () {
    const { children, lines, enemies, pots } = this.props
    return (
      <div>
        <div className='help'>
          <p>Controls: Right, Left, Up & Down arrow keys.</p>
        </div>
        <div className='road' ref={el => { this.container = el }}>
          {[-150, 150, 450].map((item, idx) => (
            <div key={idx} ref={el => { lines[idx] = el }} className='line' style={{ top: item }} />
          ))}
          {children(this.container)}
          {this.initialEnemiesCoords.map(({ top, left }, idx) => (
            <img
              src={enemyCar}
              key={idx}
              className='car'
              ref={el => { enemies[idx] = el }}
              style={{ top, left }}
              alt='enemy'
            />
          ))}
          {this.initialPotsCoords.map(({ top, left }, idx) => (
            <img
              key={idx}
              src={pothole}
              alt='pot'
              ref={el => { pots[idx] = el }}
              className='pot'
              style={{ top, left }}
            />
          ))}
        </div>
      </div>
    )
  }
}
