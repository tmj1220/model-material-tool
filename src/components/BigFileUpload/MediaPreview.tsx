/*
 * @Author: like 465420404@qq.com
 * @Date: 2022-09-06 18:02:22
 * @LastEditors: like 465420404@qq.com
 * @LastEditTime: 2022-09-06 19:39:58
 * @FilePath: /model-material-tool/src/components/BigFileUpload/MediaPreview.tsx
 * @Description:
 *
 * Copyright (c) 2022 by like 465420404@qq.com, All Rights Reserved.
 */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react'
import { Modal } from 'antd'

const previewMedia = ({
  filePath,
  formatMessage,
  visible,
  onClose,
  wrapClassName,
  autoPlay,
}: {
  wrapClassName?: string
  autoPlay?: boolean
  fileName?: string
  filePath?: string
  formatMessage: Function
  visible: boolean
  onClose: Function
}) => {
  if (!filePath) {
    return <span />
  }
  let preview = <div>common.preview.not.support</div>
  // 预览视频
  if (filePath.toLocaleLowerCase().match(/\.mp4/)) {
    preview = (
      <video autoPlay={autoPlay} controls style={{ maxWidth: '100%', maxHeight: '100%' }}>
        <source src={filePath} />
      </video>
    )
  }
  // 音频
  if (filePath.toLocaleLowerCase().match(/\.mp3/)) {
    preview = <audio autoPlay={autoPlay} controls src={filePath} />
  }

  // 图片
  if (filePath.toLocaleLowerCase().match(/\.(jpeg|jpg|gif|png)/) || filePath.indexOf('data:image') === 0) {
    preview = <img style={{ maxWidth: '100%', maxHeight: '100%' }} src={filePath} />
  }

  return (
    <Modal
      width={720}
      visible={visible}
      onCancel={() => {
        onClose()
      }}
      wrapClassName={wrapClassName}
      footer={false}
      title="common.preview"
    >
      <div style={{ textAlign: 'center' }}>{visible ? preview : <span />}</div>
    </Modal>
  )
}

export default previewMedia
