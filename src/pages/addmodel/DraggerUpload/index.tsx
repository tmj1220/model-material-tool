import { Upload, message, Progress } from 'antd';
import Icon from '@ant-design/icons';
import jsCookie from 'js-cookie';
import { UploadProps } from 'antd/lib/upload/interface';
import { UploadFile } from 'antd/es/upload/interface';
import DrageUpload from '@/assets/images/anticons/drage-upload.svg'
import Delet from '@/assets/images/anticons/delet.svg'
import ImgCrop from 'antd-img-crop';
import s from './index.less'
import 'antd/es/slider/style';

const { Dragger } = Upload;
interface DraggerUploadProps extends UploadProps {
  tips?: string;
  value?: Array<UploadFile>;
  onChange?: (info: any) => void;
  size?: number;
}
const DraggerUpload = ({
  value = [], tips, onChange, size = 2, ...props
}: DraggerUploadProps) => {
  console.log(value)
  const defaultProps: DraggerUploadProps = {
    name: 'file',
    multiple: true,
    listType: 'picture',
    showUploadList: false,
    maxCount: 1,
    headers: {
      Authorization: `Bearer ${jsCookie.get('Admin-Token')}`,
    },
    action: '/api/file/upload',
    beforeUpload(file) {
      const accept = props.accept.split(',');
      let isAcceptType = false;
      if (!accept.includes(file.type)) {
        isAcceptType = false;
        message.error(tips);
      } else {
        isAcceptType = true;
      }
      const sizeLength = file.size / 1024 / 1024 < size;
      if (!sizeLength) {
        message.error(tips);
      }
      return isAcceptType && sizeLength;
    },
  };
  const uploadChange = (info) => {
    const {
      status, uid, name, percent, thumbUrl, url, type,
    } = info.file;
    if (status === 'done') {
      onChange([
        {
          uid: info.file.response.data.fileId,
          name: info.file.name,
          url: info.file.response.data.fileUrl,
          status: 'done',
          type: info.file.type,
          thumbUrl: info.file.response.data.fileUrl,
          percent,
        },
      ])
    } else if (status === 'uploading') {
      onChange([
        {
          percent,
          uid,
          name,
          url,
          status,
          type,
          thumbUrl,
        },
      ])
    } else if (status === 'removed') {
      onChange(null);
    } else if (status === 'error') {
      onChange(null);
      message.error(`${info.file.name} 上传失败.`);
    }
  }
  const progressStep = (item) => {
    switch (item.status) {
      case 'uploading':
        if (item.percent === 100) {
          return 99.99
        }
        return Number(item.percent.toFixed(2))
      case 'done': return 100
      case 'error': return 100
      default: return Number(item.percent.toFixed(2))
    }
  }
  return (
    <ImgCrop
      aspect={332 / 206}
      rotate
    >
      <Dragger fileList={value} onChange={uploadChange} {...defaultProps} {...props}>
        {
        value.length === 0 ? (
          <div className={s['upload-add-box']}>
            <p className={s['upload-icon']}>
              <Icon component={DrageUpload} />
            </p>
            <p className={s['upload-text']}>点击或者拖拽上传</p>
            <p className={s['upload-hint']}>
              {tips}
            </p>
          </div>
        ) : (
          <div>
            <div
              onClick={(e) => {
                e.stopPropagation()
                onChange([])
              }}
              className={s['delet-button']}
            >
              <Icon component={Delet} />
            </div>
            {
              value[0].status === 'done' ? (
                <div
                  style={{ backgroundImage: `url(${value[0].url})` }}
                  className={s['preview-image']}
                />
              )
                : (
                  <Progress
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }}
                    type="circle"
                    percent={progressStep(value[0])}
                  />
                )
          }
          </div>
        )
      }

      </Dragger>
    </ImgCrop>
  )
};
export default DraggerUpload
