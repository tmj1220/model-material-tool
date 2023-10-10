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
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { message, Button, Modal } from 'antd';
import localRequest from '@/utils/request';
import Upload from './Core';
import type { CoreProps, CoreInstance } from './Core';
import { RCFile, OssFile, FileChangeType, ModelResourceFile } from './index.d';
import * as constants from './constant';
import {
  updateFileList,
  file2Obj,
  removeFileItem,
  getUid,
  useForceUpdate,
  getTarget,
} from './utils/utils';
import MediaPreview from './MediaPreview';
import FileList from './FileList';
import './AwesomeUpload.less';
import { fs } from '../ModelViewer/zip-fs.js';
import DrageUpload from '@/assets/images/anticons/drage-upload.svg';
import Upload1Svg from '@/assets/images/anticons/upload1.svg';
import Icon from '@ant-design/icons';
import { size } from 'lodash';
const isObject = (v) => Object.prototype.toString.call(v) === '[object Object]';
const isArray = (v) => Object.prototype.toString.call(v) === '[object Array]';

export interface AwesomeInstance {
  reset: () => void;
}

export interface AwesomeUploadProps extends Partial<CoreProps> {
  value?: ModelResourceFile[] | ModelResourceFile; // 当前组件上传成功的文件(或文件集合) limit===1的时候 是OssFile ; limit>1 的时候是  OssFile[]
  // eslint-disable-next-line no-unused-vars
  onChange?: (file: ModelResourceFile[] | ModelResourceFile) => void; // OssFile文件上传成功或者删除已上传成功后的文件的回调函数
  // eslint-disable-next-line no-unused-vars
  onOriginFileChange?: (file: RCFile[] | RCFile) => void; // RcFile文件上传成功或者删除已上传成功后的文件的回调函数
  // eslint-disable-next-line no-unused-vars
  beforeRemove?: (v: File) => Promise<boolean>; // 删除文件前的回调函数 决定是否删除 默认返回true
  needSort?: boolean; // 是否需要拖拽排序 默认为 true
  needCheckImgRatio?: boolean; // 是否需要检查图片长宽比 默认为true
  imgRatio?: number; // 图片长宽比 默认为16/9
  minImgResolutionRatio?: string; // `${width}*${height}` 最小图片分辨率
  maxImgResolutionRatio?: string; // `${width}*${height}` 最大图片分辨率
  minVideoResolutionRatio?: string; // `${width}*${height}` 最小视频分辨率
  maxVideoResolutionRatio?: string; // `${width}*${height}` 最大视频分辨率
  delConfirmText?: { title: string; content: string }; // 删除确认文案
  uploadLimitInfo?: { max: number; min?: number; hintText?: string }; // 上传文件的限制信息
  beforeUploadCheck?: (
    file: RCFile,
    files: RCFile[]
  ) => boolean | Promise<boolean>;
}

