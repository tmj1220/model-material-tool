import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
} from 'react';
import Icon from '@ant-design/icons';
import closeSvg from '@/assets/images/anticons/close.svg';
import downloadSvg from '@/assets/images/anticons/download.svg';
import viewSvg from '@/assets/images/anticons/view.svg';
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

interface IndexProps { }
type ShowType = 'model' | 'img' | 'thumbImage';
const CardDetail: ForwardRefRenderFunction<
  {
    onShowDrawer: (data) => void;
  },
  IndexProps
> = (props, ref) => {
  const { CancelToken } = axios;
  const {
    getResourceList, updateCurSearchTag, updateCurCategory,
    updateSearchKeyword, updateMaterialCategory,
  } = useModelDispatchers('list');
  const { requestParams, defaultRequestParams } = useModelState('list');
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [cardDetail, setCardDetail] = useState<BaseSource>(null);
  const [modelFile, setModelFile] = useState<File>(null);
  const [modelData, setModelData] = useState<InfoForDownload>(null);
  const [showType, setShowType] = useState<ShowType>(null);
  const [percent, setpercent] = useState<number>(0);
  const requestsRef = useRef(null);
  const modelDownRef = useRef<ForwardRefOrops>(null);
  /** @description 获取模型数据 */
  const getModalData = (showModelData) => {
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
  }
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
      setModelData(showModelData);
      /** @description 模型超过5mb，显示预览图，点击预览查看模型 */
      if (showModelData.resourceFileSize > 5 * 1024) {
        setShowType('thumbImage');
      } else {
        getModalData(showModelData)
      }
    } else {
      setModelData(null);
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
    updateSearchKeyword('')
    updateMaterialCategory([])
    updateCurSearchTag([
      {
        tagId: id,
        tagName,
      },
    ]);
    navigate('/list');
    getResourceList({
      ...defaultRequestParams,
      direction: requestParams.direction,
      pageSize: requestParams.pageSize,
      tagId: id,
    });
  };
  /** @description 显示支持的格式 */
  const formatShow = (info) => {
    const format: string[] = []
    Object.keys(info).forEach((item) => {
      const { modelType } = info[item];
      format.push(modelType.replace('.', ''))
    })
    return format.join('/')
  }

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
        <Icon component={closeSvg} style={{ fontSize: 36, color: '#fff' }} />
      </div>
      {loading ? (
        <Skeleton active />
      ) : (
        <div className={s['drawer-content']}>
          <div className={s['img-box']}>
            {(showType === 'img' || showType === 'thumbImage') && (
              <div className={s['image-box']}>
                <img
                  alt={cardDetail?.resourceName}
                  src={cardDetail?.resourceThumbUrl}
                />
                {
                  showType === 'thumbImage'
                  && <div className={s.wrap} />
                }
                {
                  showType === 'thumbImage'
                  && (
                    <Button
                      className={s['view-btn']}
                      onClick={() => getModalData(modelData)}
                      type="primary"
                      size="middle"
                    >
                      <Icon component={viewSvg} />
                      点击预览模型
                    </Button>
                  )
                }
              </div>
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
            <div className={s['support-format']}>
              <span className={s['format-title']}>文件格式&nbsp;</span>
              {cardDetail?.infoForDownload && formatShow(cardDetail?.infoForDownload)}
            </div>
            {
              cardDetail?.resourceSn && (
              <div className={s['resource-sn']}>
                <span className={s.title}>POI编号&nbsp;&nbsp;</span>
                {cardDetail?.resourceSn}
              </div>
              )
            }
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
