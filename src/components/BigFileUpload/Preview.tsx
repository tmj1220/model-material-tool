/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react'
import classnames from 'classnames'
import {
  Progress, Button, Tooltip,
} from 'antd'
import { RCFile, Info } from './index.d'
import { parseOnlineImage, parseLocalImage, parseVideo } from './utils/utils'
import DragIcon from './assets/images/icons/move.svg'
import RemoveIcon from './assets/images/icons/remove.svg'
import PreviewIcon from './assets/images/icons/preview.svg'
import PreviewPlayIcon from './assets/images/icons/previewPlay.svg'
import WarnIngIcon from './assets/images/icons/warning.svg'
import * as constant from './constant'
import './Preview.less'

const PriviewVideo = 'https://p.rokidcdn.com/saas-ar/armaz/priviewVideo.png'
const PriviewAudio = 'https://p.rokidcdn.com/saas-ar/armaz/audioPreview.png'
const PriviewOtherFile = 'https://p.rokidcdn.com/saas-ar/armaz/previewOtherFile.png'
export interface PreviewProps {
  file: RCFile
  onRemove: Function
  onPreview: Function
  needCheckImgRatio?: boolean
  imgRatio?: number
  needSort?: boolean
}

const Preview: React.FC<PreviewProps> = ({
  needSort, file, onRemove, onPreview, needCheckImgRatio, imgRatio,
}) => {
  // const {
  //   originFileObj, name, status, percent, url, imageThumbnailUrl,
  // } = file
  const [previewUrl, setPreviewUrl] = useState<string>(file.imageThumbnailUrl)
  const [info, setInfo] = useState<Info>({ width: null, height: null, url: null })
  const extension = file?.name.split('.').pop().toLowerCase()
  const isLocalImg = file?.originFileObj?.type.startsWith('image/')
  const isLocalVideo = file?.originFileObj?.type.startsWith('video/')
  const isLocalAudio = file?.originFileObj?.type.startsWith('audio/')
  const fileType = constant.EXTENSION_TO_MIME_TYPE_MAP[extension]
  const isImg = isLocalImg || (fileType?.startsWith('image/'))
  const isVideo = isLocalVideo || (fileType?.startsWith('video/'))
  const isAudio = isLocalAudio || (fileType?.startsWith('audio/'))
  const isOtherFile = !isImg && !isVideo && !isAudio
  // count++
  // console.log(file.uid, count);
  const setlocalImg = async (obj) => {
    try {
      const data = await parseLocalImage(obj)
      if (data) {
        const { url, width, height } = data
        setPreviewUrl(url)
        setInfo({ width, height })
      }
    } catch (error) {
      console.log('setlocalImg error', error)
    }
  }

  const setRemoteImg = async (url) => {
    try {
      const data = await parseOnlineImage(url)
      if (data) {
        setPreviewUrl(url)
        // setInfo(data)
      }
    } catch (error) {
      console.log('setRemoteImg error', error)
    }
  }

  const setVideo = async () => {
    try {
      const data = await parseVideo(isLocalVideo ? file.originFileObj : file.url)
      console.log('setVideo', data)

      if (data) {
        // setPreviewUrl(url)
        isLocalVideo && setInfo(data)
      }
    } catch (error) {
      console.log('setVideo error', error)
    }
  }

  useEffect(() => {
    if (isImg) {
      if (isLocalImg) {
        setlocalImg(file.originFileObj)
      } else if (file.imageThumbnailUrl || file.url) {
        setRemoteImg(file.imageThumbnailUrl || file.url)
      }
    }
    if (isVideo) {
      setVideo()
    }
  }, [])
  // console.log('Preview', JSON.stringify(file));
  // console.log('onRemove', onRemove);

  console.log('preview file', file);

  return (
    <div className="big-file-preview-file-box">
      {isImg && previewUrl && (
        <div
          className="big-file-preview-preview-url"
          style={{
            background: `url(${previewUrl}) center no-repeat`,
            backgroundSize: 'cover',
            backgroundColor: '#eeeeee',
          }}
        />
      )}
      {needCheckImgRatio
        && info.width
        && (info.width / info.height) !== imgRatio ? (
          <Tooltip title="common.sortIUpload.ratio.err">
            {/* <Icon component={WarnIngIcon} className="big-file-preview-warning-icon" /> */}
            <img src={WarnIngIcon} className="big-file-preview-warning-icon" />
          </Tooltip>
        ) : null}
      {isVideo && <img className="big-file-preview-preview-url" src={PriviewVideo} />}
      {isAudio && <img className="big-file-preview-preview-url" src={PriviewAudio} />}
      {isOtherFile && <img className="big-file-preview-preview-url" src={PriviewOtherFile} />}
      {/* {!previewUrl && <span className="dzu-previewFileName">{name}</span>} */}
      {/* <Icon
        component={RemoveIcon}
        onClick={() => {
          // console.log('onRemove img',);
          onRemove(file)
        }}
        className="big-file-preview-remove-icon"
      /> */}
      <img
        src={RemoveIcon}
        onClick={() => {
          // console.log('onRemove img',);
          onRemove(file)
        }}
        className="big-file-preview-remove-icon"
      />
      {file.status === 'uploaded' && (isImg || isAudio || isVideo) && (
        <img
          src={isImg ? PreviewIcon : PreviewPlayIcon}
          onClick={() => {
            onPreview(file.url, file.name)
          }}
          alt=""
          className="big-file-preview-preview-icon"
        />
        // <Icon
        //   component={isImg ? PreviewIcon : PreviewPlayIcon}
        //   onClick={() => {
        //     onPreview(url, name)
        //   }}
        //   className="big-file-preview-preview-icon"
        // />
      )}
      {file.status === 'uploaded' && needSort && (
        <div className={classnames('big-file-preview-misk', 'big-file-preview-drag-box')}>
          {' '}
          {/* <Icon component={DragIcon} className="big-file-preview-drag-icon" /> */}
          <img src={DragIcon} className="big-file-preview-drag-icon" />
          common.sortIUpload.button.drag
        </div>
      )}

      {['uploading', 'calculating', 'merging', 'waiting', 'checking'].includes(file.status) && (
        <div className={classnames('big-file-preview-progress-box', 'big-file-preview-misk')}>
          <span>common.sortIUpload.status</span>
          <Progress
            className="big-file-progress"
            status="active"
            percent={['uploading', 'calculating'].includes(file.status) ? file.percent : 100}
            showInfo={false}
            strokeWidth={4}
          />
        </div>
      )}

      {file.status === 'error' && (
        <div className={classnames('big-file-preview-fail-box', 'big-file-preview-misk')}>
          <span>common.sortIUpload.status.fail</span>
          <Button
            onClick={() => {
              file && file.retry && file.retry()
            }}
            size="small"
            style={{
              width: '46px', height: '20px', fontSize: '12px', padding: '0',
            }}
            type="primary"
          >
            common.sortIUpload.button.retry
          </Button>
        </div>
      )}
    </div>
  )
}

export default Preview
