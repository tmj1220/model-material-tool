import _extends from '@babel/runtime/helpers/esm/extends'
import { message } from 'antd'
import { useState } from 'react'
import { Info } from '../index.d'

export const useForceUpdate = () => {
  // eslint-disable-next-line no-unused-vars
  const [ignored, forceUpdate] = useState(false);
  return () => forceUpdate(pre => !pre)
}

export const commonErrorMessage = (msg) => {
  message.error({
    content: msg,
    key: 'CommonErrorMessage',
  })
}

export function getTarget(file, fileList) {
  const matchKey = file.uid !== undefined ? 'uid' : 'name'
  return fileList.filter((item) => item[matchKey] === file[matchKey])[0]
}

export function file2Obj(file) {
  return _extends(_extends({}, file), {
    lastModified: file.lastModified,
    lastModifiedDate: file.lastModifiedDate,
    name: file.name,
    size: file.size,
    type: file.type,
    uid: file.uid,
    percent: 0,
    originFileObj: file,
  })
}

export function updateFileList(file, fileList) {
  const newFileList = [...fileList]
  const fileIndex = newFileList.findIndex((_ref) => {
    const { uid } = _ref
    return uid === file.uid
  })

  if (fileIndex === -1) {
    newFileList.push(file)
  } else {
    newFileList[fileIndex] = {
      ...newFileList[fileIndex],
      ...file,
    }
  }

  return newFileList
}

export function removeFileItem(file, fileList) {
  const matchKey = file.uid !== undefined ? 'uid' : 'name'
  const removed = fileList.filter((item) => item[matchKey] !== file[matchKey])
  return removed
}

export const getUid = (index: number) => 'rc-upload-'.concat(String(+new Date()), '-').concat(String(index))

const isImageFileType = function isImageFileType(type) {
  return type.indexOf('image/') === 0
}

// eslint-disable-next-line no-unused-vars
export const parseVideo = (data: File | string) => new Promise((res: (info: Info) => void) => {
  window.URL = window.URL || window.webkitURL
  const video = document.createElement('video')
  video.preload = 'metadata'
  video.onloadedmetadata = function () {
    window.URL.revokeObjectURL(video.src)
    res({
      width: video.videoWidth,
      height: video.videoHeight,
    })
  }
  video.src = typeof data === 'string' ? data : window.URL.createObjectURL(data)
})

export const parseLocalVideo = (file) => new Promise<{ width: number, height: number }>((res) => {
  window.URL = window.URL || window.webkitURL
  const video = document.createElement('video')
  video.preload = 'metadata'
  video.onloadedmetadata = function () {
    window.URL.revokeObjectURL(video.src)
    res({
      width: video.videoWidth,
      height: video.videoHeight,
    })
  }
  video.src = URL.createObjectURL(file)
})

// eslint-disable-next-line no-unused-vars
export const parseOnlineImage = (url) => new Promise((res: (info: Info) => void) => {
  const img = new Image()
  img.onload = () => {
    res({ width: img.naturalWidth, height: img.naturalHeight })
  }
  img.src = url
})

const MEASURE_SIZE = 400
// eslint-disable-next-line no-unused-vars
export const parseLocalImage = (file) => new Promise((resolve: (info: Info) => void) => {
  if (!file.type || !isImageFileType(file.type)) {
    resolve(null)
    return
  }

  const canvas = document.createElement('canvas')
  canvas.width = MEASURE_SIZE
  canvas.height = MEASURE_SIZE
  canvas.style.cssText = 'position: fixed; left: 0; top: 0; width: '
    .concat(String(MEASURE_SIZE), 'px; height: ')
    .concat(String(MEASURE_SIZE), 'px; z-index: 9999; display: none;')
  document.body.appendChild(canvas)
  const ctx = canvas.getContext('2d')
  const img = new Image()

  img.onload = function () {
    const { width } = img;
    const { height } = img
    let drawWidth = MEASURE_SIZE
    let drawHeight = MEASURE_SIZE
    let offsetX = 0
    let offsetY = 0

    const r = width / height
    if (width > height) {
      drawWidth = drawHeight * r
      // offsetY = -(drawHeight - drawWidth) / 2;
      offsetX = -(drawWidth - drawHeight) / 2
    } else {
      drawHeight = drawWidth / r
      offsetY = -(drawHeight - drawWidth) / 2
      // offsetX = -(drawWidth - drawHeight) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
    const dataURL = canvas.toDataURL()
    document.body.removeChild(canvas)
    resolve({
      url: dataURL,
      width,
      height,
    })
  }

  img.src = window.URL.createObjectURL(file)
})

export const calculateChunks = (file, size) => {
  const chunks = []
  let cur = 0
  // console.log(file);
  if (file.size <= size) {
    return [file]
  }
  while (cur < file.size) {
    chunks.push({
      index: cur,
      file: file.slice(cur, cur + size),
    })
    cur += size
  }
  return chunks
}

export const calculateHashBulon = (file, offset = 2 * 1024 * 1024) => {
  const { size } = file
  // 第一个2M， 最后一个区块数据全要
  const chunks = [file.slice(0, offset)]
  let cur = offset
  while (cur < size) {
    if (cur + offset >= size) {
      // 最后一个区块
      chunks.push(file.slice(cur, cur + offset))
    } else {
      // 中间区块
      const mid = cur + offset / 2
      const end = cur + offset
      chunks.push(file.slice(cur, cur + 2))
      chunks.push(file.slice(cur, mid + 2))
      chunks.push(file.slice(end - 2, end))
    }
    cur += offset
  }
  return chunks.map((v, index) => ({ index, file: v }))
}
