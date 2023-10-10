/*
 * @Author: like 465420404@qq.com
 * @Date: 2022-08-27 18:32:25
 * @LastEditors: mingjian.tang mingjian.tang@rokid.com
 * @LastEditTime: 2023-10-10 11:44:19
 * @FilePath: /model-material-tool/src/pages/list/card/index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by like 465420404@qq.com, All Rights Reserved.
 */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useRef } from 'react';
import { useModelState } from '@/store';
import Image from '@/components/image';
import Tag from '@/components/tag/index';
import { Tooltip } from 'antd';
import CardDetail from '../cardDetail/index';
import s from './index.less';

interface SourceCardProps extends BaseSource {
  children?: any;
}

const SourceCard: React.FC<SourceCardProps> = ({
  categoryName,
  resourceId,
  resourceName,
  resourceThumbUrl,
  tagInfoList,
  children,
  resourceThumbRgb,
  modelTypes,
  resourceSn,
  format,
}) => {
  const { searchKeyword } = useModelState('list');
  const containerRef = useRef<HTMLDivElement>();
  const cardDetailRef = useRef(null);

  // 查看详情
  const toDetail = () => {
    cardDetailRef.current.onShowDrawer(resourceId);
  };
  // 搜索关键字名称高亮
  const highlightName = () => {
    if (searchKeyword) {
      <Tooltip mouseEnterDelay={0.5} placement="topRight" title={resourceName}>
        <span
          dangerouslySetInnerHTML={{
            __html: resourceName.replace(
              searchKeyword,
              `<span class='${s['high-light']}'>${searchKeyword}</span>`,
            ),
          }}
        />
      </Tooltip>;
    }
    return (
      <Tooltip mouseEnterDelay={0.5} placement="topRight" title={resourceName}>
        {resourceName}
      </Tooltip>
    );
  };

  return (
    <>
      <div
        className={s['source-card-root']}
        key={resourceId}
        onClick={toDetail}
      >
        <div ref={containerRef} className={s['img-box']}>
          <Image
            alt={resourceName}
            src={resourceThumbUrl}
            thumbRgb={resourceThumbRgb}
          />
        </div>
        <div className={s['desc-box']}>
          <div className={s['desc-text-box']}>
            <div className={s['desc-title']}>{highlightName()}</div>
            <div className={s['desc-type']}>
              <span>{categoryName}</span>
              {
                format && (
                <Tooltip mouseEnterDelay={0.5} placement="topRight" title={format.split(',').join('/')}>
                  <span className={s['desc-format']}>{format.split(',').join('/')}</span>
                </Tooltip>
                )
              }
              {
                resourceSn && <span>{resourceSn}</span>
              }
            </div>
            <div className={s['desc-other']}>
              {modelTypes}
              {tagInfoList
                && tagInfoList.length > 0
                && tagInfoList.map((item) => (
                  <Tag key={item.tagId} tagName={item.tagName} />
                ))}
            </div>
          </div>
          {children}
        </div>
      </div>
      <CardDetail ref={cardDetailRef} />
    </>
  );
};

export default SourceCard;
