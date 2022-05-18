import React, { useEffect } from 'react'
import { Image, Button } from 'antd'
import downloadSvg from '@/assets/images/icons/download.svg'
import { typeToName } from '../constants'
import s from './index.less'

interface SourceCardProps extends BaseSource{}

const SourceCard: React.FC<SourceCardProps> = ({
  id, name, tags, link, type,
}) => {
  useEffect(() => {}, [])
  return (
    <div className={s['source-card-root']} key={id}>
      <div className={s['img-box']}>
        <Image preview={false} alt={name} src={link} width={332} />
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
