/* eslint-disable react/no-array-index-key */
import React from 'react';
import classnames from 'classnames';
import { Popover } from 'antd'
import { useModelState } from '@/store'
import Icon from '@ant-design/icons';
import filterSvg from '@/assets/images/anticons/filter.svg'
import { formatTypes, exhibitionTypes } from '@/utils/constant'
import Styles from './fileterBox.less'

interface IProps {
  categoryName: string
  onSelectValue: (payload) => void
}

const Index: React.FC<IProps> = ({ categoryName, onSelectValue }) => {
  const { requestParams } = useModelState('list')
  const formatBox = () => (
    <div className={Styles['filter-box']}>
      <div className={Styles.title}>格式</div>
      <div className={Styles['btn-box']}>
        {formatTypes.map((v, i) => (
          <span
            className={classnames(Styles.btn, requestParams.format === v.name ? Styles['active-btn'] : '')}
            key={i}
            onClick={() => onSelectValue({
              format: requestParams.format === v.name ? null : v.name,
            })}
          >
            {v.name}
          </span>
        ))}
      </div>
    </div>
  )
  const exhibitionBox = () => (
    <div className={Styles['filter-box']}>
      <div className={Styles.title}>POI 类型</div>
      <div className={Styles['btn-box']}>
        {exhibitionTypes.map((v, i) => (
          <span
            className={classnames(Styles.btn, requestParams.resourcePoiType === v.name ? Styles['active-btn'] : '')}
            key={i}
            onClick={() => onSelectValue({
              resourcePoiType: requestParams.resourcePoiType === v.name ? null : v.name,
            })}
          >
            {v.name}
          </span>
        ))}
      </div>
    </div>
  )
  const content = () => (
    <div style={{ width: 240 }}>
      {(categoryName === '全部' || categoryName === '模型') && formatBox()}
      {(categoryName === '全部' || categoryName === '展厅POI') && exhibitionBox()}
    </div>
  )
  const disabled = categoryName === '粒子' || categoryName === '着色器'
  return (
    <Popover placement="bottomRight" content={disabled ? null : content} trigger="click">
      <div className={Styles.box} style={disabled ? { cursor: 'not-allowed', color: 'rgb(0 0 0 / 50%)' } : null}>
        <span>筛选</span>
        <Icon style={{ fontSize: 16 }} component={filterSvg} />
      </div>
    </Popover>
  )
}
export default Index
