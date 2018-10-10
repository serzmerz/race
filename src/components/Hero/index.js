import React, { PureComponent } from 'react'
import I from 'seamless-immutable'
import cx from 'classnames'
import './styles.css'
import hero from '../../images/cars/hero.png'
import retro from '../../images/cars/retro.png'
import red from '../../images/cars/red.png'
import range from '../../images/cars/range.png'
import mercedes from '../../images/cars/mercedes.png'

export default class Hero extends PureComponent {
  state = {
    position: I.from({
      left: 10,
      top: 300
    })
  }

  move = {
    left: null,
    right: null,
    up: null,
    down: null
  }

  componentDidMount () {
    document.addEventListener('keydown', this.handleKeyDown)
    document.addEventListener('keyup', this.handleKeyUp)
  }

  componentWillUnmount () {
    document.removeEventListener('keydown')
    document.removeEventListener('keyup')
  }

  handleKeyDown = ({ keyCode }) => {
    const { isGameOver, hasCrash } = this.props
    if (!isGameOver && !hasCrash) {
      if (keyCode === 37 && !this.move.left) return this.move.left = requestAnimationFrame(this.left)
      if (keyCode === 39 && !this.move.right) return this.move.right = requestAnimationFrame(this.right)
      if (keyCode === 38 && !this.move.up) return this.move.up = requestAnimationFrame(this.up)
      if (keyCode === 40 && !this.move.down) return this.move.down = requestAnimationFrame(this.down)
    }
  }

  handleKeyUp = ({ keyCode }) => {
    const { isGameOver, changeMultiScore } = this.props
    if (!isGameOver) {
      switch (keyCode) {
        case 37:
          cancelAnimationFrame(this.move.left)
          this.move.left = null
          break
        case 39:
          cancelAnimationFrame(this.move.right)
          this.move.right = null
          break
        case 38:
          cancelAnimationFrame(this.move.up)
          this.move.up = null
          changeMultiScore(false)
          break
        case 40:
          cancelAnimationFrame(this.move.down)
          this.move.down = null
          break
        default:
          return null
      }
    }
  }

  left = () => {
    const { position } = this.state
    const { isGameOver, hasCrash } = this.props
    if (!isGameOver && !hasCrash && position.left > 0) {
      this.setState({ position: position.set('left', position.left - 5) })
      this.move.left = requestAnimationFrame(this.left)
    }
  }

  right = () => {
    const { position } = this.state
    const { isGameOver, hasCrash, container } = this.props
    if (!isGameOver && !hasCrash && position.left < container.offsetWidth - 40) {
      this.setState({ position: position.set('left', position.left + 5) })
      this.move.right = requestAnimationFrame(this.right)
    }
  }

  up = () => {
    const { position } = this.state
    const { isGameOver, hasCrash, hasPot, changeMultiScore } = this.props
    if (!isGameOver && !hasCrash && !hasPot && position.top > 0) {
      this.setState({ position: position.set('top', position.top - 3) })
      this.move.up = requestAnimationFrame(this.up)
      changeMultiScore(true)
    }
  }

  down = () => {
    const { position } = this.state
    const { isGameOver, hasCrash, container } = this.props
    if (!isGameOver && !hasCrash && position.top < container.offsetHeight - 70) {
      this.setState({ position: position.set('top', position.top + 3) })
      this.move.down = requestAnimationFrame(this.down)
    }
  }

  getImage = () => {
    const { lap } = this.props
    switch (lap) {
      case 1: return hero
      case 2: return range
      case 3: return mercedes
      case 4: return red
      case 5: return retro
      default: return hero
    }
  }

  render () {
    const { setRef, hasCrash } = this.props
    return (
      <img
        src={this.getImage()}
        ref={setRef}
        style={this.state.position}
        className={cx('car', { crashed: hasCrash })}
        alt='hero'
      />
    )
  }
}
