/* eslint-disable no-restricted-syntax */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable no-plusplus */
/* eslint-disable no-unused-expressions */
import React, {
  useCallback, useMemo, useRef, useEffect, useState, forwardRef, useImperativeHandle,
} from 'react'
import type { ForwardRefRenderFunction } from 'react'
import Upload from 'rc-upload'
import { message, Button } from 'antd'
import { useIntl } from 'react-intl'
import localRequest from '@/utils/request'
import axios from 'axios'
// eslint-disable-next-line import/no-webpack-loader-syntax
import HashWorker from 'worker-loader!./assets/workers/calculate-hash.worker.js'
import GlobalUploadQueue from './utils/globalUploadQueue'
import {
  RCFile,
  OssFile,
  FileChangeType,
  Requests,
  Accept,
  CalculateHashMode,
  CheckFileResponse,

} from './index.d'
import * as constants from './constant'
import {
  calculateChunks,
  calculateHashBulon,
  updateFileList,
  file2Obj,
  removeFileItem,
  getUid,
  commonErrorMessage,
  parseLocalImage,
  parseLocalVideo,
  useForceUpdate,
  getTarget,
} from './utils/utils'
import MediaPreview from './MediaPreview'
import FileList from './FileList'
import './index.less'

const { CancelToken } = axios
const hashWorker:Worker = new HashWorker()
const globalUploadQueue = new GlobalUploadQueue()
const isObject = (v) => Object.prototype.toString.call(v) === '[object Object]'
const isArray = (v) => Object.prototype.toString.call(v) === '[object Array]'
// window.queue = globalUploadQueue
interface Instance {
  reset: () => void
}

interface RcUploadProps {
  value?: OssFile[] | OssFile // 当前组件上传成功的文件 可以是一个也可以是一个数组
  // eslint-disable-next-line no-unused-vars
  onChange?: (file:OssFile[] | OssFile)=>void // OssFile文件上传成功或者删除已上传成功后的文件的回调函数
  // eslint-disable-next-line no-unused-vars
  onOriginFileChange?: (file:RCFile[] | RCFile)=>void // RcFile文件上传成功或者删除已上传成功后的文件的回调函数
  // eslint-disable-next-line no-unused-vars
  beforeRemove?: (v: File) => Promise<boolean> // 删除文件前的回调函数 决定是否删除 默认返回true
  // eslint-disable-next-line no-unused-vars
  concurrentQuantity?:number // 单个大文件的分片文件 同时上传的并发上限 默认为3
  // eslint-disable-next-line max-len
  request?:(url:string, options:Record<string, any>)=>Promise<any> // 发起请求的工具函数 默认使用 路径为'@/utils/request'的工具函数
  chunkSize?:number // 分片文件大小
  calculateHashMode?: CalculateHashMode // 计算hash的方式 默认使用 bulon
  checkFileUrl?: string // 检查文件上传情况的url
  uploadFileUrl?: string // 上传分片文件的url
  mergeFileUrl?: string // 请求合并文件的url
  accepts?: Accept[] // 可以上传的文件后缀集合 默认为['.png', '.jpg', '.jpeg', '.mp4']
  limit?: number // 允许上传的文件数量上限 默认为 5
  needSort?: boolean // 是否需要拖拽排序 默认为 true
  needCheckImgRatio?: boolean // 是否需要检查图片长宽比 默认为true
  minImgResolutionRatio?: string // `${width}*${height}` 最小图片分辨率
  maxImgResolutionRatio?: string// `${width}*${height}` 最大图片分辨率
  minVideoResolutionRatio?: string// `${width}*${height}` 最小视频分辨率
  maxVideoResolutionRatio?: string// `${width}*${height}` 最大视频分辨率
}

