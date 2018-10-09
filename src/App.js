import React, { Component } from 'react'
import './styles.css'
import Progress from './components/Progress'
import Hero from './components/Hero'
import { getRect } from './helpers'
import Road from './components/Road'
// import track from './track.mp3'
import enemyCar from './images/enemy.png'
import pothole from './images/pothole.png'

class App extends Component {
  state = {
    isGameOver: false,
    score: 0,
    displayScore: 0,
    speed: 2,
    lineSpeed: 5,
    lap: 1,
    multiScore: false,
    getPot: false,
  }

  enemies = []

  lines = []

  pots = []

  componentDidMount () {
    this.game = requestAnimationFrame(this.startGame)
    // const audio = new Audio(track)
    // audio.play()
  }

  changeMultiScore = (value) => this.setState({ multiScore: value })

  startGame = () => {
    const { score, hasPot, multiScore } = this.state;
    if (this.hasCollision(this.hero, this.enemies)) {
      this.stopGame()
      console.log('stop game')
      return
    }

    if (this.hasCollision(this.hero, this.pots) && !hasPot) {
      this.setState(prev => ({ hasPot: true, speed: prev.speed - 6, lineSpeed: prev.lineSpeed - 3 }))
      setTimeout(() => (
        this.setState(prev => ({ hasPot: false, speed: prev.speed + 6, lineSpeed: prev.lineSpeed + 3 }))
      ), 1000)
    }

    this.setState(prev => ({ score: prev.score + 1 }))
    if (!(score % 20)) {
      let ratio = multiScore ? 2 : 1;
      ratio = hasPot ? ratio * 0.25 : ratio;
      this.setState(prev => ({ displayScore: prev.displayScore + ratio }))
    }

    if (!(score % 1000)) {
      this.setState(prev => ({ lap: prev.lap + 1, speed: prev.speed + 1, lineSpeed: prev.lineSpeed + 1 }))
    }

    this.enemies.forEach(enemy => this.carDown(enemy))
    this.lines.forEach(line => this.lineDown(line))
    this.pots.forEach(pot => this.pitDown(pot))
    this.game = requestAnimationFrame(this.startGame)
  }

  stopGame = () => {
    this.setState({ isGameOver: true })
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
    let lineCurrentTop = parseInt(line.style.top);
    if (lineCurrentTop > this.container.clientHeight) {
      lineCurrentTop = -300;
    }
    line.style.top = `${lineCurrentTop + lineSpeed}px`;
  }

  pitDown = (pit) => {
    const { lineSpeed } = this.state
    let pitCurrentTop = parseInt(pit.style.top);
    if (pitCurrentTop > this.container.clientHeight) {
      pitCurrentTop = -300;
    }
    pit.style.top = `${pitCurrentTop + lineSpeed}px`;
  }

  render () {
    const { isGameOver, displayScore, lap, score } = this.state
    return (
      <>
        <div id='help'>
          <p>Controls: Right, Left, Up & Down arrow keys.</p>
        </div>
        <Progress score={score} />
        <div id='score_div'>
        Score: <span id='score'>{displayScore}</span>
        </div>
        <div id='lap_div'>
          Lap: <span>{lap}</span>
        </div>
        <Road setRef={el => { this.container = el }} lines={this.lines}>
          <Hero setRef={el => { this.hero = el }} isGameOver={isGameOver} container={this.container} changeMultiScore={this.changeMultiScore} />
          {[{ top: -100, left: '30%' },
            { top: -200, left: '50%' },
            { top: -350, left: '70%' }
          ].map(({ top, left }, idx) => (
            <img src={enemyCar} key={idx} className='car' ref={el => { this.enemies[idx] = el }} style={{ top, left }} alt='enemy' />
          ))}
          {[{ top: -80, left: '20%' }, { top: -180, left: '40%' }, { top: -300, left: '80%' }].map(({ top, left }, idx) => (
            <img key={idx} src={pothole} alt="pot" ref={el => { this.pots[idx] = el }} className="pot" style={{ top, left }} />
          ))}
        </Road>
        <div id='restart_div'>
          <button id='restart'>
          Restart<br />
            <small className='small_text'>(press Enter)</small>
          </button>
        </div>
      </>
    )
  }
}

export default App
