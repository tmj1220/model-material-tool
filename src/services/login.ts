import request from '@/utils/request'
import { UPMS_SUFFIX } from './constant'

export async function login(params) {
  const APP_KEY = 'app';
  return request('/auth/oauth/token', {
    method: 'POST',
    params,
    headers: {
      Authorization: `Basic ${btoa(`${APP_KEY}:`)} `,
    },
  })
}

// 文件上传
export async function uploadFile(
  formData: FormData,
  // eslint-disable-next-line no-unused-vars
  onUploadProgress?: (progressEvent: any) => void,
) {
  return request(`${UPMS_SUFFIX}/common/xxx`, {
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: formData,
    onUploadProgress,
  });
}
