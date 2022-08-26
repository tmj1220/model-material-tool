import React, { useRef } from 'react'
import { Button } from 'antd'
import Image from '@/components/image'

import downloadSvg from '@/assets/images/icons/download.svg'
import { menuOptions } from '@/components/header/constant';
// import { typeToName } from '../constants'
import s from './index.less'

interface SourceCardProps extends BaseSource{}

const SourceCard: React.FC<SourceCardProps> = ({
  resourceId, resourceName, resourceThumbUrl, resourceType,
}) => {
  const containerRef = useRef<HTMLDivElement>()

  return (
    <div className={s['source-card-root']} key={resourceId}>
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
            {/* {typeToName[type]}
            /
            {tags.map((i) => i.label).join(',')} */}
          </div>
        </div>
        <div className={s['action-box']}>
          <Button><img src={downloadSvg} alt="dowanload.png" /></Button>
        </div>
      </div>
    </div>
  )
};

export default SourceCard
