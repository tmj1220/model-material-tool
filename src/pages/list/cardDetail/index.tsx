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
import Image from '@/components/image'
import Tag from '@/components/tag/index'
import { getResourceDetail } from '@/services/list'
import s from './index.less'

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
    const res = await getResourceDetail(resourceId)
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
      className={s['card-detail-drawer']}
      placement="bottom"
      maskClosable={false}
      closable={false}
      onClose={onClose}
      visible={visible}
    >
      {
        loading ? <Skeleton active />
          : (
            <div className={s['drawer-content']}>
              <div className={s['img-box']}>
                <Image alt={cardDetail?.resourceName} src={cardDetail?.resourceThumbUrl} />
              </div>
              <div className={s['detail-box']}>
                <div className={s['close-icon']} onClick={onClose}>
                  <Icon component={closeSvg} style={{ fontSize: 24 }} />
                </div>
                <div className={s['user-info']}>
                  <Avatar size={20}>U</Avatar>
                  <span className={s['user-name']}>test</span>
                </div>
                <div className={s['resource-name']}>{cardDetail?.resourceName}</div>
                <div className={s['update-time']}>更新于 2022/05/10 19:24:34</div>
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
