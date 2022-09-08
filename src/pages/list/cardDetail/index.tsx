/*
 * @Author: like 465420404@qq.com
 * @Date: 2022-08-27 18:32:25
 * @LastEditors: like 465420404@qq.com
 * @LastEditTime: 2022-09-08 10:49:29
 * @FilePath: /model-material-tool/src/pages/list/cardDetail/index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by like 465420404@qq.com, All Rights Reserved.
 */
import React, {
  useState, useImperativeHandle, forwardRef,
} from 'react';
import Icon from '@ant-design/icons';
import closeSvg from '@/assets/images/anticons/close.svg'
import downloadSvg from '@/assets/images/anticons/download.svg'
import type { ForwardRefRenderFunction } from 'react'
import {
  Drawer, Skeleton, Avatar, Button,
} from 'antd'
import Tag from '@/components/tag/index'
import { getResourceDetail } from '@/services/list'
import moment from 'moment';
import s from './index.less'
import Model from './Model';

interface IndexProps {

}

const CardDetail: ForwardRefRenderFunction<{
  onShowDrawer: (data) => void,
}, IndexProps> = (props, ref) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(false)
  const [cardDetail, setCardDetail] = useState<BaseSource>(null)

  const onShowDrawer = async (resourceId) => {
    setVisible(true)
    setLoading(true)
    const res:BaseSource = await getResourceDetail(resourceId)
    setCardDetail(res)
    setLoading(false)
  }

  const onClose = () => {
    setVisible(false)
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
        <Icon component={closeSvg} style={{ fontSize: 36 }} />
      </div>
      {
        loading ? <Skeleton active />
          : (
            <div className={s['drawer-content']}>
              <div className={s['img-box']}>
                {/* <Image alt={cardDetail?.resourceName} src={cardDetail?.resourceThumbUrl} /> */}
                <Model />
              </div>
              <div className={s['detail-box']}>
                <div className={s['user-info']}>
                  <Avatar size={20}>U</Avatar>
                  <span className={s['user-name']}>test</span>
                </div>
                <div className={s['resource-name']}>{cardDetail?.resourceName}</div>
                <div className={s['update-time']}>
                  <span>更新于&nbsp;</span>
                  {moment(cardDetail?.gmtModified).format('YY/MM/DD HH:mm:ss') }
                </div>
                <div className={s['tag-box']}>
                  {
                    cardDetail?.tagInfo && Object.keys(cardDetail?.tagInfo)
                      .map((item) => <Tag key={item} tagName={cardDetail?.tagInfo[item]} />)
                  }
                </div>
                <div className={s['resource-description']}>{cardDetail?.resourceDescription}</div>
                <Button className={s['download-btn']} type="primary" icon={<Icon component={downloadSvg} style={{ color: '#fff' }} />}>下载</Button>
              </div>
            </div>
          )
      }
    </Drawer>
  )
};

export default forwardRef(CardDetail)
