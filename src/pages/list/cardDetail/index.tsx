/*
 * @Author: like 465420404@qq.com
 * @Date: 2022-08-27 18:32:25
 * @LastEditors: like 465420404@qq.com
 * @LastEditTime: 2022-09-12 19:52:30
 * @FilePath: /model-material-tool/src/pages/list/cardDetail/index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by like 465420404@qq.com, All Rights Reserved.
 */
import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
} from 'react';
import Icon from '@ant-design/icons';
import closeSvg from '@/assets/images/anticons/close.svg';
import downloadSvg from '@/assets/images/anticons/download.svg';
import type { ForwardRefRenderFunction } from 'react';
import {
  Drawer, Skeleton, Avatar, Button, Progress,
} from 'antd';
import Tag from '@/components/tag/index';
import { useModelDispatchers, useModelState } from '@/store';
import { useNavigate } from 'react-router-dom';
import { getResourceDetail } from '@/services/list';
import moment from 'moment';
import ModelViewer from '@/components/ModelViewer';
import axios from 'axios';
import ModelDown, { ForwardRefOrops } from '@/components/ModelDown';
import s from './index.less';

interface IndexProps {}
type ShowType = 'model' | 'img';
const CardDetail: ForwardRefRenderFunction<
  {
    onShowDrawer: (data) => void;
  },
  IndexProps
> = (props, ref) => {
  const { CancelToken } = axios;
  const { getResourceList, updateCurSearchTag, updateCurCategory } = useModelDispatchers('list');
  const { requestParams } = useModelState('list');
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [cardDetail, setCardDetail] = useState<BaseSource>(null);
  const [modelFile, setModelFile] = useState<File>(null);
  const [showType, setShowType] = useState<ShowType>(null);
  const [percent, setpercent] = useState<number>(0);
  const requestsRef = useRef(null);
  const modelDownRef = useRef<ForwardRefOrops>(null);
  const onShowDrawer = async (resourceId) => {
    let showModelData: InfoForDownload = null;
    setVisible(true);
    setLoading(true);
    const res: BaseSource = await getResourceDetail(resourceId);
    setCardDetail(res);
    setLoading(false);
    const { infoForDownload } = res;
    Object.keys(infoForDownload).forEach((key) => {
      const { modelType } = infoForDownload[key];
      if (
        ['.gltf', '.glb'].includes(
          modelType.substring(modelType.lastIndexOf('.')),
        )
      ) {
        showModelData = infoForDownload[key];
        showModelData.key = key;
      }
    });
    if (showModelData) {
      setShowType('model');
      axios(showModelData.resourceFileUrl, {
        responseType: 'blob',
        onDownloadProgress(progressEvent) {
          setpercent(
            Number(
              ((progressEvent.loaded / progressEvent.total) * 100).toFixed(0),
            ),
          );
        },
        cancelToken: new CancelToken((c) => {
          requestsRef.current = { abort: c };
        }),
      }).then(({ data }) => {
        if (data instanceof Blob) {
          const file = new File([data], `${showModelData.key}.${showModelData.suffix}`);
          setModelFile(file);
        }
      });
    } else {
      setShowType('img');
    }
  };

  const onClose = () => {
    try {
      requestsRef.current?.abort();
      requestsRef.current = null;
    } catch (error) {
      console.log(error);
    }
    setVisible(false);
  };

  // 点击标签跳转至检索页面
  const onSearchTag = (id, tagName) => {
    setVisible(false);
    updateCurCategory(null);
    updateCurSearchTag([
      {
        tagId: id,
        tagName,
      },
    ]);
    navigate('/list');
    getResourceList({
      pageNum: 1,
      pageSize: requestParams.pageSize,
      tagId: id,
    });
  };

  // 抛出去的方法
  useImperativeHandle(ref, () => ({
    onShowDrawer,
  }));
  return (
    <Drawer
      contentWrapperStyle={{ borderRadius: '14px', overflow: 'hidden' }}
      maskStyle={{ background: 'rgba(0,0,0,0.8)' }}
      placement="bottom"
      height="calc(100% - 64px)"
      destroyOnClose
      maskClosable={false}
      closable={false}
      onClose={onClose}
      visible={visible}
    >
      <div className={s['close-icon']} onClick={onClose}>
        <Icon component={closeSvg} style={{ fontSize: 36 }} />
      </div>
      {loading ? (
        <Skeleton active />
      ) : (
        <div className={s['drawer-content']}>
          <div className={s['img-box']}>
            {showType === 'img' && (
              <img
                alt={cardDetail?.resourceName}
                src={cardDetail?.resourceThumbUrl}
              />
            )}
            {showType === 'model'
              && (modelFile ? (
                <ModelViewer curType="readonly" modelFile={modelFile} />
              ) : (
                <div>
                  <Progress
                    steps={20}
                    percent={percent}
                    format={(data) => `模型已加载${data}%、请等待`}
                  />
                </div>
              ))}
          </div>
          <div className={s['detail-box']}>
            <div className={s['user-info']}>
              <Avatar size={20}>
                {cardDetail?.modifiedUserName?.replace(
                  /^(.*[n])*.*(.|n)$/g,
                  '$2',
                )}
              </Avatar>
              <span className={s['user-name']}>
                {cardDetail?.modifiedUserName}
              </span>
            </div>
            <div className={s['resource-name']}>{cardDetail?.resourceName}</div>
            <div className={s['update-time']}>
              <span>更新于&nbsp;</span>
              {moment(cardDetail?.gmtModified).format('YY/MM/DD HH:mm:ss')}
            </div>
            <div className={s['tag-box']}>
              {cardDetail?.tagInfo
                && Object.keys(cardDetail?.tagInfo).map((item) => (
                  <span
                    key={item}
                    onClick={() => onSearchTag(item, cardDetail?.tagInfo[item])}
                  >
                    <Tag tagName={cardDetail?.tagInfo[item]} />
                  </span>
                ))}
            </div>
            <div className={s['resource-description']}>
              {cardDetail?.resourceDescription}
            </div>
            <Button
              className={s['download-btn']}
              type="primary"
              icon={<Icon component={downloadSvg} style={{ color: '#fff' }} />}
              onClick={() => modelDownRef.current.onShowDrawer(cardDetail)}
            >
              下载
            </Button>
          </div>
        </div>
      )}
      <ModelDown ref={modelDownRef} />
    </Drawer>
  );
};

export default forwardRef(CardDetail);
