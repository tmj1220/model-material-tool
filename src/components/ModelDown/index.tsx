/*
 * @Author: like 465420404@qq.com
 * @Date: 2022-08-27 18:32:25
 * @LastEditors: like 465420404@qq.com
 * @LastEditTime: 2022-09-09 17:36:59
 * @FilePath: /model-material-tool/src/components/ModelDown/index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by like 465420404@qq.com, All Rights Reserved.
 */
import { getResourceDetail } from '@/services/list';
import { Button, Modal } from 'antd';
import React, {
  useState, useImperativeHandle, forwardRef, ForwardRefRenderFunction,
} from 'react';
import s from './index.less';

interface IndexProps {}
export interface ForwardRefOrops{
  onShowDrawer:(arg0: BaseSource|string)=>void
}
const CardDetail: ForwardRefRenderFunction<
  ForwardRefOrops,
  IndexProps
> = (props, ref) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [infoData, setInfoData] = useState<BaseSource>(null);
  const onShowDrawer = async (data) => {
    if (data instanceof Object) {
      setInfoData(data);
    } else {
      const res: BaseSource = await getResourceDetail(data);
      setInfoData(res);
    }
    //

    setVisible(true);
  };

  const setOpen = (val) => {
    setVisible(val);
  };

  // 抛出去的方法
  useImperativeHandle(ref, () => ({
    onShowDrawer,
  }));
  return (
    <Modal
      title="请选择下载格式"
      centered
      visible={visible}
      onOk={() => setOpen(false)}
      onCancel={() => setOpen(false)}
      width={416}
      footer=""
    >
      {infoData && Object.keys(infoData.infoForDownload).map((item) => (
        <p key={item} className={s['model-download-item']}>
          <span>{infoData.infoForDownload[item].modelType.split('.')[1]}</span>
          <Button
            onClick={() => {
              window.open(infoData.infoForDownload[item].resourceFileUrl)
            }}
            type="primary"
            size="middle"
          >
            下载
          </Button>
        </p>
      ))}
    </Modal>
  );
};

export default forwardRef(CardDetail);
