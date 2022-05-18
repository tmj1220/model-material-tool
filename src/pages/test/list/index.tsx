import React, { useEffect } from 'react'

interface TestListProps {}

const TestList: React.FC<TestListProps> = () => {
  useEffect(() => {}, [])
  return (
    <div>
      我是TestList
    </div>
  )
};

export default TestList
