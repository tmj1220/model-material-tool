/*
 * @Author: like 465420404@qq.com
 * @Date: 2022-09-08 10:47:01
 * @LastEditors: like 465420404@qq.com
 * @LastEditTime: 2022-09-09 01:04:55
 * @FilePath: /model-material-tool/src/components/BigFileUpload/FileList.tsx
 * @Description:
 *
 * Copyright (c) 2022 by like 465420404@qq.com, All Rights Reserved.
 */
/* eslint-disable react/no-children-prop */
import React, { memo } from 'react';
import {
  SortableContainer,
  SortableElement,
  arrayMove,
} from 'react-sortable-hoc';
// import arrayMove from 'array-move';
import { RCFile } from './index.d';
import './FileList.less';
import Preview from './Preview';
import type { PreviewProps } from './Preview';
import { Col, Row } from 'antd';

interface FileListProps {
  fileList: RCFile[];
  imgRatio?: number;
  setFileList: Function;
  onPreview: Function;
  onRemove: Function;
  needSort?: boolean;
  needCheckImgRatio?: boolean;
}

const MemoPreview = memo(Preview);
const SortableItem = memo(
  SortableElement<PreviewProps>((props) => <Preview {...props} />)
);
const SortableContainerBox: any = SortableContainer(
  ({ children }: Record<string, any>) => (
    <div className="big-file-preview-box">{children}</div>
  )
);

const FileList: React.FC<FileListProps> = ({
  fileList,
  setFileList,
  imgRatio,
  onRemove,
  onPreview,
  needSort,
  needCheckImgRatio,
}) => {
  const onSortEnd = ({ oldIndex, newIndex }) => {
    setFileList(arrayMove(fileList, oldIndex, newIndex));
  };
  // console.log('FileList', fileList);
  // count++
  // console.log('FileList count', count);
  if (!needSort) {
    return (
      <div className="big-file-preview-box">
        <Row>
          {fileList.map((file) => (
            <Col flex="auto" span={8} key={file.uid}>
              <MemoPreview
                needCheckImgRatio={needCheckImgRatio}
                imgRatio={imgRatio}
                onPreview={onPreview}
                needSort={needSort}
                onRemove={onRemove}
                file={file}
              />
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  return (
    <SortableContainerBox distance={1} axis="xy" onSortEnd={onSortEnd}>
      {fileList.map((file, index) => (
        <SortableItem
          needCheckImgRatio={needCheckImgRatio}
          needSort={needSort}
          onPreview={onPreview}
          onRemove={onRemove}
          disabled={!(file && file.status === 'uploaded')}
          file={file}
          key={file.uid}
          index={index}
        />
      ))}
    </SortableContainerBox>
  );
};

export default FileList;
