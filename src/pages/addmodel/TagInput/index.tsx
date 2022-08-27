import { Input, Select, Spin } from 'antd';
import type { InputRef } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { addTag, getTags } from '@/services/addModel';
import CloseSvg from '@/assets/images/anticons/close.svg';
import Icon from '@ant-design/icons';
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
  const onAddTag = async (data) => {
    if (data) {
      await addTag([{ tagName: data }]);
      getTagsServer()
    }
  }
  const checkedData = (id:string) => {
    console.log(id)
    const data = Array.from(new Set([...value, id]));
    onChange(data)
  }
  useEffect(() => {
    getTagsServer()
  }, [])

  return (
    <Select
      value={value}
      showSearch={false}
      mode="multiple"
      placeholder="请选择"
      tagRender={(props) => (
        <div
          className={s['tag-input-box']}
        >
          {props.label}
          <Icon className={s['tag-delet-icon']} component={CloseSvg} />
        </div>
      )}
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
