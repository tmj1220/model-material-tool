import request from '@/utils/request'
import { UPMS_SUFFIX } from './constant'

// 获取材质分类
export async function getMaterialCategory() {
  return request(`${UPMS_SUFFIX}/resource/material/category`);
}
