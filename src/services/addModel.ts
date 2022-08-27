import request from '@/utils/request'

// 获取材质分类
export async function getMaterialCategory() {
  return request('/resource');
}
