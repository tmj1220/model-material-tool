import React, { useState } from 'react'
import { Select, Tabs } from 'antd'
import { useModelDispatchers, useModelState } from '@/store'
import { filterOptions } from '@/utils/constant'
import Tag from '@/components/tag/index';
import FilterBox from './FilterBox'
import s from './index.less'

interface FilterBarProps { }

const FilterBar: React.FC<FilterBarProps> = () => {
  /** 当前选中的子类型 */
  const [currCategoryName, setCurrCategoryName] = useState('全部')
  const {
    materialCategory, requestParams, searchKeyword, curCategory, curSearchTag,
  } = useModelState('list')
  const { getResourceList, getResourceByKeyword, updateIsGetMoreResources } = useModelDispatchers('list')

  const onTabChange = (key) => {
    const category = materialCategory.find((v) => v.categoryId === key)
    setCurrCategoryName(category.categoryName)
    // 更新可继续获取资源状态
    updateIsGetMoreResources(true);
    getResourceList({
      ...requestParams,
      pageNum: 1,
      resourceType: curCategory,
      materialCategoryId: key || null,
      /** 切换tab清空筛选条件 */
      format: null,
      resourcePoiType: null,
    })
  }
  // 排序切换
  const onFilterSelect = (value) => {
    const val = value.split('-')
    const order = val[0]
    const direction = val[1]
    if (searchKeyword) {
      getResourceByKeyword({
        ...requestParams,
        pageNum: 1,
        order,
        direction,
      })
    } else {
      getResourceList({
        ...requestParams,
        pageNum: 1,
        order,
        direction,
      })
    }
  }
  /** 筛选改变 */
  const onFilterChange = (payload) => {
    if (searchKeyword) {
      getResourceByKeyword({
        ...requestParams,
        ...payload,
        pageNum: 1,
      })
    } else {
      getResourceList({
        ...requestParams,
        ...payload,
        pageNum: 1,
      })
    }
  }

  return (
    <div className={s['filter-bar-root']}>
      <div className={s['left-box']}>
        {
          curSearchTag.length > 0
          && (
            <div className={s['tag-box']}>
              <span>标签</span>
              {
                curSearchTag.map((item) => (
                  <Tag key={item.tagId} tagName={item.tagName} />
                ))
              }
            </div>
          )
        }
        {
          materialCategory.length > 0 && (
            <Tabs animated={false} onChange={onTabChange}>
              {
                materialCategory.map(({
                  categoryId, categoryName,
                }) => <Tabs.TabPane key={categoryId} tab={categoryName} />)
              }
            </Tabs>
          )
        }
      </div>
      <div className={s['right-box']}>
        <FilterBox categoryName={currCategoryName} onSelectValue={onFilterChange} />
        <div>
          排序
          <Select
            options={filterOptions}
            defaultValue={filterOptions[0].value}
            bordered={false}
            onSelect={onFilterSelect}
          />
        </div>
      </div>
    </div>
  )
};

export default FilterBar
