import request from '@/utils/request';

// 获取用户信息
export async function getUserInfoService() {
  return request('/user/current/name');
}
// 登录
export async function login(data) {
  return request('/auth', {
    method: 'POST',
    data,
  });
}
// 退出
export async function logout() {
  return request('/auth/token/logout', {
    method: 'DELETE',
  });
}
