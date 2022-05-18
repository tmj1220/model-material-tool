/* eslint-disable no-unsafe-optional-chaining */
import React, {
  useEffect, useState, useRef, useLayoutEffect,
} from 'react'
import {
  List, Skeleton, Divider,
} from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import FilterBar from './filter-bar'
import Card from './card'
import s from './index.less'

import { baselist } from './mock'

interface ListProps {}

const SourceList: React.FC<ListProps> = () => {
  const [loading, setLoading] = useState(false)
  const [list, setlist] = useState(baselist)
  const containerRef = useRef<HTMLDivElement>()
  const listRef = useRef<any>()

  const loadMoreData = () => {
    // console.log('loadMoreData', loadMoreData, loading);

    if (loading) {
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setlist((pre) => [
        ...pre,
        ...pre
          .slice(-5)
          .map((i) => ({
            ...i,
            id: String(Number(i.id) + 4),
          }))])
      setLoading(false);
    }, 300);
  };
  useLayoutEffect(() => {
    if (containerRef.current && containerRef.current.children[0]) {
      try {
        const { height } = containerRef.current.getBoundingClientRect()
        // eslint-disable-next-line no-underscore-dangle
        const { height: listHeight } = containerRef.current.children[0].getBoundingClientRect()
        if (listHeight < height) {
          loadMoreData();
        }
      } catch (error) {
        console.log('useLayoutEffect -error', error);
      }
    }

    return () => {

    };
  }, [list])
  // console.log('loading', loading, list);

  useEffect(() => {
    loadMoreData();
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
          dataLength={list.length}
          next={loadMoreData}
          hasMore={list.length <= 100}
          hasChildren
          scrollThreshold={0.1}
          loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
          endMessage={<Divider plain>所有的都在这儿了🤐</Divider>}
          scrollableTarget="scrollableDiv"
        >
          <List
            dataSource={list}
            grid={{ gutter: 16, column: 4 }}
            renderItem={(item) => (
              <List.Item key={item.id}>
                <Card {...item} />
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
    </div>
  )
};

export default SourceList
