/*
 * @Author: like 465420404@qq.com
 * @Date: 2022-09-09 19:24:28
 * @LastEditors: like 465420404@qq.com
 * @LastEditTime: 2022-09-25 14:42:01
 * @FilePath: /model-material-tool/src/pages/list/index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by like 465420404@qq.com, All Rights Reserved.
 */
/* eslint-disable no-unsafe-optional-chaining */
import React, {
  useEffect, useRef,
} from 'react'
import {
  List, Skeleton, Divider,
} from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useModelDispatchers, useModelState, useModelEffectsLoading } from '@/store'
import downloadSvg from '@/assets/images/icons/download.svg'
import ModelDown, { ForwardRefOrops } from '@/components/ModelDown';
import FilterBar from './filter-bar'
import Card from './card'
import s from './index.less'

interface ListProps { }

const SourceList: React.FC<ListProps> = () => {
  const modelDownRef = useRef<ForwardRefOrops>(null);
  const { getResourceList } = useModelDispatchers('list')
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
    getResourceList({
      ...requestParams,
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
          <List
            dataSource={resources}
            grid={{
              gutter: 16, column: 4, xl: 4, xxl: 6,
            }}
            renderItem={(item) => (
              <List.Item key={item.resourceId}>
                <Card {...item}>
                  <div className={s['action-box']}>
                    <img
                      onClick={(e) => {
                        e.stopPropagation();
                        modelDownRef.current.onShowDrawer(item.resourceId);
                      }}
                      src={downloadSvg}
                      alt="dowanload.png"
                    />
                  </div>
                </Card>
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
      <ModelDown ref={modelDownRef} />
    </div>
  )
};

export default SourceList
