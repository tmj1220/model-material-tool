import { addModel } from '@/services/addModel';
import {
  Button, Form, Input, message, Radio, Spin,
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import AwesomeUpload from '@/components/BigFileUpload';
import { useState } from 'react';
import DraggerUpload from './DraggerUpload';
import s from './index.less';
import TagInput from './TagInput';

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
const Add = ({ onAdd }: AddmodelFromProps) => {
  const [loading, setloading] = useState<boolean>(false);
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
  return (
    <div className={s['upload-model']}>
      <Spin spinning={loading}>
        <Form
          onFinish={onAddmodelFinish}
          style={{ width: 332 }}
          layout="vertical"
          onValuesChange={(data) => {
            console.log(data);
          }}
        >
          <Form.Item
            label="类型"
            name="resourceType"
            rules={[{ required: true, message: '请选择类型' }]}
          >
            <Radio.Group>
              <Radio value="1"> 模型 </Radio>
              <Radio value="2"> 材质 </Radio>
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
            rules={[{ required: true, message: '请上传模型文件' }]}
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
