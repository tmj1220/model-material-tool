/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useRef } from 'react'
import Image from '@/components/image'
import downloadSvg from '@/assets/images/icons/download.svg'
import { menuOptions } from '@/components/header/constant';
import { getResourceDetail } from '@/services/list'
import CardDetail from '../cardDetail/index'
// import { typeToName } from '../constants'
import s from './index.less'

interface SourceCardProps extends BaseSource { }

const SourceCard: React.FC<SourceCardProps> = ({
  resourceId, resourceName, resourceThumbUrl, resourceType, categoryName,
}) => {
  const containerRef = useRef<HTMLDivElement>()
  const cardDetailRef = useRef(null)

  // 查看详情
  const toDetail = async () => {
    console.log(22);
    const res = await getResourceDetail(resourceId)
    cardDetailRef.current.onShowDrawer(res)
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
          <Image alt={resourceName} src={resourceThumbUrl} />
        </div>
        <div className={s['desc-box']}>
          <div className={s['desc-text-box']}>
            <div className={s['desc-title']}>{resourceName}</div>
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
              {/* {typeToName[type]}
            /
            {tags.map((i) => i.label).join(',')} */}
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
