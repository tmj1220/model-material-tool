import { getResourceDetail } from '@/services/list';
import { Button, Modal } from 'antd';
import Icon from '@ant-design/icons';
import React, {
  useState, useImperativeHandle, forwardRef, ForwardRefRenderFunction,
} from 'react';
import { figureFileSize } from '@/utils/utils'
import { formatTypes } from '@/utils/constant'
import downloadSvg from '@/assets/images/anticons/download.svg'
import c4dSvg from '@/assets/images/anticons/c4d.svg'
import unitypackageSvg from '@/assets/images/anticons/unitypackage.svg'
import blendSvg from '@/assets/images/anticons/blend.svg'
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
  const [infoData, setInfoData] = useState<any[]>([]);
  const onShowDrawer = async (data) => {
    // 按type的指定顺序排序
    const order = formatTypes.map((v) => v.format);
    if (data instanceof Object) {
      const info = Object.keys(data.infoForDownload).map((item) => data.infoForDownload[item])
      info.sort((star, next) => order.indexOf(star.modelType) - order.indexOf(next.modelType))
      setInfoData(info);
    } else {
      try {
        const res: BaseSource = await getResourceDetail(data);
        const info = Object.keys(res.infoForDownload).map((item) => res.infoForDownload[item])
        info.sort((star, next) => order.indexOf(star.modelType) - order.indexOf(next.modelType))
        setInfoData(info);
      } catch (error) {
        setInfoData([]);
      }
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
      case '.unitypackage':
        return <Icon component={unitypackageSvg} />
      case '.blend':
        return <Icon component={blendSvg} />
      case '.c4d':
        return <Icon component={c4dSvg} />
      case '.mb':
        return <Icon component={mbSvg} />
      case '.max':
        return <Icon component={maxSvg} />
      case '.fbx':
        return <img src={fbxSvg} alt="" />
      case '.obj':
        return <img src={objSvg} alt="" />
      case '.gltf':
      case '.glb':
        return <Icon component={gltfSvg} />
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
      {infoData && infoData.map((item) => (
        <p key={item.resourceFileUrl} className={s['model-download-item']}>
          <span className={s['format-name']}>
            {formatIcon(item.modelType)}
            <span className={s.format}>{item.modelType}</span>
          </span>
          <Button
            onClick={() => {
              window.open(item.resourceFileUrl)
            }}
            type="primary"
            size="middle"
          >
            <Icon component={downloadSvg} />
            下载
            <span className={s['file-size']}>{figureFileSize(item.resourceFileSize)}</span>
          </Button>
        </p>
      ))}
    </Modal>
  );
};

export default forwardRef(CardDetail);
