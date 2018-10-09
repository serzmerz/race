import React, { PureComponent } from 'react'
import I from 'seamless-immutable'
import hero from '../../images/hero.png'

export default class Hero extends PureComponent {
  state = {
    position: I.from({
      left: 10,
      top: 300,
    }),
  }

  move =  {
    left: null,
    right: null,
    up: null,
    down: null,
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown)
    document.addEventListener('keyup', this.handleKeyUp)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown');
    document.removeEventListener('keyup');
  }

  handleKeyDown = ({ keyCode }) => {
    const { isGameOver } = this.props;
    if(!isGameOver) {
      if (keyCode === 37 && !this.move.left) return this.move.left = requestAnimationFrame(this.left)
      if (keyCode === 39 && !this.move.right) return this.move.right = requestAnimationFrame(this.right)
      if (keyCode === 38 && !this.move.up) return this.move.up = requestAnimationFrame(this.up)
      if (keyCode === 40 && !this.move.down) return this.move.down = requestAnimationFrame(this.down)
    }
  }

  handleKeyUp = ({ keyCode }) => {
    const { isGameOver, changeMultiScore } = this.props;
    if(!isGameOver) {
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
    const { position } = this.state;
    const { isGameOver } = this.props
    if (!isGameOver && position.left > 0) {
      this.setState({ position: position.set('left', position.left - 5) })
      this.move.left = requestAnimationFrame(this.left)
    }
  }

  right = () => {
    const { position } = this.state;
    const { isGameOver, container } = this.props
    if (!isGameOver && position.left < container.offsetWidth - 40) {
      this.setState({ position: position.set('left', position.left + 5) })
      this.move.right = requestAnimationFrame(this.right)
    }
  }

  up = () => {
    const { position } = this.state;
    const { isGameOver, changeMultiScore } = this.props
    if (!isGameOver && position.top > 0) {
      this.setState({ position: position.set('top', position.top - 3) })
      this.move.up = requestAnimationFrame(this.up)
      changeMultiScore(true)
    }
  }

  down = () => {
    const { position } = this.state;
    const { isGameOver, container } = this.props
    if (!isGameOver && position.top < container.offsetHeight - 70) {
      this.setState({ position: position.set('top', position.top + 3) })
      this.move.down = requestAnimationFrame(this.down)
    }
  }

  render () {
    const { setRef } = this.props;
    return (
      <img src={hero} ref={setRef} style={this.state.position} className='car' alt="hero" />
    )
  }
}
