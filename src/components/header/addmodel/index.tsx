import { addModel } from '@/services/addModel';
import {
  Button, Form, Input, message, Radio, Select, Spin,
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import AwesomeUpload from '@/components/BigFileUpload';
import { useEffect, useState } from 'react';
import { getMaterialCategory } from '@/services/list';
import DraggerUpload from './DraggerUpload';
import s from './index.less';
import TagInput from './TagInput';

const { Option } = Select;
interface Addmodelfrom {
  resourceCategoryId?: string;
  resourceDescription?: string;
  resourceName: string;
  resources: string[];
  resourceTagIds: string[];
  resourceType: number;
  thumb: Array<any>;
}
interface AddmodelFromProps {
  onAdd: Function;
}
interface ResourceCategory {
    categoryId: string
    categoryName: string
}
const Add = ({ onAdd }: AddmodelFromProps) => {
  const [loading, setloading] = useState<boolean>(false);
  const [resourceCategory, setResourceCategory] = useState<ResourceCategory[]>([]);
  const [fromData, setFromData] = useState<Addmodelfrom>(null)
  const onAddmodelFinish = async (values: Addmodelfrom) => {
    setloading(true);
    const sendData = {
      ...values,
      thumb: values.thumb[0]?.fileId,
    };
    try {
      await addModel(sendData);
      message.success('发布成功')
      onAdd();
      setloading(false);
    } catch (error) {
      setloading(false);
    }
  };
  useEffect(() => {
    getMaterialCategory().then((res) => {
      setResourceCategory(res)
    })
  }, [])

  return (
    <div className={s['upload-model']}>
      <Spin spinning={loading}>
        <Form
          onFinish={onAddmodelFinish}
          style={{ width: 332 }}
          layout="vertical"
          onValuesChange={(data, datas) => {
            console.log(datas)
            setFromData(datas)
          }}
        >
          <Form.Item
            label="类型"
            name="resourceType"
            rules={[{ required: true, message: '请选择类型' }]}
          >
            <Radio.Group>
              <Radio value={1}> 模型 </Radio>
              <Radio value={2}> 材质 </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="名称"
            name="resourceName"
            rules={[{ required: true }]}
          >
            <Input maxLength={20} placeholder="请输入" />
          </Form.Item>
          <Form.Item
            label="封面图"
            name="thumb"
            rules={[{ required: true, message: '请上传封面图' }]}
          >
            <DraggerUpload
              accept="image/jpg,image/png,image/gif,image/jpeg"
              size={20}
              tips="支持格式：jpg/png/gif"
            />
          </Form.Item>
          {
            (fromData?.resourceType === 2) && (
            <Form.Item
              label="材质分类"
              name="resourceCategoryId"
              rules={[{ required: true, message: '请选择分类' }]}
            >
              <Select placeholder="请选择分类">
                {
                resourceCategory.map((item) => (
                  <Option
                    key={item.categoryId}
                    value={item.categoryId}
                  >
                    {item.categoryName}
                  </Option>
                ))
              }
                <Option> </Option>
              </Select>
            </Form.Item>
            )
          }

          <Form.Item
            name="resourceTagIds"
            label="添加标签"
            rules={[{ required: true, message: '请选择标签' }]}
          >
            <TagInput />
          </Form.Item>
          <Form.Item
            name="resourceFiles"
            label="模型文件"
            rules={[{ required: true, message: '请上传文件' }]}
          >
            <AwesomeUpload uploadLimitInfo={{ max: 1000 * 1024 * 1024 }} />
          </Form.Item>
          <Form.Item label="描述" name="resourceDescription">
            <TextArea
              maxLength={200}
              placeholder="关于该设计资源的简要描述"
              rows={2}
            />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary" style={{ width: '100%' }}>
              发布
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};
export default Add;
