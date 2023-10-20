/* eslint-disable no-unsafe-optional-chaining */
import React, {
  useEffect, useRef,
} from 'react'
import {
  List, Skeleton, Divider, Spin,
} from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useModelDispatchers, useModelState, useModelEffectsLoading } from '@/store'
import Icon from '@ant-design/icons';
import downloadSvg from '@/assets/images/anticons/download.svg'
import ModelDown, { ForwardRefOrops } from '@/components/ModelDown';
import FilterBar from './filter-bar'
import Card from './card'
import s from './index.less'

interface ListProps { }

const SourceList: React.FC<ListProps> = () => {
  const modelDownRef = useRef<ForwardRefOrops>(null);
  const { getResourceList, getMaterialCategory } = useModelDispatchers('list')
  const {
    requestParams, curCategory, resources, isGetMoreResources,
  } = useModelState('list')
  const { getResourceByKeyword: isKeywordLoading } = useModelEffectsLoading('list');
  const { getResourceList: isLoading } = useModelEffectsLoading('list');
  const containerRef = useRef<HTMLDivElement>()
  const listRef = useRef<any>()

  const loadMoreData = () => {
    getResourceList({
      ...requestParams,
      pageNum: requestParams.pageNum + 1,
    })
  }

  useEffect(() => {
    getMaterialCategory();
    getResourceList({
      ...requestParams,
      pageNum: 1,
      resourceType: curCategory,
    })
  }, []);

  return (
    <div className={s['list-root']}>
      <FilterBar />
      <div
        className={s['list-box']}
        id="scrollableDiv"
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
          loader={(isLoading || isKeywordLoading)
            ? <Skeleton paragraph={{ rows: 5 }} active /> : null}
          endMessage={<Divider plain>所有的都在这儿了🤐</Divider>}
          scrollableTarget="scrollableDiv"
        >
          <Spin spinning={isLoading || isKeywordLoading}>
            <List
              dataSource={resources}
              grid={{
                gutter: 16, column: 4, xl: 4, xxl: 6,
              }}
              renderItem={(item) => (
                <List.Item key={item.resourceId}>
                  <Card {...item}>
                    <div
                      className={s['action-box']}
                      onClick={(e) => {
                        e.stopPropagation();
                        modelDownRef.current.onShowDrawer(item.resourceId);
                      }}
                    >
                      <Icon component={downloadSvg} />
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          </Spin>
        </InfiniteScroll>
      </div>
      <ModelDown ref={modelDownRef} />
    </div>
  )
};

export default SourceList
