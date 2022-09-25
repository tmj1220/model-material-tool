import React, { useEffect, useState } from 'react'
import { Select, Tabs } from 'antd'
import { useModelDispatchers, useModelState } from '@/store'
import { menuOptions } from '@/components/header/constant'
import { getResourceByKeyword as getResourceByKeywordAmount } from '@/services/list'
import Tag from '@/components/tag/index';
import { filterOptions } from '../constants'
import s from './index.less'

interface FilterBarProps { }

const FilterBar: React.FC<FilterBarProps> = () => {
  const [menus, setMenus] = useState([])
  const {
    materialCategory, requestParams, searchKeyword, curCategory, curSearchTag,
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
      resourceType: key === 'null' ? '' : key,
    })
  }
  // 排序切换
  const onFilterSelect = (value) => {
    if (searchKeyword) {
      getResourceByKeyword({
        ...requestParams,
        pageNum: 1,
        direction: value,
      })
    } else {
      getResourceList({
        ...requestParams,
        pageNum: 1,
        direction: value,
      })
    }
  }

  useEffect(() => {
    if (searchKeyword) {
      (async () => {
        const modal = await getResourceByKeywordAmount({
          keyword: searchKeyword,
          pageNum: 1,
          pageSize: 0,
          resourceType: 1,
        })
        const texture = await getResourceByKeywordAmount({
          keyword: searchKeyword,
          pageNum: 1,
          pageSize: 0,
          resourceType: 2,
        })
        const newMenus = [...menuOptions.filter((item) => item.key !== 3)]
        newMenus.forEach((item: any) => {
          if (item.key === 1) {
            item.total = modal.total
          }
          if (item.key === 2) {
            item.total = texture.total
          }
        })
        newMenus.unshift({
          title: '全部',
          key: null,
        })
        setMenus(newMenus)
      })()
    } else {
      setMenus([])
    }
  }, [searchKeyword])

  return (
    <div className={s['filter-bar-root']}>
      <div className={s['left-box']}>
        {
          searchKeyword
          && (
            <Tabs onChange={onMenuTabChange}>
              {menus.map(({ key, title, total }) => (
                <Tabs.TabPane
                  key={key}
                  tab={(
                    <span>
                      {title}
                      {
                        total > 0 && (
                          <span style={{
                            borderRadius: 18,
                            background: '#DDDDDD',
                            padding: '2px 8px',
                            marginLeft: 4,
                            color: '#333',
                          }}
                          >
                            {total}
                          </span>
                        )
                      }
                    </span>
                  )}
                />
              ))}
            </Tabs>
          )
        }
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
        排序
        <Select options={filterOptions} defaultValue="desc" bordered={false} onSelect={onFilterSelect} />
      </div>
    </div>
  )
};

export default FilterBar
