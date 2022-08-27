import { Spin } from 'antd';
import React, { useEffect } from 'react'

interface LoadingProps {}

const Loading: React.FC<LoadingProps> = () => {
  useEffect(() => {}, [])
  return (
    <Spin spinning />
  )
};

export default Loading
