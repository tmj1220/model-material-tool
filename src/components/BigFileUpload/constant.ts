import type{ Accept } from './index.d'

export const EXTENSION_TO_MIME_TYPE_MAP = {
  // avi: 'video/avi',
  // gif: 'image/gif',
  // ico: 'image/x-icon',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  // mkv: 'video/x-matroska',
  // mov: 'video/quicktime',
  mp4: 'video/mp4',
  mp3: 'audio/mpeg',
  // pdf: 'application/pdf',
  png: 'image/png',
  // zip: 'application/zip'
  gltf:'application/zip'
}
export const MODE_TYPE  = {
  gltf:'.gltf',
  glb:'.glb',
  fbx:'.fbx',
  mb:'.mb'
}
export const DEFAULT_CONCURRENT_QUANTITY = 3
export const DEFAULT_CHUNK_SIZE = 20 * 1024 * 1024
export const DEFAULT_CALCULATE_HASH_MODE = 'all'
export const DEFAULT_CHECK_FILE_URL = '/file/large/init'
export const DEFAULT_UPLOAD_FILE_URL = '/file/large/upload'
export const DEFAULT_MERGE_FILE_URL = '/file/large/merge'
export const DEFAULT_NEED_CHECK_IMG_RATIO = true
export const DEFAULT_NEED_SORT = false
export const DEFAULT_IMG_RATIO = 16 / 9
export const DEFAULT_LIMIT = 8
export const DEFAULT_ACCEPTS: Accept[] = ['.gltf', '.glb','.fbx','.mb','.c4d', '.obj', '.max', '.blend', '.zip']//'.zip'
export const UNITY_ACCEPTS: Accept[] = ['.unitypackage']
