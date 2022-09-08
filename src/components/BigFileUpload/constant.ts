/*
 * @Author: like 465420404@qq.com
 * @Date: 2022-09-06 18:02:22
 * @LastEditors: like 465420404@qq.com
 * @LastEditTime: 2022-09-07 22:00:57
 * @FilePath: /model-material-tool/src/components/BigFileUpload/constant.ts
 * @Description:
 *
 * Copyright (c) 2022 by like 465420404@qq.com, All Rights Reserved.
 */
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
}

export const DEFAULT_CONCURRENT_QUANTITY = 3
export const DEFAULT_CHUNK_SIZE = 5 * 1024 * 1024
export const DEFAULT_CALCULATE_HASH_MODE = 'bulon'
export const DEFAULT_CHECK_FILE_URL = '/file/large/init'
export const DEFAULT_UPLOAD_FILE_URL = '/file/large/upload'
export const DEFAULT_MERGE_FILE_URL = '/file/large/merge'
export const DEFAULT_NEED_CHECK_IMG_RATIO = true
export const DEFAULT_NEED_SORT = true
export const DEFAULT_IMG_RATIO = 16 / 9
export const DEFAULT_LIMIT = 5
export const DEFAULT_ACCEPTS: Accept[] = ['.zip', '.gltf', '.glb']