const RcUpload: ForwardRefRenderFunction<Instance, RcUploadProps> = (
  {
    value = [],
    onChange,
    onOriginFileChange,
    request = localRequest,
    concurrentQuantity = constants.DEFAULT_CONCURRENT_QUANTITY,
    chunkSize = constants.DEFAULT_CHUNK_SIZE,
    calculateHashMode = constants.DEFAULT_CALCULATE_HASH_MODE,
    checkFileUrl = constants.DEFAULT_CHECK_FILE_URL,
    uploadFileUrl = constants.DEFAULT_UPLOAD_FILE_URL,
    mergeFileUrl = constants.DEFAULT_MERGE_FILE_URL,
    limit = constants.DEFAULT_LIMIT,
    minImgResolutionRatio, // `${width}*${height}`
    maxImgResolutionRatio,
    minVideoResolutionRatio,
    maxVideoResolutionRatio,
    accepts = constants.DEFAULT_ACCEPTS,
    needSort = constants.DEFAULT_NEED_SORT,
    needCheckImgRatio = constants.DEFAULT_NEED_CHECK_IMG_RATIO,
    beforeRemove = () => Promise.resolve(true),
  },
  ref,
) => {
  const intl = useIntl()
  const dragBoxRef = useRef<HTMLDivElement>()
  const requestsRef = useRef<Requests>({})
  const forceUpdate = useForceUpdate()
  const [previewInfo, setPreviewInfo] = useState(null)
  // console.log('value', value)

  const val2RcFiles = (val) => {
    let arr: RCFile[] = []
    console.log('val2RcFiles', val);

    if (isArray(val)) {
      arr = val
    } else if (isObject(val)) {
      arr = [val]
    }
    return arr.map((ossFile, i) => {
      console.log('ossFile', ossFile);

      const { fileUrl, fileThumbnailUrl } = ossFile
      const startIndex = fileUrl.lastIndexOf('/')
      const queryIndex = fileUrl.lastIndexOf('?')
      const fileName = fileUrl.slice(startIndex, queryIndex === -1 ? fileUrl.length : queryIndex)
      // const suffix = fileName.slice(fileName.lastIndexOf('.'), fileName.length)
      return {
        name: fileName,
        imageThumbnailUrl: fileThumbnailUrl,
        url: fileUrl,
        status: 'uploaded',
        uid: getUid(i),
        ossFile,
      } as any
    })
  }

  // 处理value 回现
  const fileListRef = useRef<RCFile[]>(val2RcFiles(value))
  useEffect(() => {
    if ((value instanceof Array) || (typeof value === 'object')) {
      const val = isObject(value) ? [value as OssFile] : value as OssFile[]
      const newVals = val.filter((j) => !fileListRef.current.some((v) => v.url === j.fileUrl))

      if (newVals.length) {
        const news = val2RcFiles(newVals)
        // console.log('newVals', newVals)
        // console.log('news', news)
        fileListRef.current = [...news, ...fileListRef.current]
        forceUpdate()
      }
    }
  }, [value])

  const reset = useCallback(() => {
    Object.values(requestsRef.current).forEach((item) => item && item.abort && item.abort())
    fileListRef.current = []

    onChange && onChange([])

    onOriginFileChange && onOriginFileChange([])
  }, [onChange])

  /**
   * 获取当前组件的最新状态
   */
  const getFileItem = useCallback(
    (file:RCFile) => getTarget(file, fileListRef.current),
    [],
  )

  /**
   * 更新组件内部文件参数的函数
   */
  const updateFileStatus = useCallback((file:RCFile, propTypes:Partial<RCFile>) => {
    let targetItem = file2Obj(file)
    targetItem = {
      ...targetItem,
      ...propTypes,
    }
    // console.log('updateFileStatus', targetItem);

    fileListRef.current = updateFileList(targetItem, fileListRef.current)
    forceUpdate()
  }, [])
  // console.log('render', fileListRef.current);

  useImperativeHandle(
    ref,
    () => ({
      reset,
    }),
    [reset],
  )

  const currentLength = fileListRef.current.length
  const shouldHasAddButton = limit > currentLength
  const shouldHasResetButton = currentLength > 1

  const fileList2Value = () => fileListRef.current.filter((item) => item.status === 'uploaded').map(({ ossFile }) => ossFile)

  const onFileChange = (type: FileChangeType, file?: RCFile) => {
    if (['success', 'sort'].includes(type) || (type === 'remove' && file.status === 'uploaded')) {
      onChange && onChange(fileList2Value())
      onOriginFileChange && onOriginFileChange(fileListRef.current.filter((item) => item.status === 'uploaded'))
    }
  }

  useEffect(() => () => {
    // 卸载时 取消所有上传中的请求
    Object.values(requestsRef.current).forEach((item) => item && item.abort && item.abort())
  }, [])

  const props = useMemo(
    () => ({
      // type: 'drag',
      accept: accepts.join(','),
      multiple: true,
      directory: false,
      customRequest({
        onProgress,
        onError, onSuccess,
        data, filename, file, withCredentials, action, headers, method, onStart,
      }) {
        // console.log('customRequest', file.uid)
        // checkFileUrl?: string
        // uploadFileUrl?: string
        // mergeFileUrl?: string

        const uploadFunc = async () => {
          if ((globalUploadQueue.getWaitSize(uploadFileUrl) > 0)
        || !!globalUploadQueue.getUploadingFile(uploadFileUrl)) {
            globalUploadQueue.addWaiting(
              uploadFileUrl,
              file.uid,
              {
                uploadFunc,
                file,
              },
            )
            return
          }
          globalUploadQueue.setUploadingFile(uploadFileUrl, file)

          try {
            onStart && onStart(file)
            // 真实上传的chunks
            const chunks = calculateChunks(file, chunkSize)
            // 计算hash的chunks
            const hashChunks = calculateHashMode === 'all' ? chunks : calculateHashBulon(file)
            // 文件hash
            const hashCode = await (new Promise<string>((res, rej) => {
              hashWorker.postMessage({
                chunks: hashChunks,
              })
              hashWorker.onmessage = (e) => {
                const { progress, hash } = e.data
                updateFileStatus(file, {
                  status: 'calculating',
                  percent: progress,
                })
                if (hash) {
                  res(hash)
                }
              }
              hashWorker.onerror = (e) => {
                console.log('worker error', e);
                rej(e)
              }
            }))
            updateFileStatus(file, {
              status: 'checking',
              percent: 0,
            })
            console.log('chunks', chunks);

            /**
             * 检查当前上传任务（hash+chunkSize 可以组成一个唯一任务）的上传情况
             * @returns uploaded boolean
             */
            const { uploaded, uploadedList = [], uploadedFileInfo }:CheckFileResponse = await request(checkFileUrl, {
              params: {
                fileCode: hashCode,
                fileName: file.name,
                fileSize: file.size,
                fragmentCount: chunks.length,
                fragmentSize: chunkSize,
                fileContentType: file.type,
              },
            })
            console.log('uploaded, uploadedList, uploadedFileInfo', uploaded, uploadedList, uploadedFileInfo);

            if (uploaded) {
              // delete requestsRef.current[file.uid]
              onSuccess && onSuccess(uploadedFileInfo, file, null)
              return
            }
            updateFileStatus(file, {
              status: 'uploading',
              percent: Number(parseInt(String((((uploadedList || []).length) / chunks.length) * 100), 10)),
            })
            const requests = chunks
              .map((chunk, index) => {
              // 切片的名字， hash+index
                const name = `${hashCode}-${index}`
                return {
                  hash: hashCode,
                  name,
                  index,
                  chunk: chunk.file,
                  // progress:0
                  // 设置初始进度条 已上传过 设为100
                  // progress: (uploadedList || []).indexOf(name) > -1 ? 100 : 0,
                }
              }).filter((chunk) => !(uploadedList || []).some((item) => `${item.fragmentFeatureCode}-${item.fragmentSequence - 1}` === chunk.name))
              .map((chunk) => {
                // 转成Promise
                const form = new FormData()
                form.append('fileCode', chunk.hash)
                form.append('fragmentSize', String(chunkSize))
                form.append('fragmentName', chunk.name)
                form.append('index', String(chunk.index))
                form.append('fragment', chunk.chunk)
                return { form, index: chunk.index, errorTimes: 0 }
              })
            await (new Promise<void>((res, rej) => {
              let maxCq = concurrentQuantity
              const len = requests.length
              let isStop = false
              let count = 0
              const start = async () => {
                if (isStop) {
                  return
                }
                const task = requests.shift()
                if (task) {
                  const {
                    form,
                  // index,
                  } = task
                  try {
                    await request(uploadFileUrl, {
                      method: 'post',
                      data: form,
                      cancelToken: new CancelToken((c) => {
                        requestsRef.current[form.get('fragmentName') as string] = { abort: c }
                      }),
                    })
                    delete requestsRef.current[form.get('fragmentName') as string]
                    if (count === len - 1) {
                      updateFileStatus(file, {
                        status: 'merging',
                        percent: 0,
                      })
                      // 最后一个任务
                      res()
                    } else {
                      const percent = Number(parseInt(String(((count + (uploadedList || []).length + 1) / chunks.length) * 100), 10))
                      console.log('uploading-1', percent, count, len);
                      const current = getFileItem(file)
                      const isError = current.status === 'error'
                      updateFileStatus(file, {
                        status: isError ? 'error' : 'uploading',
                        percent,
                      })
                      count++
                      // 启动下一个任务
                      !isError && start()
                    }
                  } catch (error) {
                    delete requestsRef.current[form.get('fragmentName') as string]
                    if (task.errorTimes < 3) {
                      task.errorTimes++
                      requests.unshift(task)
                      start()
                    } else {
                      // 错误三次
                      isStop = true
                      rej()
                    }
                  }
                }
              }
              while (maxCq > 0) {
                start()
                maxCq--
              }
            }))

            const d = request(mergeFileUrl, {
              method: 'post',
              data: {
                fileCode: hashCode,
                fragmentSize: chunkSize,
              },
            })

            // delete requestsRef.current[file.uid]
            onSuccess && onSuccess(d, file, null)
          } catch (error) {
            console.log('customRequest error', error)
            // delete requestsRef.current[file.uid]
            onError && onError(error, uploadFunc, file)
          }
        }

        uploadFunc()
      },
      async beforeUpload(file, files) {
        // console.log('beforeUpload', file)

        const suffix = `.${file.name.split('.').pop().toLowerCase()}`
        const isRightType = accepts.includes(suffix)
        const totalFiles = [...files, ...fileListRef.current]
        const totalNumber = totalFiles.length
        const size = file.size / 1024 / 1024
        const isImg = ['.png', '.jpg', '.jpeg'].includes(suffix)
        const isVideo = ['.mp4'].includes(suffix)

        if (totalNumber > limit) {
          commonErrorMessage(intl.formatMessage({ id: 'common.sortIUpload.limit.number' }, { limit }))
          return Promise.reject()
        }
        // console.log('beforeUpload1', isImg, isVideo);

        if (isImg || isVideo) {
          const parseFunc = isImg ? parseLocalImage : parseLocalVideo
          if (isImg && (minImgResolutionRatio || maxImgResolutionRatio)) {
            const { width, height } = await parseFunc(file)
            // console.log('beforeUpload2', width, height);
            if (minImgResolutionRatio) {
              const [minWidth, minHeight] = minImgResolutionRatio.split('*')
              if (width < Number(minWidth) || height < Number(minHeight)) {
                message.error(intl.formatMessage({ id: 'common.sortIUpload.minResolutionRatio' }, {
                  name: intl.formatMessage({ id: 'common.fileType.img' }),
                  resolutionRatio: minImgResolutionRatio,
                }))
                return Promise.reject()
              }
            }
            if (maxImgResolutionRatio) {
              const [maxWidth, maxHeight] = maxImgResolutionRatio.split('*')
              // console.log('beforeUpload2', maxWidth, maxHeight);
              if (width > Number(maxWidth) || height > Number(maxHeight)) {
                message.error(intl.formatMessage({ id: 'common.sortIUpload.maxResolutionRatio' }, {
                  name: intl.formatMessage({ id: 'common.fileType.img' }),
                  resolutionRatio: maxImgResolutionRatio,
                }))
                return Promise.reject()
              }
            }
          }
          if (isVideo && (minVideoResolutionRatio || maxVideoResolutionRatio)) {
            const { width, height } = await parseFunc(file)
            // console.log(' width, height', width, height);
            // 如果width height 为 0 默认当前视频为 H.265编码 不做校验
            const isH265 = width === 0 && height === 0
            if (minVideoResolutionRatio && !isH265) {
              const [minWidth, minHeight] = minVideoResolutionRatio.split('*')
              // console.log('minWidth, minHeight', minWidth, minHeight);

              if (width < Number(minWidth) || height < Number(minHeight)) {
                message.error(intl.formatMessage({ id: 'common.sortIUpload.minResolutionRatio' }, {
                  name: intl.formatMessage({ id: 'common.fileType.video' }),
                  resolutionRatio: minVideoResolutionRatio,
                }))
                return Promise.reject()
              }
            }
            if (maxVideoResolutionRatio && !isH265) {
              const [maxWidth, maxHeight] = maxVideoResolutionRatio.split('*')
              if (width > Number(maxWidth) || height > Number(maxHeight)) {
                message.error(intl.formatMessage({ id: 'common.sortIUpload.maxResolutionRatio' }, {
                  name: intl.formatMessage({ id: 'common.fileType.video' }),
                  resolutionRatio: maxVideoResolutionRatio,
                }))
                return Promise.reject()
              }
            }
          }
        }
        if (!isRightType) {
          message.error(intl.formatMessage({ id: 'common.sortIUpload.limit.accepts' }, { accepts: accepts.join(',') }))
          return Promise.reject()
        }
        if ((size > 1024 * 1024) || (size < 5)) {
          message.error(intl.formatMessage({ id: 'common.sortIUpload.singleSizeRange' }))
          return Promise.reject()
        }

        return Promise.resolve()
      },
      onStart(file) {
        // console.log('onStart', data);
        updateFileStatus(file, {
          status: 'calculating',
          percent: 0,
        })
      },
      onSuccess(result, file) {
        // console.log('onSuccess', result, file, xhr);

        try {
          if (typeof result === 'string') {
            result = JSON.parse(result)
          }
        } catch (e) {
          /* do nothing */
        } // removed
        if (!getFileItem(file)) {
          return
        }
        // console.log('onSuccess', result)
        updateFileStatus(file, {
          status: 'uploaded',
          percent: 100,
          response: result,
          url: result && result.fileUrl,
          ossFile: result,
        })
        onFileChange('success')
        globalUploadQueue.removeUploadingFile(uploadFileUrl)
        const nextTask = globalUploadQueue.getNextTask(uploadFileUrl)
        if (nextTask) {
          nextTask.uploadFunc()
        }
      },
      onProgress(e, file) {
        if (!getFileItem(file)) {
          return
        }
        updateFileStatus(file, {
          status: 'uploading',
          percent: e.percent,
        })
      },
      onError(error, retry, file) {
        if (!getFileItem(file)) {
          return
        }
        updateFileStatus(file, {
          error,
          retry,
          status: 'error',
        })
        onFileChange('error')
        globalUploadQueue.removeUploadingFile(uploadFileUrl)
        const nextTask = globalUploadQueue.getNextTask(uploadFileUrl)
        if (nextTask) {
          nextTask.uploadFunc()
        }
      },
    }),
    [accepts,
      limit,
      minImgResolutionRatio, // `${width}*${height}`
      maxImgResolutionRatio,
      minVideoResolutionRatio,
      maxVideoResolutionRatio,
    ],
  )
  // console.log('fileListRef.current', fileListRef.current);
  const setFileList = useCallback((fileList) => {
    fileListRef.current = fileList
    forceUpdate()
    onFileChange('sort')
  }, [])
  const onRemove = useCallback((file) => {
    if (!getFileItem(file)) {
      return
    }
    beforeRemove(file).then((ok) => {
      if (ok) {
        const requests = requestsRef.current[file.uid]
        // console.log('file', file, requests)

        if (requests) {
          // console.log('originUploadRef.current.abort')
          requests.abort && requests.abort()
          delete requestsRef.current[file.uid]
        }
        fileListRef.current = removeFileItem(file, fileListRef.current)
        forceUpdate()
        onFileChange('remove', file)
      }
    })
    // console.log(originUploadRef);
  }, [beforeRemove])
  const onDragOver = useCallback(
    (e) => {
      // console.log('onDragOver', dragBoxRef.current);

      e.preventDefault()
      if (!dragBoxRef.current) {
        return
      }
      if (shouldHasAddButton) {
        dragBoxRef.current.style.borderColor = '#1890ff'
      } else {
        dragBoxRef.current.style.borderColor = 'red'
      }
    },
    [shouldHasAddButton],
  )
  const onDragLeave = useCallback(async (e) => {
    // console.log('onDragLeave', e)
    // console.log('onDragLeave', dragBoxRef.current);
    e.preventDefault()
    if (!dragBoxRef.current) {
      return
    }
    dragBoxRef.current.style.borderColor = '#dde0e9'
  }, [])
  const onDrop = useCallback(
    async (e) => {
      // console.log('onDrop', dragBoxRef.current);
      // console.log('onDrop', e)
      e.preventDefault()
      if (!dragBoxRef.current) {
        return
      }
      const originFileList = e.dataTransfer.files
      const len = (originFileList && originFileList.length) || 0

      const isAllowed = limit >= currentLength + len
      // console.log('onDrop  originFileList.length', limit, originFileList.length, isAllowed, len, currentLength)
      dragBoxRef.current.style.borderColor = '#dde0e9'
      if (isAllowed) {
        let files = []
        Array.prototype.forEach.call(originFileList, (v, i) => {
          v.uid = getUid(i)
          files.push(v)
        })
        // originFileList.forEach((v, i) => {
        //     v.uid = getUid(i)
        //     files.push(v)
        // })

        files = files.map((file) => props.beforeUpload(file, files))
        // console.log('uploadFileList', files)
        for await (const file of files) {
          if (file instanceof File) {
            props.customRequest({ ...props, file } as any)
          }
        }
        // files.forEach((file) => {
        //   if (file instanceof File) {
        //     props.customRequest({ ...props, file } as any)
        //   }
        // })
      } else {
        message.error(intl.formatMessage({ id: 'common.sortIUpload.limit.number' }, { limit }))
        // dragBoxRef.current.style.borderColor = 'red'
      }
    },
    [props],
  )

  const onPreview = useCallback((url, name?: string) => {
    // console.log('onPreview url,name', url, name)
    setPreviewInfo({ url, name })
  }, [])

  // console.log('previewInfo', previewInfo)
  // console.log('fileListRef', fileListRef)

  return (
    <div className="sort-media-root">
      {!!previewInfo && (
        <MediaPreview
          autoPlay
          wrapClassName="sort-media-preview-wapper"
          formatMessage={intl.formatMessage}
          fileName={previewInfo.name}
          filePath={previewInfo.url}
          visible
          onClose={() => {
            setPreviewInfo(null)
          }}
        />
      )}
      <div className="sort-media-drag-box" ref={dragBoxRef} onDragOver={onDragOver} onDrop={onDrop} onDragLeave={onDragLeave}>
        {fileListRef.current && currentLength ? (
          <FileList
            needSort={needSort}
            needCheckImgRatio={needCheckImgRatio}
            fileList={fileListRef.current}
            setFileList={setFileList}
            onRemove={onRemove}
            onPreview={onPreview}
          />
        ) : null}
        <div
          className="sort-media-upload-button-box"
          style={{
            justifyContent: !currentLength ? 'center' : 'flex-start',
            alignItems: 'center',
          }}
        >
          {!currentLength && <span>{intl.formatMessage({ id: 'common.sortIUpload.placeholder' })}</span>}
          <Upload {...props}>
            {shouldHasAddButton && (
              <Button type="primary">
                {intl.formatMessage({ id: `common.sortIUpload.button.${fileListRef.current.length ? 'continue' : 'upload'}` })}
              </Button>
            )}
          </Upload>
          {shouldHasResetButton ? (
            <Button style={{ width: '84px' }} onClick={reset}>
              {intl.formatMessage({ id: 'common.sortIUpload.button.reset' })}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default forwardRef(RcUpload)
