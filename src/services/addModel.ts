import request from '@/utils/request'

// 获取材质分类
export async function getMaterialCategory() {
  return request('/resource');
}
// 获取标签分类
export async function getTags() {
  return request('/resource/tag');
}
// 新增标签
export async function addTag(data) {
  return request('/resource/tag', {
    method: 'POST',
    data,
  });
}
