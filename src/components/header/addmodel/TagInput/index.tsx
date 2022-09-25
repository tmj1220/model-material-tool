import { Input, Select, Spin } from 'antd';
import type { InputRef } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { addTag, getTags } from '@/services/addModel';
import CloseSvg from '@/assets/images/anticons/close.svg';
import Icon from '@ant-design/icons';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import s from './index.less';

interface TagType{
  tagId: string
  tagName: string
  tagType: 0 |1
}
interface TagInputProps{
  value?: string[];
  onChange?: (value: string[]) => void;
}
const index: React.FC<TagInputProps> = ({ value = [], onChange }) => {
  const [name, setName] = useState('');
  const inputRef = useRef<InputRef>(null);
  const [tagsValue, setTagsValue] = useState<TagType[]>([])
  const [loading, setloading] = useState<boolean>(false)
  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  // 获取新标签
  const getTagsServer = async () => {
    setloading(true);
    try {
      const tagsData = await getTags()
      setTagsValue(tagsData)
      setloading(false);
    } catch (error) {
      setloading(false);
    }
  }
  /**
   * @description: 添加标签
   * @param {*} data 新增输入的值
   * @return {*}
   */
  const onAddTag = async (data:string) => {
    if (data.replace(/^\s*|\s*$/g, '').length > 0) {
      setloading(true);
      const resData:TagType[] = await addTag([{ tagName: data }]);
      if (resData.length > 0) {
        setloading(false);
        onChange([...value, resData[0]?.tagId]);
        setName('');
        setTagsValue([...tagsValue, resData[0]])
      }
    }
  }
  // 改变选中数据
  const checkedData = (id:string) => {
    if (value.includes(id)) {
      onChange(value.filter((item) => item !== id))
    } else {
      onChange([...value, id])
    }
  }
  // 失焦清空输入框
  const onDropdownVisibleChange = (open:boolean) => {
    if (!open) {
      setName('')
    }
  }
  // 输入框删除tag
  const onDeletTag = (id) => {
    onChange(value.filter((item) => item !== id))
  }
  useEffect(() => {
    getTagsServer()
  }, [])

  return (
    <Select
      value={value}
      showSearch={false}
      onDeselect={onDeletTag}
      onDropdownVisibleChange={onDropdownVisibleChange}
      mode="multiple"
      placeholder="请选择"
      tagRender={(props:CustomTagProps) => {
        console.log(props)
        const {
          label, onClose,
        } = props;
        const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
          event.preventDefault();
          event.stopPropagation();
        };
        return (
          <div
            onMouseDown={onPreventMouseDown}
            className={s['tag-input-box']}
          >
            {label}
            <Icon onClick={onClose} className={s['tag-delet-icon']} component={CloseSvg} />
          </div>
        )
      }}
      options={tagsValue.map((item) => (
        {
          label: item.tagName,
          value: item.tagId,
        }
      ))}
      dropdownRender={() => (
        <Spin spinning={loading}>
          <div className={s['tags-box']}>
            <Input
              maxLength={5}
              style={{ height: 36, width: '100%' }}
              placeholder="新建标签"
              ref={inputRef}
              value={name}
              onChange={onNameChange}
              onPressEnter={(e:any) => {
                onAddTag(e.target.value)
              }}
            />
            <div>
              <p className={s['tag-title']}>建议标签</p>
              <div className={s['tag-item-box']}>
                {
                  tagsValue.filter((item) => item.tagType === 0)
                    .map((item) => (
                      <div
                        onClick={() => {
                          checkedData(item.tagId)
                        }}
                        className={s['tag-item']}
                        style={{ border: `1px solid ${value.includes(item.tagId) ? '#0065FF' : 'transparent'}` }}
                        key={item.tagId}
                      >
                        {item.tagName}
                      </div>
                    ))
                }
              </div>
              <p className={s['tag-title']}>全部标签</p>
              <div className={s['tag-item-box']}>
                {
                  tagsValue.map((item) => (
                    <div
                      className={s['tag-item']}
                      style={{ border: `1px solid ${value.includes(item.tagId) ? '#0065FF' : 'transparent'}` }}
                      onClick={() => {
                        checkedData(item.tagId)
                      }}
                      key={item.tagId}
                    >
                      {item.tagName}
                    </div>
                  ))
                }
              </div>
            </div>
          </div>

        </Spin>

      )}
    />
  );
};

export default index;
