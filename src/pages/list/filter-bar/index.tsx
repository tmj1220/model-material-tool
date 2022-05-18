import React, { useEffect } from 'react'
import { Select, Tabs } from 'antd'

import { fitlerOptions } from '../constants'
import s from './index.less'

import { tags } from '../mock'

interface FilterBarProps {}

const FilterBar: React.FC<FilterBarProps> = () => {
  useEffect(() => {}, [])
  return (
    <div className={s['filter-bar-root']}>
      <div className={s['left-box']}>
        <Tabs animated={false}>
          {tags.map(({ label, value }) => <Tabs.TabPane key={value} tab={label} />)}
        </Tabs>
      </div>
      <div className={s['right-box']}>
        排序
        <Select options={fitlerOptions} defaultValue="lastest" bordered={false} />
      </div>
    </div>
  )
};

export default FilterBar
