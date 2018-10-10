import React, { Component } from 'react'
import './styles.css'
import cx from 'classnames'
import Score from './components/Score'
import Progress from './components/Progress'
import Hero from './components/Hero'
import { getRect } from './helpers'
import Road from './components/Road'
// import track from './track.mp3'
import enemyCar from './images/enemy.png'
import pothole from './images/pothole.png'

const initialState = {
  isGameOver: false,
  isGameActive: false,
  score: 1,
  tableScore: [],
  displayScore: 0,
  speed: 2,
  lineSpeed: 5,
  lap: 1,
  multiScore: false,
  hasPot: false,
  hasCrash: false
}

class App extends Component {
  state = initialState

  enemies = []

  lines = []

  pots = []

  startGame = () => {
    this.setState({ isGameActive: true })
    this.game = requestAnimationFrame(this.makeGame)
    // const audio = new Audio(track)
    // audio.play()
  }

  restartGame = () => {
    this.setState(initialState, this.startGame)
  }

  changeMultiScore = (value) => this.setState({ multiScore: value })

  makeGame = () => {
    const { score, hasPot, multiScore, hasCrash } = this.state
    if (this.hasCollision(this.hero, this.enemies) && !hasCrash) {
      this.setState(prev => ({
        hasCrash: true,
        speed: -2,
        lineSpeed: 0,
        savedSpeed: { speed: prev.speed, lineSpeed: prev.lineSpeed }
      }))
      setTimeout(() => (
        this.setState(
          ({ savedSpeed, hasPot }) => {
            if (hasPot) {
              return {
                hasCrash: false,
                hasPot: false,
                speed: savedSpeed.speed + 6,
                lineSpeed: savedSpeed.lineSpeed + 3
              }
            }
            return { hasCrash: false, speed: savedSpeed.speed, lineSpeed: savedSpeed.lineSpeed }
          }
        )
      ), 2000)
    }

    if (this.hasCollision(this.hero, this.pots) && !hasPot) {
      this.setState(prev => ({ hasPot: true, speed: prev.speed - 6, lineSpeed: prev.lineSpeed - 3 }))
      setTimeout(() => {
        this.setState(prev => {
          if (prev.hasCrash) return {}
          return { hasPot: false, speed: prev.speed + 6, lineSpeed: prev.lineSpeed + 3 }
        })
      }, 1000)
    }

    this.setState(prev => ({ score: prev.score + 1 }))
    if (!(score % 20)) {
      let ratio = multiScore ? 2 : 1
      ratio = hasPot ? ratio * 0.25 : ratio
      ratio = hasCrash ? 0 : ratio
      this.setState(prev => ({ displayScore: prev.displayScore + ratio }))
    }

    if (!(score % 1000)) {
      this.setState(prev => ({
        lap: prev.lap + 1,
        speed: prev.speed + 1,
        lineSpeed: prev.lineSpeed + 1,
        tableScore: [...prev.tableScore, prev.displayScore]
      }))
    }

    if (this.state.lap === 6) {
      this.cancelGame()
      return
    }

    this.enemies.forEach(enemy => this.carDown(enemy))
    this.lines.forEach(line => this.lineDown(line))
    this.pots.forEach(pot => this.pitDown(pot))
    this.game = requestAnimationFrame(this.makeGame)
  }

  cancelGame = () => {
    this.setState({ isGameOver: true })
    cancelAnimationFrame(this.game)
  }

  stopGame = () => {
    this.setState({ isGameActive: false })
    cancelAnimationFrame(this.game)
  }

  hasCollision = (hero, enemies) => {
    return enemies.some(enemy => {
      const heroRect = getRect(hero)
      const enemyRect = getRect(enemy)
      return !(
        heroRect.bottom < enemyRect.top ||
        heroRect.top > enemyRect.bottom ||
        heroRect.right < enemyRect.left ||
        heroRect.left > enemyRect.right
      )
    })
  }

  carDown = (car) => {
    const { speed } = this.state
    let carCurrentTop = parseInt(car.style.top)
    if (carCurrentTop > this.container.clientHeight) {
      carCurrentTop = -200
      car.style.left = `${Math.random() * (this.container.clientWidth - car.clientWidth)}px`
    }
    car.style.top = `${carCurrentTop + speed}px`
  }

  lineDown = (line) => {
    const { lineSpeed } = this.state
    let lineCurrentTop = parseInt(line.style.top)
    if (lineCurrentTop > this.container.clientHeight) {
      lineCurrentTop = -300
    }
    line.style.top = `${lineCurrentTop + lineSpeed}px`
  }

  pitDown = (pit) => {
    const { lineSpeed } = this.state
    let pitCurrentTop = parseInt(pit.style.top)
    if (pitCurrentTop > this.container.clientHeight) {
      pitCurrentTop = -300
    }
    pit.style.top = `${pitCurrentTop + lineSpeed}px`
  }

  render () {
    const { isGameOver, displayScore, lap, score, hasCrash, hasPot, tableScore, isGameActive } = this.state
    return (
      <>
        <main className='main'>
          <Progress score={score} />
          <div className='wrap-road'>
            <Road setRef={el => { this.container = el }} lines={this.lines}>
              <Hero
                setRef={el => { this.hero = el }}
                isGameOver={isGameOver}
                container={this.container}
                changeMultiScore={this.changeMultiScore}
                hasCrash={hasCrash}
                hasPot={hasPot}
                lap={lap}
              />
              {[{ top: -100, left: '30%' },
                { top: -200, left: '50%' },
                { top: -350, left: '70%' }
              ].map(({ top, left }, idx) => (
                <img
                  src={enemyCar}
                  key={idx}
                  className='car'
                  ref={el => { this.enemies[idx] = el }}
                  style={{ top, left }}
                  alt='enemy'
                />
              ))}
              {[{ top: -80, left: '20%' },
                { top: -180, left: '40%' },
                { top: -300, left: '80%' }
              ].map(({ top, left }, idx) => (
                <img
                  key={idx}
                  src={pothole}
                  alt='pot'
                  ref={el => { this.pots[idx] = el }}
                  className='pot'
                  style={{ top, left }}
                />
              ))}
              <div className={cx('wrap-restart', { visible: isGameOver || !isGameActive })}>
                <button className='restart' onClick={displayScore ? this.restartGame : this.startGame}>
                  {!displayScore ? 'Start' : 'Restart'}
                </button>
              </div>
            </Road>
            <button
              className={cx('action-game', { visible: displayScore && !isGameOver })}
              onClick={isGameActive ? this.stopGame : this.startGame}
            >
              {isGameActive ? 'Stop' : 'Resume'}
            </button>
          </div>
          <Score lap={lap} displayScore={displayScore} tableScore={tableScore} />
        </main>
      </>
    )
  }
}

export default App
