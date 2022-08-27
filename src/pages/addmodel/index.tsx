import {
  Button,
  Form,
  Input,
  Radio,
  Select,
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import DraggerUpload from './DraggerUpload';
import s from './index.less'

export interface Addmodelfrom {
  resourceCategoryId?: string;
  resourceDescription?: string;
  resourceName: string;
  resources: string[];
  resourceTagIds: string[];
  resourceType: number;
  thumb: string;
}
const Add = () => {
  const onAddmodelFinish = (values: Addmodelfrom) => {
    console.log('Success:', values);
  };
  return (
    <div className={s['upload-model']}>
      <Form
        onFinish={onAddmodelFinish}
        style={{ width: 332 }}
        layout="vertical"
        onValuesChange={(data) => { console.log(data) }}
      >
        <Form.Item
          label="类型"
          name="resourceType"
          rules={[
            { required: true, message: '请选择类型' },
          ]}
        >
          <Radio.Group>
            <Radio value="apple"> 模型 </Radio>
            <Radio value="pear"> 材质 </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="名称"
          name="resourceName"
          rules={[
            { required: true },
          ]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          label="封面图"
          name="thumb"
          rules={[
            { required: true, message: '请上传封面图' },
          ]}
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
          rules={[
            { required: true, message: '请选择标签' },
          ]}
        >
          <Select placeholder="请选择">
            <Select.Option value="demo">Demo</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="resources"
          label="模型文件"
          // rules={[
          //   { required: true, message: '请上传模型文件' },
          // ]}
        >
          <DraggerUpload
            accept="image/jpg,image/png,image/gif,image/jpeg"
            size={20}
            tips="（单张图片20MB以内，支持上传jpg\png\gif格式）"
          />
        </Form.Item>
        <Form.Item label="描述">
          <TextArea placeholder="关于该设计资源的简要描述" rows={2} />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary" style={{ width: '100%' }}>发布</Button>
        </Form.Item>
      </Form>
    </div>
  );
}
export default Add;
