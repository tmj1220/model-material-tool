import request from '@/utils/request'

// 获取材质分类
export async function getMaterialCategory() {
  return request('/resource/material/category');
}
// 根据资源类别查询资源列表
export async function getResource(params: IResourceParams) {
  return request('/resource', {
    method: 'GET',
    params,
  });
}
// 根据关键字查询资源列表
export async function getResourceByKeyword(params: IResourceParams) {
  return request('/resource/keyword', {
    method: 'GET',
    params,
  });
}
// 获取资源详情
export async function getResourceDetail(id: string) {
  return request(`/resource/detail/${id}`);
}
