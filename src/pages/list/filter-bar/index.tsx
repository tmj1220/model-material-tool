import React from 'react'
import { Select, Tabs } from 'antd'
import { useModelDispatchers, useModelState } from '@/store'
import { fitlerOptions } from '../constants'
import s from './index.less'

interface FilterBarProps { }

const FilterBar: React.FC<FilterBarProps> = () => {
  const { materialCategory, requestParams } = useModelState('list')
  const { getResourceList } = useModelDispatchers('list')

  const onTabChange = (key) => {
    getResourceList({
      ...requestParams,
      materialCategoryId: key,
    })
  }

  return (
    <div className={s['filter-bar-root']}>
      <div className={s['left-box']}>
        <Tabs animated={false} onChange={onTabChange}>
          {
            materialCategory.map(({
              categoryId, categoryName,
            }) => <Tabs.TabPane key={categoryId} tab={categoryName} />)
          }
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
