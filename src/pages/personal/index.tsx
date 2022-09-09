/* eslint-disable no-unsafe-optional-chaining */
import React, {
  useEffect, useRef,
} from 'react'
import {
  List, Skeleton, Divider, Avatar, message,
} from 'antd';
import Icon from '@ant-design/icons';
import EditSvg from '@/assets/images/anticons/edit.svg'
import DeleteSvg from '@/assets/images/anticons/delete.svg'
import InfiniteScroll from 'react-infinite-scroll-component';
import { useModelDispatchers, useModelState, useModelEffectsLoading } from '@/store'
import { deleteResource } from '@/services/list'
import Card from '../list/card'
import s from './index.less'

interface ListProps { }

const SourceList: React.FC<ListProps> = () => {
  const { getResourceList } = useModelDispatchers('list')
  const {
    requestParams, resources, isGetMoreResources,
  } = useModelState('list')
  const { name } = useModelState('user');
  const { getResourceList: isLoading } = useModelEffectsLoading('list');
  const containerRef = useRef<HTMLDivElement>()
  const listRef = useRef<any>()

  const loadMoreData = () => {
    getResourceList({
      ...requestParams,
      pageNum: requestParams.pageNum + 1,
    })
  }

  // 获取自己上传的资源
  const getResource = () => {
    getResourceList({
      pageNum: 1,
      pageSize: requestParams.pageSize,
      mine: 1,
    })
  }

  // 删除资源
  const deleteSource = async (id) => {
    const res = await deleteResource(id)
    if (res) {
      getResource()
      message.success('删除成功')
    }
  }

  useEffect(() => {
    getResource()
  }, []);

  return (
    <div className={s['list-root']}>
      <div className={s['user-info']}>
        <Avatar size={90}>{name?.replace(/^(.*[n])*.*(.|n)$/g, '$2')}</Avatar>
        <div className={s['user-name']}>{name}</div>
      </div>
      <div
        className={s['list-box']}
        id="scrollableBox"
        ref={containerRef}
      >
        <InfiniteScroll
          ref={listRef}
          dataLength={resources.length}
          next={() => {
            if (resources.length > 0) {
              loadMoreData()
            }
          }}
          hasMore={isGetMoreResources}
          hasChildren
          scrollThreshold={0.1}
          loader={(isLoading)
            ? <Skeleton avatar paragraph={{ rows: 1 }} active /> : null}
          endMessage={<Divider plain>所有的都在这儿了🤐</Divider>}
          scrollableTarget="scrollableBox"
        >
          <List
            dataSource={resources}
            grid={{
              gutter: 16, column: 4, xl: 4, xxl: 6,
            }}
            renderItem={(item) => (
              <List.Item key={item.resourceId}>
                <Card {...item}>
                  <div>
                    <Icon component={EditSvg} />
                    <Icon
                      component={DeleteSvg}
                      style={{ marginLeft: 16 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteSource(item.resourceId)
                      }}
                    />
                  </div>
                </Card>
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
    </div>
  )
};

export default SourceList
