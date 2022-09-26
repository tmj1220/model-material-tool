/*
 * @Author: like 465420404@qq.com
 * @Date: 2022-08-27 18:32:25
 * @LastEditors: mingjian.tang mingjian.tang@rokid.com
 * @LastEditTime: 2022-09-26 20:18:01
 * @FilePath: /model-material-tool/src/components/ModelDown/index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by like 465420404@qq.com, All Rights Reserved.
 */
import { getResourceDetail } from '@/services/list';
import { Button, Modal } from 'antd';
import Icon from '@ant-design/icons';
import React, {
  useState, useImperativeHandle, forwardRef, ForwardRefRenderFunction,
} from 'react';
import { figureFileSize } from '@/utils/utils'
import downloadSvg from '@/assets/images/anticons/download.svg'
import c4dSvg from '@/assets/images/anticons/c4d.svg'
import fbxSvg from '@/assets/images/fbx.png'
import gltfSvg from '@/assets/images/anticons/gltf.svg'
import maxSvg from '@/assets/images/anticons/max.svg'
import mbSvg from '@/assets/images/anticons/mb.svg'
import objSvg from '@/assets/images/obj.png'
import s from './index.less';

interface IndexProps { }
export interface ForwardRefOrops {
  onShowDrawer: (arg0: BaseSource | string) => void
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

  /** @description 格式显示图标 */
  const formatIcon = (format) => {
    switch (format) {
      case '.c4d':
        return <Icon component={c4dSvg} />
      case '.mb':
        return <Icon component={mbSvg} />
      case '.max':
        return <Icon component={maxSvg} />
      case '.gltf':
      case '.glb':
        return <Icon component={gltfSvg} />
      case '.fbx':
        return <img src={fbxSvg} alt="" />
      case '.obj':
        return <img src={objSvg} alt="" />
      default:
        return null
    }
  }

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
          <span className={s['format-name']}>
            {formatIcon(infoData.infoForDownload[item].modelType)}
            <span className={s.format}>{infoData.infoForDownload[item].modelType}</span>
          </span>
          <Button
            onClick={() => {
              window.open(infoData.infoForDownload[item].resourceFileUrl)
            }}
            type="primary"
            size="middle"
          >
            <Icon component={downloadSvg} />
            下载
            <span className={s['file-size']}>{figureFileSize(infoData.infoForDownload[item].resourceFileSize)}</span>
          </Button>
        </p>
      ))}
    </Modal>
  );
};

export default forwardRef(CardDetail);
