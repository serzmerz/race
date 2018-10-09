import React, { PureComponent } from 'react'
import './styles.css'

export default class Road extends PureComponent {
  render () {
    const { children, setRef, lines } = this.props;
    return (
      <div className='road' ref={setRef}>
        {[-150, 150, 450].map((item, idx) => (
          <div key={idx} ref={el => { lines[idx] = el }} className='line' style={{ top: item }} />
        ))}
        {children}
      </div>
    )
  }
}
