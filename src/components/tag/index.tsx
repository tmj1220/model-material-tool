/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'
import { Tag } from 'antd'
import './index.less'

interface IProps {
  tagName: string
}
const Index = ({ tagName }: IProps) => (
  <Tag>{tagName}</Tag>);

export default Index
