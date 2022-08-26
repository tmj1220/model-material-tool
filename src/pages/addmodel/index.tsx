import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  Radio,
  Select,
  Upload,
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import s from './index.less';

const Add = () => (
  <div className={s['upload-model']}>
    <Form
      style={{ width: 332 }}
      layout="vertical"
      onValuesChange={() => {}}
    >
      <Form.Item
        label="类型"
        name="resourceName"
        rules={[
          { required: true },
        ]}
      >
        <Radio.Group>
          <Radio value="apple"> 模型 </Radio>
          <Radio value="pear"> 材质 </Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="名称">
        <Input />
      </Form.Item>
      <Form.Item label="封面图" valuePropName="fileList">
        <Upload
          showUploadList={false}
          action="/upload.do"
          listType="picture-card"
        >
          <div className="">
            <img alt="avatar" style={{ width: '100%' }} />
          </div>
        </Upload>
      </Form.Item>
      <Form.Item label="描述">
        <TextArea rows={2} />
      </Form.Item>
      <Form.Item label="添加标签">
        <Select>
          <Select.Option value="demo">Demo</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="Upload" valuePropName="fileList">
        <Upload action="/upload.do" listType="picture-card">
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button type="primary" style={{ width: '100%' }}>Button</Button>
      </Form.Item>
    </Form>
  </div>
);

export default Add;
