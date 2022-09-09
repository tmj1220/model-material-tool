/*
 * @Author: like 465420404@qq.com
 * @Date: 2022-08-27 18:32:25
 * @LastEditors: like 465420404@qq.com
 * @LastEditTime: 2022-09-09 09:25:20
 * @FilePath: /model-material-tool/src/pages/list/card/index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by like 465420404@qq.com, All Rights Reserved.
 */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useRef } from 'react'
import { useModelState } from '@/store'
import Image from '@/components/image'
import downloadSvg from '@/assets/images/icons/download.svg'
import { menuOptions } from '@/components/header/constant';
import Tag from '@/components/tag/index'
import { Skeleton } from 'antd';
import CardDetail from '../cardDetail/index'
import s from './index.less'

interface SourceCardProps extends BaseSource { }

const SourceCard: React.FC<SourceCardProps> = ({
  resourceId, resourceName, resourceThumbUrl, resourceType, categoryName, tagInfoList,
}) => {
  const { searchKeyword } = useModelState('list')
  const containerRef = useRef<HTMLDivElement>()
  const cardDetailRef = useRef(null)

  // 查看详情
  const toDetail = () => {
    cardDetailRef.current.onShowDrawer(resourceId)
  }
  // 搜索关键字名称高亮
  const highlightName = () => {
    if (searchKeyword) {
      return resourceName.replace(searchKeyword, `<span class='${s['high-light']}'>${searchKeyword}</span>`)
    }
    return resourceName
  }

  return (
    <>
      <div
        className={s['source-card-root']}
        key={resourceId}
        onClick={toDetail}
      >
        <div
          ref={containerRef}
          className={s['img-box']}
        >
          <Image
            placeholder={
              <Skeleton.Image className={s['source-card-img-preview']} />
          }
            alt={resourceName}
            src={resourceThumbUrl}
          />
        </div>
        <div className={s['desc-box']}>
          <div className={s['desc-text-box']}>
            <div
              className={s['desc-title']}
              dangerouslySetInnerHTML={{
                __html: highlightName(),
              }}
            />
            <div className={s['desc-other']}>
              {menuOptions.find((m) => m.key === resourceType).title}
              {
              categoryName
              && (
              <span>
                {' '}
                /
                {' '}
                {categoryName}
              </span>
              )
            }
              {
              tagInfoList && tagInfoList.length > 0
              && tagInfoList.map((item) => <Tag key={item.tagId} tagName={item.tagName} />)
            }
            </div>
          </div>
          <div className={s['action-box']}>
            <img src={downloadSvg} alt="dowanload.png" />
          </div>
        </div>
      </div>
      <CardDetail ref={cardDetailRef} />
    </>
  )
};

export default SourceCard
