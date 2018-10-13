import React, { Component } from 'react'
import './styles.css'
import cx from 'classnames'
import Score from './components/Score'
import Progress from './components/Progress'
import Hero from './components/Hero'
import { getRect } from './helpers'
import Road from './components/Road'
// import track from './track.mp3'

const initialState = {
  isGameOver: false,
  isGameActive: false,
  score: 1,
  tableScore: [],
  displayScore: 0,
  speed: 2,
  lineSpeed: 5,
  benefits: [0, 0],
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
    const { hasPot, hasCrash } = this.state
    if (this.hasCollision(this.hero, this.enemies) && !hasCrash) {
      this.setState(prev => ({
        hasCrash: true,
        speed: -2,
        lineSpeed: 0,
        savedSpeed: { speed: prev.speed, lineSpeed: prev.lineSpeed }
      }))
      setTimeout(() => (
        this.setState(({ savedSpeed, benefits }) => ({
          hasCrash: false,
          hasPot: false,
          speed: savedSpeed.speed + benefits[0],
          lineSpeed: savedSpeed.lineSpeed + benefits[1],
          benefits: [0, 0]
        }))
      ), 2000)
    }

    if (this.hasCollision(this.hero, this.pots) && !hasPot) {
      this.setState(prev => ({ hasPot: true, speed: prev.speed - 6, lineSpeed: prev.lineSpeed - 3 }))
      setTimeout(() => {
        this.setState(prev => {
          if (prev.hasCrash) return { benefits: [prev.benefits[0] + 6, prev.benefits[1] + 3] }
          return { hasPot: false, speed: prev.speed + 6, lineSpeed: prev.lineSpeed + 3 }
        })
      }, 1000)
    }

    this.calculateScore()

    if (this.state.lap === 6) {
      this.cancelGame()
      return
    }

    this.enemies.forEach(enemy => this.road.carDown(enemy))
    this.lines.forEach(line => this.road.lineDown(line))
    this.pots.forEach(pot => this.road.pitDown(pot))
    this.game = requestAnimationFrame(this.makeGame)
  }

  cancelGame = () => {
    this.setState({ isGameOver: true, isGameActive: false })
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

  calculateScore = () => {
    const { score, multiScore, hasPot, hasCrash } = this.state
    this.setState(prev => ({ score: prev.score + 1 }))
    if (!(score % 20)) {
      let ratio = multiScore ? 2 : 1
      ratio = hasPot ? ratio * 0.25 : ratio
      ratio = hasCrash ? 0 : ratio
      this.setState(prev => ({ displayScore: prev.displayScore + ratio }))
    }

    if (!(score % 1000)) {
      this.setState(prev => {
        const benefits = prev.hasCrash
          ? { benefits: [prev.benefits[0] + 1, prev.benefits[1] + 1] }
          : { speed: prev.speed + 1, lineSpeed: prev.lineSpeed + 1 }
        return {
          ...benefits,
          lap: prev.lap + 1,
          tableScore: [
            ...prev.tableScore,
            prev.displayScore - prev.tableScore.reduce((a, b) => a + b, 0)
          ]
        }
      })
    }
  }

  render () {
    const {
      isGameOver, displayScore, lap, score, hasCrash, hasPot, tableScore, isGameActive, speed, lineSpeed
    } = this.state
    return (
      <>
        <main className='main'>
          <Progress score={score} />
          <div className='wrap-road'>
            <Road
              speed={speed}
              lineSpeed={lineSpeed}
              lines={this.lines}
              enemies={this.enemies}
              pots={this.pots}
              ref={el => { this.road = el }}
            >
              {container => (
                <>
                  <Hero
                    setRef={el => { this.hero = el }}
                    isGameOver={isGameOver}
                    container={container}
                    changeMultiScore={this.changeMultiScore}
                    hasCrash={hasCrash}
                    hasPot={hasPot}
                    lap={lap}
                  />
                  <div className={cx('wrap-restart', { visible: isGameOver || !isGameActive })}>
                    <button className='restart' onClick={displayScore ? this.restartGame : this.startGame}>
                      {!displayScore ? 'Start' : 'Restart'}
                    </button>
                  </div>
                </>
              )}
            </Road>
            <button
              className={cx('action-game', { visible: displayScore && !isGameOver })}
              onClick={isGameActive ? this.stopGame : this.startGame}
            >
              {isGameActive ? 'Stop' : 'Resume'}
            </button>
          </div>
          <Score isGameActive={isGameActive} lap={lap} displayScore={displayScore} tableScore={tableScore} />
        </main>
      </>
    )
  }
}

export default App
