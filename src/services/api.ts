import request from '@/utils/request';
import { UPMS_SUFFIX } from './constant'

// 获取用户信息
export async function getInfo() {
  return request(`${UPMS_SUFFIX}/getInfo`);
}
// 获取菜单
export async function getRouters() {
  return request(`${UPMS_SUFFIX}/getRouters`);
}

export async function login(params) {
  const APP_KEY = 'app';
  return request('/auth/oauth/token', {
    method: 'POST',
    data: { ...params, appKey: APP_KEY },
    headers: {
      Authorization: `Basic ${btoa(`${APP_KEY}:`)} `,
    },
  });
}

export async function logout() {
  return request('/auth/token/logout', {
    method: 'DELETE',
  });
}

// 文件上传
export async function uploadFile(
  formData: FormData,
  // eslint-disable-next-line no-unused-vars
  onUploadProgress?: (progressEvent: any) => void,
) {
  return request(`${UPMS_SUFFIX}/common/minoUpload`, {
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: formData,
    onUploadProgress,
  });
}

export async function updatePwd(params) {
  return request(`${UPMS_SUFFIX}/updateLoginPwd`, {
    method: 'POST',
    data: params,
  });
}

// 强密码修改
export function updatePwdStrong(params) {
  return request(`${UPMS_SUFFIX}/updateLoginPwdStrong`, {
    method: 'POST',
    data: params,
  });
}

// 密码强度查询
export function checkPasswordStrong(params) {
  return request(`${UPMS_SUFFIX}/checkPasswordStrong`, {
    method: 'POST',
    data: params,
  })
}

// 获取验证码
export function getCodeImg() {
  return request(`${UPMS_SUFFIX}/captchaImage`, {
    method: 'get',
  });
}

// 获取注册码
export function getRegisterCode() {
  return request(`${UPMS_SUFFIX}/getRegisterCode`);
}

// 更新注册码
export function updateRegisterCode(params) {
  return request(`${UPMS_SUFFIX}/updateRegisterCode`, {
    method: 'post',
    data: params,
  });
}

// 获取公司的配置信息
export function getCompanyInfo(params: any) {
  return request(`${UPMS_SUFFIX}/system/defConfig/selectDefSysConfigMap`, {
    method: 'POST',
    data: params,
  });
}
// 获取默认公司的code
export function getDefaultCompanyIndex() {
  return request(`${UPMS_SUFFIX}/getDefaultCompanyIndex`, {
    method: 'GET',
  });
}

// 获取设备总数和在线状态
export function getDeviceTotalCountAndOnlineCount() {
  return request(`${UPMS_SUFFIX}/getDeviceTotalCountAndOnlineCount`, {
    method: 'GET',
  });
}

// 获取眼镜概况
export function getGlassData() {
  return request(`${UPMS_SUFFIX}/getGlassData`);
}

// 获取登录列表
export function getLoginList() {
  return request(`${UPMS_SUFFIX}/getLoginList`);
}

// 获取部门树
export function getDeptTree() {
  return request(`${UPMS_SUFFIX}/system/dept/treeselect`);
  // return request('/system/dept/selectUserUnitTree');
}

// 获取全部岗位
export function getPostList() {
  return request(`${UPMS_SUFFIX}/system/post/listAll`);
}

export function getDict(dictName: string) {
  return request(`${UPMS_SUFFIX}/system/dict/data/dictType/${dictName}`)
}

// 获取部门人员树
export async function getDeptsUsersTree() {
  return request(`${UPMS_SUFFIX}/system/dept/selectCompanyUnitUserTree`)
}

// 自定义文件上传
export async function uploadFileCustom(
  url: string,
  formData: FormData,
  // eslint-disable-next-line no-unused-vars
  onUploadProgress?: (progressEvent: any) => void,
) {
  return request(url, {
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: formData,
    onUploadProgress,
  });
}
