import { addModel } from '@/services/addModel';
import {
  Button, Form, Input, message, Radio, Spin, Select,
} from 'antd';
import { useModelState } from '@/store';
import TextArea from 'antd/lib/input/TextArea';
import AwesomeUpload from '@/components/BigFileUpload';
import { useEffect, useState, useRef } from 'react';
import { getMaterialCategory } from '@/services/list';
import { exhibitionTypes, menuOptions } from '@/utils/constant';
import * as constants from '@/components/BigFileUpload/constant';
import { isArray } from 'lodash';
import DraggerUpload from './DraggerUpload';
import s from './index.less';
import TagInput from './TagInput';

const { Option } = Select

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
  resourceType?: string;
  thumb?: Array<any>;
  resourceSn?: string
  resourcePoiType?: string
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
  const { curCategory } = useModelState('list');
  const uploadRef = useRef(null)
  const [form] = Form.useForm();
  const currResourceType = Form.useWatch('resourceCategoryId', form);
  const currResourcePoiType = Form.useWatch('resourcePoiType', form);
  const [loading, setloading] = useState<boolean>(false);
  const [resourceCategory, setResourceCategory] = useState<ResourceCategory[]>([]);
  const [formData, setFormData] = useState<Addmodelfrom>(null);
  const exhibitionItem = resourceCategory.find((v) => v.categoryName === '展厅POI')
  const onAddmodelFinish = async (values: Addmodelfrom) => {
    setloading(true);
    let sendData = {
      ...values,
      thumb: values.thumb[0]?.fileId,
      thumbRgb: values.thumb[0]?.thumbRgb,
      resourceId: initialValue?.resourceId,
      resourceType: menuOptions[0].key,
      resourceFiles: isArray(values.resourceFiles) ? values.resourceFiles : [values.resourceFiles],
    };
    if (values.resourcePoiType) {
      const prefix = exhibitionTypes.find((v) => v.name === values.resourcePoiType)?.prefix
      sendData = {
        ...sendData,
        resourceSn: `${prefix}${values.resourceSn}`,
      }
    }
    try {
      await addModel(sendData);
      message.success(`${initialValue?.resourceId ? '修改成功' : '发布成功'}`);
      onAdd(curCategory);
      setloading(false);
    } catch (error) {
      setloading(false);
    }
  };
  const modelBeforeUploadCheck = (file, fileList) => {
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
  /** 编号失焦数据变化 */
  const handleInputBlur = () => {
    const resourceSn = formData?.resourceSn
    if (resourceSn && resourceSn.length < 4) {
      const num = 4 - resourceSn.length
      let prefix = ''
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < num; i++) {
        prefix += '0'
      }
      form.setFieldsValue({ resourceSn: `${prefix}${resourceSn}` })
    }
  }
  /** 根据类型变化重置上传文件 */
  const resetFile = (e) => {
    if (formData?.resourceFiles) {
      const files = isArray(formData?.resourceFiles)
        ? [...formData.resourceFiles] : [formData.resourceFiles]
      console.log(files);
      /** 切换至模型类型,如果上传文件不在模型支持类型中，则重置 */
      if (e.target.value === resourceCategory[0]?.categoryId) {
        if (!constants.DEFAULT_ACCEPTS.includes(files[0]?.modelType as any)) {
          uploadRef?.current?.reset()
        }
      /** 切换至模型以外类型,如果上传文件不是unity类型，则重置 */
      } else if (!constants.UNITY_ACCEPTS.includes(files[0]?.modelType as any)) {
        uploadRef?.current?.reset()
      }
    }
  }
  useEffect(() => {
    setFormData(initialValue);
    getMaterialCategory().then((res) => {
      setResourceCategory(res);
      /** 新增资产默认设置类型选择第一个 */
      if (!initialValue) {
        form.setFieldsValue({ resourceCategoryId: res[0].categoryId })
      } else {
        form.setFieldsValue({
          resourcePoiType: initialValue?.resourcePoiType,
          resourceSn: initialValue?.resourceSn.slice(-4),
        })
      }
    });
  }, []);
  /** 监听类型变化 */
  useEffect(() => {
    if (currResourceType && currResourceType === exhibitionItem?.categoryId) {
      form.setFieldsValue({ resourcePoiType: exhibitionTypes[0].name })
    } else {
      form.setFieldsValue({ resourcePoiType: null, resourceSn: null })
    }
  }, [currResourceType])

  return (
    <div className={s['upload-model']}>
      <Spin spinning={loading}>
        <Form
          form={form}
          initialValues={initialValue}
          onFinish={onAddmodelFinish}
          style={{ width: 332 }}
          layout="vertical"
          onValuesChange={(_, datas) => {
            setFormData(datas);
          }}
        >
          <Form.Item
            label="类型"
            name="resourceCategoryId"
            rules={[{ required: true, message: '请选择类型' }]}
          >
            <Radio.Group onChange={resetFile}>
              {
                resourceCategory.map((v) => (
                  <Radio key={v.categoryId} value={v.categoryId}>
                    {' '}
                    {v.categoryName}
                    {' '}
                  </Radio>
                ))
              }
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="resourceFiles"
            label="上传文件"
            rules={[{ required: true, message: '请上传文件' }]}
          >
            <AwesomeUpload
              ref={uploadRef}
              accepts={currResourceType === resourceCategory[0]?.categoryId
                ? constants.DEFAULT_ACCEPTS : constants.UNITY_ACCEPTS}
              limit={currResourceType === resourceCategory[0]?.categoryId
                ? constants.DEFAULT_LIMIT : 1}
              beforeUploadCheck={modelBeforeUploadCheck}
              uploadLimitInfo={{
                max: 200 * 1024 * 1024,
                hintText: '单个文件最大上传200M',
              }}
            />
          </Form.Item>
          <Form.Item
            label="名称"
            name="resourceName"
            rules={[{ required: true }]}
          >
            <Input maxLength={20} placeholder="请输入" />
          </Form.Item>
          {/* 展厅POI 特殊显示 */}
          {(formData?.resourceCategoryId === exhibitionItem?.categoryId) && (
          <>
            <Form.Item
              label="展厅 POI 类型"
              name="resourcePoiType"
              rules={[{ required: true, message: '请选择展厅 POI 类型' }]}
            >
              <Select placeholder="请选择展厅 POI 类型">
                {exhibitionTypes.map((item) => (
                  <Option key={item.prefix} value={item.name}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="编号"
              name="resourceSn"
              rules={[
                {
                  required: true,
                  message: '请输入编号',
                },
                {
                  validator(rule, value) {
                    const pattern = /^\d+$/;
                    if (pattern.test(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('请输入数字！'));
                  },
                },
              ]}
            >
              <Input
                maxLength={4}
                onBlur={handleInputBlur}
                style={{ width: '100%' }}
                addonBefore={exhibitionTypes.find((v) => v.name === currResourcePoiType)?.prefix}
                placeholder="请输入编号"
              />
            </Form.Item>
          </>
          )}
          <Form.Item
            name="resourceTagIds"
            label="添加标签"
            rules={[{ required: true, message: '请选择标签' }]}
          >
            <TagInput />
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