const RcUpload = (
  {
    value = [],
    // eslint-disable-next-line no-unused-vars
    onChange = () => {},
    // eslint-disable-next-line no-unused-vars
    onOriginFileChange = () => {},
    request = localRequest,
    concurrentQuantity = constants.DEFAULT_CONCURRENT_QUANTITY,
    chunkSize = constants.DEFAULT_CHUNK_SIZE,
    calculateHashMode = constants.DEFAULT_CALCULATE_HASH_MODE,
    checkFileUrl = constants.DEFAULT_CHECK_FILE_URL,
    uploadFileUrl = constants.DEFAULT_UPLOAD_FILE_URL,
    mergeFileUrl = constants.DEFAULT_MERGE_FILE_URL,
    limit = constants.DEFAULT_LIMIT,
    accepts = constants.DEFAULT_ACCEPTS,
    needSort = constants.DEFAULT_NEED_SORT,
    needCheckImgRatio = constants.DEFAULT_NEED_CHECK_IMG_RATIO,
    imgRatio = constants.DEFAULT_IMG_RATIO,
    beforeRemove = () => Promise.resolve(true),
    beforeUploadCheck,
    delConfirmText,
    uploadLimitInfo,
  }: AwesomeUploadProps,
  ref
) => {
  if (limit < 1) {
    console.error('limit should be greater than 1');
  }
  if (chunkSize < 100 * 1024 || chunkSize > 15 * 1024 * 1024) {
    console.error('chunkSize should be between 100K and 5M');
  }
  if (!(typeof onChange === 'function')) {
    console.error('onChange should be a function');
  }
  if (!(typeof onOriginFileChange === 'function')) {
    console.error('onOriginFileChange should be a function');
  }
  const uploadRef = useRef<CoreInstance>();
  const dragBoxRef = useRef<HTMLDivElement>();
  const forceUpdate = useForceUpdate();
  const [previewInfo, setPreviewInfo] = useState(null);

  const val2RcFiles = (val) => {
    let arr: RCFile[] = [];
    // console.log('val2RcFiles', val);
    if (limit > 1 && isArray(val)) {
      arr = val;
    } else if (limit === 1 && isObject(val)) {
      arr = [val];
    }
    return arr.map((ossFile, i) => {
      console.log('ossFile', ossFile);

      const { resourceFileId,modelType, resourceFileUrl,fileSize } = ossFile;
      // const suffix = fileName.slice(fileName.lastIndexOf('.'), fileName.length)
      return {
        modelType,
        name: resourceFileId,
        imageThumbnailUrl: resourceFileUrl,
        url: resourceFileUrl,
        status: 'uploaded',
        uid: getUid(i),
        size:fileSize,
        ossFile:{
          fileId:resourceFileId,
          fileUrl:resourceFileUrl
        },
      } as any;
    });
  };

  // 处理value 回现
  const fileListRef = useRef<RCFile[]>(val2RcFiles(value));
  useEffect(() => {
    const isObj = isObject(value);
    const isArr = isArray(value);
    if (isObj || isArr) {
      const val = isObj
        ? [value as ModelResourceFile]
        : (value as ModelResourceFile[]);
      const newVals = val.filter(
        (j) =>
          !fileListRef.current.some(
            (v) => v.ossFile.fileId === j.resourceFileId
          )
      );

      if (newVals.length) {
        const news = val2RcFiles(newVals);
        // console.log('newVals', newVals)
        // console.log('news', news)
        fileListRef.current = [...news, ...fileListRef.current];
        forceUpdate();
      }
    }
  }, [value]);

  const reset = useCallback(() => {
    Object.values(uploadRef.current.getRequests()).forEach(
      (item) => item && item.abort && item.abort()
    );
    fileListRef.current = [];

    onChange([]);

    onOriginFileChange([]);
  }, [onChange]);

  /**
   * 获取当前组件的最新状态
   */
  const getFileItem = useCallback(
    (file: RCFile) => getTarget(file, fileListRef.current),
    []
  );

  /**
   * 更新组件内部文件参数的函数
   */
  const updateFileStatus = useCallback(
    (file: RCFile, propTypes: Partial<RCFile>) => {
      let targetItem = file2Obj(file);
      targetItem = {
        ...targetItem,
        ...propTypes,
      };
      // console.log('updateFileStatus', targetItem);

      fileListRef.current = updateFileList(targetItem, fileListRef.current);
      forceUpdate();
    },
    []
  );
  // console.log('render', fileListRef.current);

  useImperativeHandle(
    ref,
    () => ({
      reset,
    }),
    [reset]
  );

  useEffect(
    () => () => {
      // 卸载时 将本地待上传的文件 存在全局的待上传队列的任务删除掉
      uploadRef.current?.getGlobalUploadQueue().clear(
        uploadFileUrl,
        fileListRef.current
          .filter((i) => i.status === 'waiting')
          .map((v) => v.uid)
      );
    },
    []
  );

  const currentLength = fileListRef.current.length;
  const shouldHasAddButton = limit > currentLength;
  const shouldHasResetButton = currentLength > 1;

  const fileList2Value = () => {
    const list = fileListRef.current
      .filter((item) => item.status === 'uploaded')
      .map(({ ossFile, modelType,size }) => ({
        resourceFileId: ossFile.fileId,
        modelType,
        fileSize:size
      }));
    return limit > 1 ? list : list[0];
  };

  const fileList2RCFile = () => {
    const list = fileListRef.current.filter(
      (item) => item.status === 'uploaded'
    );
    return limit > 1 ? list : list[0];
  };

  const onFileChange = (type: FileChangeType, file?: RCFile) => {
    if (
      ['success', 'sort'].includes(type) ||
      (type === 'remove' && file.status === 'uploaded')
    ) {
      onChange(fileList2Value());
      onOriginFileChange(fileList2RCFile());
    }
  };
  const handlModelFile = useCallback(async (originFile, accepts) => {
    try {
      let modelType = '';
      await new Promise<void>((res, rej) => {
        const pending = [];
        const archive = new fs.FS();
        // const rightStart = modelFile.name.split('.')[0]
        const traverse = (node: {
          directory: any;
          children: any[];
          name: string;
          getData: (arg0: any, arg1: (blob: any) => void) => void;
          getFullname: () => any;
        }) => {
          // console.log('node', node);
          if (node.directory) {
            node.children.forEach(traverse);
          } else {
            const type = node.name.substring(node.name.lastIndexOf('.'));
            if (accepts.includes(type)) modelType = type;
          }
        };
        archive.importBlob(
          originFile,
          () => {
            traverse((archive as any).root);
            Promise.all(pending).then(() => {
              res();
            });
          },
          (err: any) => {
            console.log('archive.importBlob -error', err);
            rej(err);
          }
        );
      });
      return modelType;
      //prevModelFile.current = originFile;
      //await handleFileMap(tmpMap);
    } catch (error) {
      message.error('文件加载错误');
      console.log('handlModelFile', error);
      return '';
    }
  }, []);
  const beforeUpload = useCallback(
    async (file: RCFile, files:RCFile[]) => {
      if (beforeUploadCheck) {
        const tmpStatus = await beforeUploadCheck(file, files);
        if (!tmpStatus) {
          // eslint-disable-next-line prefer-promise-reject-errors
          return Promise.reject(false);
        }
      }
      const suffix = `.${file.name.split('.').pop().toLowerCase()}`;
      console.log('suffix', suffix, accepts);

      const isRightType = accepts.includes(suffix as any);
      const totalFiles = [...files, ...fileListRef.current];
      const totalNumber = totalFiles.length;
      console.log('totalNumber', totalFiles, totalFiles.length);
      if(file.size > uploadLimitInfo?.max){
        message.error(uploadLimitInfo.hintText);
        return Promise.reject();
      }
      if (totalNumber > limit) {
        message.error('文件数量已最大');
        return Promise.reject();
      }
      if (!isRightType) {
        message.error('文件格式不正确');
        return Promise.reject();
      }
      if (suffix === '.zip') {
        const modelType = await handlModelFile(file, accepts);
        if (!modelType) {
          message.error(`zip文件中须包含 gltf、glb、fbx、mb、c4d、obj、max、blend中任意一种文件类型`);
          return Promise.reject();
        } else {
          return Promise.resolve(modelType);
        }
      }
      return Promise.resolve(suffix);
    },
    [beforeUploadCheck]
  );

  const coreProps = useMemo(
    () => ({
      concurrentQuantity,
      request,
      chunkSize,
      calculateHashMode,
      checkFileUrl,
      uploadFileUrl,
      mergeFileUrl,
      accepts,
      limit,
      uploadLimitInfo,
      beforeUpload,
      getFileItem,
      updateFileStatus,
      onFileChange,
    }),
    [
      concurrentQuantity,
      request,
      chunkSize,
      calculateHashMode,
      checkFileUrl,
      uploadFileUrl,
      mergeFileUrl,
      accepts,
      limit,
      uploadLimitInfo,
      beforeUpload,
      getFileItem,
      updateFileStatus,
      onFileChange,
    ]
  );
  // console.log('fileListRef.current', fileListRef.current);
  const setFileList = useCallback((fileList) => {
    fileListRef.current = fileList;
    forceUpdate();
    onFileChange('sort');
  }, []);
  const onRemove = useCallback(
    (file) => {
      if (!getFileItem(file)) {
        return;
      }
      if (delConfirmText) {
        Modal.confirm({
          title: delConfirmText.title,
          content: delConfirmText.content,
          onOk() {
            beforeRemove(file).then((ok) => {
              if (ok) {
                fileListRef.current = removeFileItem(file, fileListRef.current);
                forceUpdate();
                onFileChange('remove', file);
                uploadRef.current.onError(
                  new Error('Task has been deleted'),
                  () => {},
                  file
                );
              }
            });
          },
          onCancel() {},
        });
      } else {
        beforeRemove(file).then((ok) => {
          if (ok) {
            fileListRef.current = removeFileItem(file, fileListRef.current);
            forceUpdate();
            onFileChange('remove', file);
            uploadRef.current.onError(
              new Error('Task has been deleted'),
              () => {},
              file
            );
          }
        });
      }

      // console.log(originUploadRef);
    },
    [beforeRemove]
  );
  const onDragOver = useCallback(
    (e) => {
      // console.log('onDragOver', dragBoxRef.current);

      e.preventDefault();
      if (!dragBoxRef.current) {
        return;
      }
      if (shouldHasAddButton) {
        dragBoxRef.current.style.borderColor = '#0065FF';
      } else {
        dragBoxRef.current.style.borderColor = '#EB3333';
      }
    },
    [shouldHasAddButton]
  );
  const onDragLeave = useCallback(async (e) => {
    // console.log('onDragLeave', e)
    // console.log('onDragLeave', dragBoxRef.current);
    e.preventDefault();
    if (!dragBoxRef.current) {
      return;
    }
    dragBoxRef.current.style.borderColor = '#dde0e9';
  }, []);
  const onDrop = useCallback(
    async (e) => {
      // console.log('onDrop', dragBoxRef.current);
      // console.log('onDrop', e)
      e.preventDefault();
      if (!dragBoxRef.current) {
        return;
      }
      const originFileList = e.dataTransfer.files;
      const len = (originFileList && originFileList.length) || 0;

      const isAllowed = limit >= currentLength + len;
      console.log(
        'onDrop  originFileList.length',
        limit,
        originFileList.length,
        isAllowed,
        len,
        currentLength
      );
      dragBoxRef.current.style.borderColor = '#dde0e9';
      if (isAllowed) {
        const files = [];

        Array.prototype.forEach.call(originFileList, (v, i) => {
          v.uid = getUid(i);
          files.push(v);
        });
        // originFileList.forEach((v, i) => {
        //     v.uid = getUid(i)
        //     files.push(v)
        // })

        const canUploadPromises = files.map((file) =>
          uploadRef.current.coreProps.beforeUpload(file, files)
        );
        console.log('uploadFileList', canUploadPromises);
        for (const result of canUploadPromises) {
          try {
            // eslint-disable-next-line no-await-in-loop
            const file = await result;

            uploadRef.current.coreProps.customRequest({
              ...uploadRef.current.coreProps,
              file,
            } as any);
          } catch (error) {
            console.log(error);
          }
        }
        // files.forEach((file) => {
        //   if (file instanceof File) {
        //     coreProps.customRequest({ ...coreProps, file } as any)
        //   }
        // })
      } else {
        message.error('common.sortIUpload.limit.number');
        // dragBoxRef.current.style.borderColor = 'red'
      }
    },
    [currentLength]
  );

  const onPreview = useCallback((url, name?: string) => {
    // console.log('onPreview url,name', url, name)
    setPreviewInfo({ url, name });
  }, []);

  // console.log('previewInfo', previewInfo)
  // console.log('fileListRef', fileListRef)

  return (
    <div className="big-file-root">
      {!!previewInfo && (
        <MediaPreview
          autoPlay
          wrapClassName="big-file-preview-wapper"
          formatMessage={() => {}}
          fileName={previewInfo.name}
          filePath={previewInfo.url}
          visible
          onClose={() => {
            setPreviewInfo(null);
          }}
        />
      )}
      <div
        className="big-file-drag-box"
        ref={dragBoxRef}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onDragLeave={onDragLeave}
      >
        {fileListRef.current && currentLength ? (
          <FileList
            needSort={needSort}
            needCheckImgRatio={needCheckImgRatio}
            imgRatio={imgRatio}
            fileList={fileListRef.current}
            setFileList={setFileList}
            onRemove={onRemove}
            onPreview={onPreview}
          />
        ) : null}
        <div
          className="big-file-upload-button-box"
          style={{
            justifyContent: !currentLength ? 'center' : 'flex-start',
            alignItems: 'center',
          }}
        >
          {!currentLength && (
            <div className="upload-add-box">
              <div>
                <div className="upload-icon">
                  <Icon component={DrageUpload} />
                </div>
                <div className="upload-text">点击或者拖拽上传</div>
                {/* <div className="upload-hint">支持格式：c4d/mb/max/gltf/glb/fbx/obj</div>
                <div className="upload-hint">其中glb/gltf格式支持预览</div> */}
              </div>
            </div>
          )}
          <Upload ref={uploadRef} {...coreProps}>
            {shouldHasAddButton &&(
              !currentLength?
              <div className='large-upload-full-button'></div>:
              <Icon className='large-upload-icon-button' component={Upload1Svg} />
            ) }
          </Upload>
          {/* {shouldHasResetButton ? (
            <Button style={{ width: '84px' }} onClick={reset}>
              重置
            </Button>
          ) : null} */}
        </div>
      </div>
    </div>
  );
};

export default forwardRef(RcUpload);
