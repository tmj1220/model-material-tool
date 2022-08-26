import React, {
  useState, useImperativeHandle, forwardRef,
} from 'react';
import type { ForwardRefRenderFunction } from 'react'
import { Drawer } from 'antd'
import Image from '@/components/image'
import s from './index.less'

interface IndexProps {

}

const CardDetail: ForwardRefRenderFunction<{
  onShowDrawer: (data) => void,
}, IndexProps> = (props, ref) => {
  const [visible, setVisible] = useState<boolean>(false)
  const [cardDetail, setCardDetail] = useState<BaseSource>(null)

  const onShowDrawer = (detail) => {
    setVisible(true)
    setCardDetail(detail)
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
      closable={false}
      onClose={onClose}
      visible={visible}
    >
      <div className={s['drawer-content']}>
        <div className={s['img-box']}>
          <Image alt={cardDetail?.resourceName} src={cardDetail?.resourceThumbUrl} />
        </div>
        <div className={s['detail-box']}>
          test
        </div>
      </div>
    </Drawer>
  )
};

export default forwardRef(CardDetail)
