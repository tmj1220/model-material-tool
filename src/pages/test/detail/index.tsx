import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

interface TestDetailProps {}

const TestDetail: React.FC<TestDetailProps> = () => {
  useEffect(() => {}, [])
  const { testId } = useParams()
  return (
    <div>
      <h1>我是testDetail</h1>
      testId:
      {testId}
    </div>
  )
};

export default TestDetail
