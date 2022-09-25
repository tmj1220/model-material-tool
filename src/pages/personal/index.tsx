/* eslint-disable no-unsafe-optional-chaining */
import React, { useEffect, useRef } from 'react';
import {
  List, Skeleton, Divider, Avatar, message, Modal,
} from 'antd';
import Icon, { ExclamationCircleOutlined } from '@ant-design/icons';
import EditSvg from '@/assets/images/anticons/edit.svg';
import DeleteSvg from '@/assets/images/anticons/delete.svg';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  useModelDispatchers,
  useModelState,
  useModelEffectsLoading,
} from '@/store';
import { deleteResource } from '@/services/list';
import AddModel, {
  AddModelForwardRefOrops,
} from '@/components/header/addmodel';
import Card from '../list/card';
import s from './index.less';

interface ListProps {}

const SourceList: React.FC<ListProps> = () => {
  const { getResourceList } = useModelDispatchers('list');
  const {
    requestParams, defaultRequestParams, resources, isGetMoreResources,
  } = useModelState('list');
  const { name } = useModelState('user');
  const { getResourceList: isLoading } = useModelEffectsLoading('list');
  const containerRef = useRef<HTMLDivElement>();
  const listRef = useRef<any>();
  const addModelRef = useRef<AddModelForwardRefOrops>(null);
  const loadMoreData = () => {
    getResourceList({
      ...requestParams,
      pageNum: requestParams.pageNum + 1,
    });
  };

  // 获取自己上传的资源
  const getResource = () => {
    getResourceList({
      ...defaultRequestParams,
      pageSize: requestParams.pageSize,
      mine: 1,
    });
  };

  // 删除资源
  const deleteSource = async (id) => {
    Modal.confirm({
      title: '删除',
      icon: <ExclamationCircleOutlined />,
      content: '确认删除该资源？',
      async onOk() {
        const res = await deleteResource(id);
        if (res) {
          getResource();
          message.success('删除成功');
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  useEffect(() => {
    getResource();
  }, []);

  return (
    <div className={s['list-root']}>
      <div className={s['user-info']}>
        <Avatar size={90}>{name?.replace(/^(.*[n])*.*(.|n)$/g, '$2')}</Avatar>
        <div className={s['user-name']}>{name}</div>
      </div>
      <div className={s['list-box']} id="scrollableBox" ref={containerRef}>
        <InfiniteScroll
          ref={listRef}
          dataLength={resources.length}
          next={() => {
            if (resources.length > 0) {
              loadMoreData();
            }
          }}
          hasMore={isGetMoreResources}
          hasChildren
          scrollThreshold={0.1}
          loader={
            isLoading ? (
              <Skeleton avatar paragraph={{ rows: 1 }} active />
            ) : null
          }
          endMessage={<Divider plain>所有的都在这儿了🤐</Divider>}
          scrollableTarget="scrollableBox"
        >
          <List
            dataSource={resources}
            grid={{
              gutter: 16,
              column: 4,
              xl: 4,
              xxl: 6,
            }}
            renderItem={(item) => (
              <List.Item key={item.resourceId}>
                <Card {...item}>
                  <div>
                    <Icon
                      onClick={(e) => {
                        e.stopPropagation();
                        addModelRef.current.onShowDrawer(item.resourceId);
                      }}
                      component={EditSvg}
                    />
                    <Icon
                      component={DeleteSvg}
                      style={{ marginLeft: 16 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSource(item.resourceId);
                      }}
                    />
                  </div>
                </Card>
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
      <AddModel onAdd={() => { getResource() }} ref={addModelRef} />
    </div>
  );
};

export default SourceList;
