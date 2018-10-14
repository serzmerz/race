import React, { PureComponent } from 'react'
import { getRandomInt } from '../../helpers'
import enemyCar from '../../images/enemy.png'
import pothole from '../../images/pothole.png'
import './styles.css'

/**
 * Road component, render road, and animate objects on road
 */
export default class Road extends PureComponent {
  /**
   * initial coordinates for enemies
   * @type {*[]}
   */
  initialEnemiesCoords = [
    { top: getRandomInt(-50, -150), left: `${getRandomInt(0, 80)}%` },
    { top: getRandomInt(-225, -300), left: `${getRandomInt(0, 80)}%` },
    { top: getRandomInt(-400, -500), left: `${getRandomInt(0, 80)}%` }
  ]

  /**
   * initial coordinates for pots
   * @type {*[]}
   */
  initialPotsCoords = [
    { top: getRandomInt(-50, -100), left: `${getRandomInt(0, 80)}%` },
    { top: getRandomInt(-300, -400), left: `${getRandomInt(0, 80)}%` },
    { top: getRandomInt(-500, -600), left: `${getRandomInt(0, 80)}%` },
    { top: getRandomInt(-650, -700), left: `${getRandomInt(0, 80)}%` }
  ]

  /**
   * move car down
   * @param car
   */
  carDown = (car) => {
    const { speed } = this.props
    let carCurrentTop = parseInt(car.style.top)
    if (carCurrentTop > this.container.clientHeight) {
      carCurrentTop = -200
      car.style.left = `${Math.random() * (this.container.clientWidth - car.clientWidth)}px`
    }
    car.style.top = `${carCurrentTop + speed}px`
  }

  /**
   * move road line dow
   * @param line
   */
  lineDown = (line) => {
    const { lineSpeed } = this.props
    let lineCurrentTop = parseInt(line.style.top)
    if (lineCurrentTop > this.container.clientHeight) {
      lineCurrentTop = -300
    }
    line.style.top = `${lineCurrentTop + lineSpeed}px`
  }

  /**
   * move road pot dow
   * @param pot
   */
  potDown = (pot) => {
    const { lineSpeed } = this.props
    let lineCurrentTop = parseInt(pot.style.top)
    if (lineCurrentTop > this.container.clientHeight) {
      lineCurrentTop = -300
      pot.style.left = `${Math.random() * (this.container.clientWidth - pot.clientWidth)}px`
    }
    pot.style.top = `${lineCurrentTop + lineSpeed}px`
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
