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

export interface Resources {
  resourceFileId: string;
  modelType: string;
  fileSize: number;
}
export interface Addmodelfrom {
  resourceId?: string;
  thumbUrl?: string;
  resourceCategoryId?: string;
  resourceDescription?: string;
  resourceName?: string;
  resourceFiles?: Resources[];
  resourceTagIds?: string[];
  resourceType?: number;
  thumb?: Array<any>;
}
interface AddmodelFromProps {
  onAdd: Function;
  initialValue?: Partial<Addmodelfrom>;
}
interface ResourceCategory {
  categoryId: string;
  categoryName: string;
}
const Add = ({ onAdd, initialValue = {} }: AddmodelFromProps) => {
  console.log(initialValue);
  const [loading, setloading] = useState<boolean>(false);
  const [resourceCategory, setResourceCategory] = useState<ResourceCategory[]>(
    [],
  );
  const [formData, setFormData] = useState<Addmodelfrom>(null);
  const onAddmodelFinish = async (values: Addmodelfrom) => {
    setloading(true);
    const sendData = {
      ...values,
      thumb: values.thumb[0]?.fileId,
      thumbRgb: values.thumb[0]?.thumbRgb,
      resourceId: initialValue?.resourceId,
    };
    try {
      await addModel(sendData);
      message.success(`${initialValue?.resourceId ? '修改成功' : '发布成功'}`);
      onAdd(formData?.resourceType);
      setloading(false);
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };
  const modelBeforeUploadCheck = (file, fileList) => {
    console.log(file);
    console.log(fileList);
    // 已有的数据
    const defalutType = formData?.resourceFiles?.map(
      (item) => item.modelType.toLocaleLowerCase(),
    ) || [];
    // 上传选的数据
    const uploadType = fileList?.map((item) => item?.name.substring(item?.name.lastIndexOf('.')).toLocaleLowerCase()) || [];

    const duplicates = [];

    const tempArray = [...defalutType, ...uploadType].sort();

    for (let i = 0; i < tempArray.length; i += 1) {
      if (tempArray[i + 1] === tempArray[i]) {
        duplicates.push(tempArray[i]);
      }
    }
    if (duplicates.length > 0) {
      message.error(`文件类型${duplicates[0]}重复`);

      return false;
    }

    return true;
  };
  useEffect(() => {
    setFormData(initialValue);
    getMaterialCategory().then((res) => {
      setResourceCategory(res);
    });
  }, []);

  return (
    <div className={s['upload-model']}>
      <Spin spinning={loading}>
        <Form
          initialValues={initialValue}
          onFinish={onAddmodelFinish}
          style={{ width: 332 }}
          layout="vertical"
          onValuesChange={(data, datas) => {
            console.log(datas);
            setFormData(datas);
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
          {(formData?.resourceType === 2
            || initialValue?.resourceType === 2) && (
            <Form.Item
              label="材质分类"
              name="resourceCategoryId"
              rules={[{ required: true, message: '请选择分类' }]}
            >
              <Select placeholder="请选择分类">
                {resourceCategory.map((item) => (
                  <Option key={item.categoryId} value={item.categoryId}>
                    {item.categoryName}
                  </Option>
                ))}
                <Option> </Option>
              </Select>
            </Form.Item>
          )}

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
            <AwesomeUpload
              beforeUploadCheck={modelBeforeUploadCheck}
              uploadLimitInfo={{
                max: 200 * 1024 * 1024,
                hintText: '单个文件最大上传200M',
              }}
            />
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
