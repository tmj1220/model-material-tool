/* eslint-disable no-restricted-syntax */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable no-plusplus */
/* eslint-disable no-unused-expressions */
import React, {
  useCallback,
  useMemo,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import Upload from 'rc-upload';
import type { UploadRequestOption } from 'rc-upload/es/interface';
import { message } from 'antd';
import axios from 'axios';
import sparkMd5 from 'spark-md5';
import GlobalUploadQueue from './utils/globalUploadQueue';
import {
  RCFile,
  FileChangeType,
  Requests,
  Accept,
  CalculateHashMode,
  CheckFileResponse,
} from './index.d';
import { calculateChunks, calculateHashBulon } from './utils/utils';

const { CancelToken } = axios;
const globalUploadQueue = new GlobalUploadQueue();
// window.queue = globalUploadQueue

export interface CoreInstance {
  getRequests: () => Requests;
  // eslint-disable-next-line no-unused-vars
  coreProps: any;
  // eslint-disable-next-line no-unused-vars
  onError: (error: Error, func: () => void, file: RCFile) => void;
  getGlobalUploadQueue: () => GlobalUploadQueue;
}

export interface CoreProps {
  // eslint-disable-next-line no-unused-vars
  concurrentQuantity: number; // 单个大文件的分片文件 同时上传的并发上限 默认为3
  // eslint-disable-next-line max-len
  // eslint-disable-next-line no-unused-vars
  request: (url: string, options: Record<string, any>) => Promise<any>; // 发起请求的工具函数 默认使用 路径为'@/utils/request'的工具函数
  // chunkSize:RangeOf2<102400, 20971520> // 分片文件大小 100k~20m 之间
  chunkSize: number; // 分片文件大小 100k~20m 之间
  calculateHashMode: CalculateHashMode; // 计算hash的方式 默认使用 bulon
  checkFileUrl: string; // 检查文件上传情况的url
  uploadFileUrl: string; // 上传分片文件的url
  mergeFileUrl: string; // 请求合并文件的url
  accepts: Accept[]; // 可以上传的文件后缀集合 默认为['.png', '.jpg', '.jpeg', '.mp4']
  limit: number; // 允许上传的文件数量上限 默认为 5
  // eslint-disable-next-line no-unused-vars
  beforeUpload?: (file: RCFile, files: RCFile[]) => Promise<string>; // 上传前的钩子函数
  children?: React.ReactNode; // 文件上传按钮
  uploadLimitInfo?: { max: number; min?: number; hintText?: string }; // 上传文件的限制信息
}
interface OnlyCoreProps {
  // eslint-disable-next-line no-unused-vars
  getFileItem: (file: RCFile) => RCFile | undefined;
  // eslint-disable-next-line no-unused-vars
  updateFileStatus: (file: RCFile, propTypes: Partial<RCFile>) => void;
  // eslint-disable-next-line no-unused-vars
  onFileChange: (type: FileChangeType, file?: RCFile) => void;
}

export type CoreUploadProps = CoreProps & OnlyCoreProps;

const CoreUpload = (
  {
    request,
    concurrentQuantity,
    chunkSize,
    calculateHashMode,
    checkFileUrl,
    uploadFileUrl,
    mergeFileUrl,
    accepts,
    beforeUpload,
    children,
    limit,
    getFileItem,
    updateFileStatus,
    onFileChange,
    uploadLimitInfo,
  }:CoreUploadProps,
  ref: React.Ref<unknown>,
) => {
  if (limit < 1) {
    console.error('Limit should be greater than 1');
  }

  const requestsRef = useRef<Requests>({});
  // console.log('value', value)
  const getRequests = useCallback(() => requestsRef.current, []);

  const errHandle = useCallback((error, retry, file) => {
    // 任何一个上传任务失败 就把当前所有关于该任务的所有进行中的请求 取消
    Object.entries(requestsRef.current).forEach(([key, { abort }]) => {
      if (key.startsWith(file.uid)) {
        abort();
        delete requestsRef.current[key];
      }
    });
    const uploadingFile = globalUploadQueue.getUploadingFile(uploadFileUrl);
    if (uploadingFile && uploadingFile.uid === file.uid) {
      globalUploadQueue.removeUploadingFile(uploadFileUrl);
    }
    const nextTask = globalUploadQueue.getNextTask(uploadFileUrl);
    if (nextTask) {
      nextTask.uploadFunc();
    }
    // 如果上传文件列表里没有该文件就不处理 （比如已经被删除的上传任务）
    if (!getFileItem(file)) {
      return;
    }
    updateFileStatus(file, {
      error,
      retry,
      status: 'error',
    });
    onFileChange('error');
  }, []);

  // console.log('render', fileListRef.current);
  const customRequest = useCallback(
    ({
      onError, onSuccess, file, onStart,
    }: UploadRequestOption & any) => {
      // console.log('customRequest', file.uid)
      const uploadFunc = async () => {
        const noOneUploading = !globalUploadQueue.getUploadingFile(uploadFileUrl); // 当前全局（uploadFileUrl相同）没有上传中的文件
        const noOneWaiting = globalUploadQueue.getWaitSize(uploadFileUrl) === 0; //  当前全局（uploadFileUrl相同）没有等待上传的文件
        const curIsNext = globalUploadQueue.isNextTask(uploadFileUrl, file.uid); //  当前全局（uploadFileUrl相同）当前上传任务是不是下一个等待上传的任务
        const canStartUpload = noOneUploading && (noOneWaiting || curIsNext); // 当前上传任务是否立即开始 或者 存入全局待上传队列
        // console.log('canStartUpload', canStartUpload, noOneUploading, noOneWaiting, curIsNext);
        // console.log('canStartUpload 2', file.uid, getFileItem(file));
        if (!canStartUpload) {
          globalUploadQueue.addWaiting(uploadFileUrl, file.uid, {
            uploadFunc,
            file,
          });
          updateFileStatus(file, {
            status: 'waiting',
            percent: 0,
          });
          return;
        }
        // 当前上传任务是不是下一个等待上传的任务  那么将该任务从全局待上传任务队列里弹出
        if (curIsNext) {
          globalUploadQueue.removeWaiting(uploadFileUrl, file.uid);
        }
        globalUploadQueue.setUploadingFile(uploadFileUrl, file);

        try {
          onStart && onStart(file);
          // 真实上传的chunks
          const chunks = calculateChunks(file, chunkSize);
          // 计算hash的chunks
          const hashChunks = calculateHashMode === 'all' ? chunks : calculateHashBulon(file);
          // 文件hash
          const hashCode = await new Promise<string>((res, rej) => {
            const spark = new sparkMd5.ArrayBuffer();
            let count = 0;

            const appendToSpark = async (f: File) => new Promise<void>((resolve, reject) => {
              const reader = new FileReader();
              reader.readAsArrayBuffer(f);
              reader.onload = (e) => {
                spark.append(e.target.result);
                resolve();
              };
              reader.onerror = (e) => {
                reject(e);
              };
            });
            const workLoop = async (deadline) => {
              while (
                count < hashChunks.length
                && deadline.timeRemaining() > 1
              ) {
                // 空闲时间,且有任务
                await appendToSpark(hashChunks[count].file);
                count++;

                if (!getFileItem(file)) {
                  rej(new Error('Task has been deleted'));
                  return;
                }
                updateFileStatus(file, {
                  status: 'calculating',
                  percent: Number(
                    ((100 * count) / hashChunks.length).toFixed(2),
                  ),
                });

                if (count === hashChunks.length) {
                  res(spark.end());
                }
              }
              window.requestIdleCallback(workLoop);
            };
            window.requestIdleCallback(workLoop);
          });

          if (!getFileItem(file)) {
            throw new Error('Task has been deleted');
          }
          updateFileStatus(file, {
            status: 'checking',
            percent: 0,
          });
          console.log('chunks', chunks);

          /**
           * 检查当前上传任务（hash+chunkSize 可以组成一个唯一任务）的上传情况
           * @returns uploaded boolean
           */
          const checkFileUrlCancelKey = `${file.uid}-checkFile`;
          const {
            uploadId,
            uploadedFragments = [],
            fileId,
          }: CheckFileResponse = await request(checkFileUrl, {
            params: {
              fileMd5: hashCode,
              fileName: file.name,
              fileSize: file.size,
              fragmentCount: chunks.length,
              fragmentSize: chunkSize,
              fileContentType: file.name.substring(file.name.lastIndexOf(".")),
            },
            cancelToken: new CancelToken((c) => {
              requestsRef.current[checkFileUrlCancelKey] = { abort: c };
            }),
          });

          // console.log('uploaded, uploadedList, uploadedFileInfo', uploaded, uploadedList, uploadedFileInfo);
          delete requestsRef.current[checkFileUrlCancelKey];

          // if (uploaded) {
          //   // delete requestsRef.current[file.uid]
          //   onSuccess && onSuccess(uploadedFileInfo, file, null)
          //   return
          // }
          if (!getFileItem(file)) {
            throw new Error('Task has been deleted');
          }
          updateFileStatus(file, {
            status: 'uploading',
            percent: Number(
              parseInt(
                String(
                  ((uploadedFragments || []).length / chunks.length) * 100,
                ),
                10,
              ),
            ),
          });
          const requests = chunks
            .map((chunk, index) => {
              // 切片的名字， hash+index
              const name = index;
              return {
                hash: hashCode,
                name,
                index,
                chunk: chunk.file,
                // progress:0
                // 设置初始进度条 已上传过 设为100
                // progress: (uploadedList || []).indexOf(name) > -1 ? 100 : 0,
              };
            })
            .filter(
              (chunk) => !(uploadedFragments || []).some(
                (item) => item.fragmentSequence
                    === chunk.name,
              ),
            )
            .map((chunk) => {
              // 转成Promise
              const form = new FormData();
              form.append('fileMd5', chunk.hash);
              form.append('fileId', fileId);
              form.append('uploadId', uploadId);
              // form.append('fragmentSize', String(chunkSize));
              // form.append('fragmentName', chunk.name);
              form.append('index', String(chunk.index));
              form.append('fragment', chunk.chunk);
              return { form, index: chunk.index, errorTimes: 0 };
            });
          await new Promise<void>((res, rej) => {
            let maxCq = concurrentQuantity;
            const len = requests.length;
            let isStop = false;
            let count = 0;
            const start = async () => {
              if (isStop) {
                return;
              }
              const task = requests.shift();
              if (task) {
                const {
                  form,
                  // index,
                } = task;
                try {
                  await request(uploadFileUrl, {
                    method: 'post',
                    data: form,
                    cancelToken: new CancelToken((c) => {
                      requestsRef.current[
                        `${file.uid}-chunk-${form.get('index') as string}`
                      ] = { abort: c };
                    }),
                  });
                  delete requestsRef.current[
                    form.get('fragmentName') as string
                  ];
                  const current = getFileItem(file);
                  if (!current) {
                    throw new Error('Task has been deleted');
                  }
                  const isError = current.status === 'error';
                  if (count === len - 1) {
                    updateFileStatus(file, {
                      status: isError ? 'error' : 'merging',
                      percent: 0,
                    });
                    // 最后一个任务
                    !isError && res();
                  } else {
                    const percent = Number(
                      parseInt(
                        String(
                          ((count + (uploadedFragments || []).length + 1)
                            / chunks.length)
                            * 100,
                        ),
                        10,
                      ),
                    );
                    // console.log('uploading-1', percent, count, len);

                    updateFileStatus(file, {
                      status: isError ? 'error' : 'uploading',
                      percent,
                    });
                    count++;
                    // 启动下一个任务
                    !isError && start();
                  }
                } catch (error) {
                  if (
                    axios.isCancel(error)
                    || (error && error.message === 'Task has been deleted')
                    || task.errorTimes >= 3
                  ) {
                    // 错误三次 或者当前任务已经被删除
                    isStop = true;
                    rej();
                  } else {
                    task.errorTimes++;
                    requests.unshift(task);
                    start();
                  }
                }
              }
            };
            while (maxCq > 0) {
              start();
              maxCq--;
            }
          });
          /**
           * 合并文件请求
           */
          const mergeFileCancelKey = `${file.uid}-mergeFile`;
          const d = await request(mergeFileUrl, {
            method: 'post',
            data: {
              fileMd5: hashCode,
              fragmentSize: chunkSize,
              uploadId,
              fileId,
            },
            cancelToken: new CancelToken((c) => {
              requestsRef.current[mergeFileCancelKey] = { abort: c };
            }),
          });
          delete requestsRef.current[mergeFileCancelKey];
          onSuccess && onSuccess(d, file, null);
        } catch (error) {
          console.log('customRequest error', error);
          // delete requestsRef.current[file.uid]
          onError && onError(error, uploadFunc, file);
        }
      };
      uploadFunc();
    },
    [],
  );

  const coreBeforeUpload = useCallback(
    async (file, files) => {
      let modelType = '';
      try {
        modelType =  await beforeUpload(file, files);
        if(modelType){
          file.modelType = modelType;
        }
      } catch (error) {
        return Promise.reject();
      }

      const size = file.size / 1024 / 1024;
      if (uploadLimitInfo) {
        const { max, min, hintText } = uploadLimitInfo;
        if (size > max) {
          message.error(hintText);
          return Promise.reject();
        }
        if (min && size < min) {
          message.error(hintText);
          return Promise.reject();
        }
      } else if (size > 1024 * 1024 || size < 5) {
        message.error('文件太大');
        return Promise.reject();
      }

      return Promise.resolve(file);
    },
    [beforeUpload, uploadLimitInfo],
  );

  useEffect(
    () => () => {
      // console.log('Core useEffect', requestsRef.current);
      // 卸载时 取消所有上传中的请求
      Object.values(requestsRef.current).forEach(
        (item) => item && item.abort && item.abort(),
      );
    },
    [],
  );

  const coreProps = useMemo(
    () => ({
      // type: 'drag',
      accept: accepts.join(','),
      multiple: true,
      directory: false,
      customRequest,
      beforeUpload: coreBeforeUpload,
      onStart(file) {
        // console.log('onStart', data);
        updateFileStatus(file, {
          status: 'calculating',
          percent: 0,
        });
      },
      onSuccess(result, file) {
        // console.log('onSuccess', result, file,);

        try {
          if (typeof result === 'string') {
            result = JSON.parse(result);
          }
        } catch (e) {
          /* do nothing */
        } // removed
        if (!getFileItem(file as any)) {
          return;
        }
        // console.log('onSuccess', result)
        updateFileStatus(file as any, {
          status: 'uploaded',
          percent: 100,
          response: result,
          url: result && result.fileUrl,
          ossFile: result,
        });
        onFileChange('success');
        globalUploadQueue.removeUploadingFile(uploadFileUrl);
        const nextTask = globalUploadQueue.getNextTask(uploadFileUrl);
        console.log('nextTask', nextTask);

        if (nextTask) {
          nextTask.uploadFunc();
        }
      },
      onProgress(e, file) {
        if (!getFileItem(file)) {
          return;
        }
        updateFileStatus(file, {
          status: 'uploading',
          percent: e.percent,
        });
      },
      onError: errHandle,
    }),
    [accepts, coreBeforeUpload],
  );

  useImperativeHandle(
    ref,
    () => ({
      getRequests,
      onError: errHandle,
      coreProps,
      getGlobalUploadQueue: () => globalUploadQueue,
    }),
    [coreProps],
  );
  // console.log('previewInfo', previewInfo)
  // console.log('fileListRef', fileListRef)

  return <Upload {...coreProps}>{children}</Upload>;
};

export default forwardRef(CoreUpload);
