import React, { useEffect } from 'react'

interface LoadingProps {}

const Loading: React.FC<LoadingProps> = () => {
  useEffect(() => {}, [])
  return <div>loading...</div>
};

export default Loading
