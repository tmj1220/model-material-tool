import React, { useRef } from 'react'
import { Button } from 'antd'
import Image from '@/components/image'

import downloadSvg from '@/assets/images/icons/download.svg'
import { typeToName } from '../constants'
import s from './index.less'

interface SourceCardProps extends BaseSource{}

const SourceCard: React.FC<SourceCardProps> = ({
  id, name, tags, link, type,
}) => {
  const containerRef = useRef<HTMLDivElement>()

  return (
    <div className={s['source-card-root']} key={id}>
      <div
        ref={containerRef}
        className={s['img-box']}
      >
        <Image alt={name} src={link} />
      </div>
      <div className={s['desc-box']}>
        <div className={s['desc-text-box']}>
          <div className={s['desc-title']}>{name}</div>
          <div className={s['desc-other']}>
            {typeToName[type]}
            /
            {tags.map((i) => i.label).join(',')}
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
