import React from 'react';
import s from './index.less'

interface AboutProps {

}

const About: React.FC<AboutProps> = () => (
  <div className={s['about-content']}>
    <div className={s['banner-box']} />
  </div>
)
export default About
