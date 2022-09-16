/*
 * @Author: like 465420404@qq.com
 * @Date: 2022-09-12 10:18:23
 * @LastEditors: like 465420404@qq.com
 * @LastEditTime: 2022-09-16 16:30:39
 * @FilePath: /model-material-tool/src/components/header/addmodel/index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by like 465420404@qq.com, All Rights Reserved.
 */
import { getEditResourceDetail } from '@/services/list';
import { Drawer } from 'antd';
import {
  useState,
  useImperativeHandle,
  forwardRef,
  ForwardRefRenderFunction,
} from 'react';
import closeSvg from '@/assets/images/anticons/close.svg';
import Icon from '@ant-design/icons';
import AddModel, { Addmodelfrom } from './FromCom';
import s from './index.less';

export interface IndexProps {
  onAdd:Function
}
export interface AddModelForwardRefOrops {
  onShowDrawer: (arg0?: string) => void;
}
const index: ForwardRefRenderFunction<AddModelForwardRefOrops, IndexProps> = (
  { onAdd },
  ref,
) => {
  const [addModelVisible, setaddModelVisible] = useState<boolean>(false);
  const [infoData, setInfoData] = useState<Addmodelfrom>(null);
  const onShowDrawer = async (data) => {
    if (data) {
      const res: Addmodelfrom = await getEditResourceDetail(data);
      res.thumb = [{
        uid: Date.now(),
        url: res.thumbUrl,
        type: '',
        thumbUrl: res.thumbUrl,
        percent: 100,
        status: 'done',
        name: res.thumb,
        fileId: res.thumb,
      }]
      setInfoData(res);
    }
    //
    setaddModelVisible(true);
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
      visible={addModelVisible}
    >
      <div className={s['drawer-close']}>
        <Icon
          onClick={() => {
            setaddModelVisible(false);
          }}
          component={closeSvg}
          style={{ fontSize: 36, color: '#fff' }}
        />
      </div>
      <AddModel
        initialValue={infoData}
        onAdd={(type) => {
          if (onAdd) {
            onAdd(type);
          }
          setaddModelVisible(false);
        }}
      />
    </Drawer>
  );
};

export default forwardRef(index);
