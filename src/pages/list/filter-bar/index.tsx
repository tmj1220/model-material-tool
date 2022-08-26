import React from 'react'
import { Select, Tabs } from 'antd'
import { useModelDispatchers, useModelState } from '@/store'
import { menuOptions } from '@/components/header/constant'
import { fitlerOptions } from '../constants'
import s from './index.less'

interface FilterBarProps { }

const FilterBar: React.FC<FilterBarProps> = () => {
  const {
    materialCategory, requestParams, searchKeyword, curCategory,
  } = useModelState('list')
  const { getResourceList, getResourceByKeyword } = useModelDispatchers('list')

  const onTabChange = (key) => {
    getResourceList({
      ...requestParams,
      pageNum: 1,
      resourceType: curCategory,
      materialCategoryId: key || null,
    })
  }

  const onMenuTabChange = (key) => {
    getResourceByKeyword({
      ...requestParams,
      pageNum: 1,
      resourceType: key,
    })
  }

  return (
    <div className={s['filter-bar-root']}>
      <div className={s['left-box']}>
        {
          searchKeyword
          && (
            <Tabs onChange={onMenuTabChange}>
              {menuOptions.map(({ key, title }) => (
                <Tabs.TabPane
                  key={key}
                  tab={(
                    <span>
                      {title}
                      {' '}
                      999
                    </span>
                  )}
                />
              ))}
            </Tabs>
          )
        }
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
