import React, { PureComponent } from 'react'
import './styles.css'
import hero from '../../images/cars/hero.png'
import start from '../../images/start.png'
import finish from '../../images/finish.png'

/**
 * Component display road map on left side
 */
export default class Progress extends PureComponent {
  render () {
    const { score } = this.props
    return (
      <div className='progress-root'>
        <img src={hero} className='progress-hero' alt='hero' style={{ top: `${100 - score / 50}%` }} />
        <img src={start} alt='start' className='progress-edge start' />
        {Array(6).fill(0).map((_, idx) => <div key={idx} className='progress-point' />)}
        <img src={finish} alt='finish' className='progress-edge finish' />
      </div>
    )
  }
}
