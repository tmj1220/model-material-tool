/*
 * @Author: like 465420404@qq.com
 * @Date: 2022-09-08 12:37:09
 * @LastEditors: like 465420404@qq.com
 * @LastEditTime: 2022-09-08 12:39:31
 * @FilePath: /model-material-tool/src/components/ModelViewer/constant.ts
 * @Description:
 *
 * Copyright (c) 2022 by like 465420404@qq.com, All Rights Reserved.
 */
export const environments = [
  {
    id: '',
    name: 'None',
    path: null,
    format: '.hdr',
  },
  {
    id: 'venice-sunset',
    name: 'Venice Sunset',
    path: '/public/environment/venice_sunset_1k.hdr',
    format: '.hdr',
  },
  {
    id: 'footprint-court',
    name: 'Footprint Court (HDR Labs)',
    path: '/public/environment/footprint_court_2k.hdr',
    format: '.hdr',
  },
];
function isIOS() {
  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod',
  ].includes(navigator.platform)
    // iPad on iOS 13 detection
    || (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
}
export const IS_IOS = isIOS();
export const DEFAULT_CAMERA = '[default]'
export const Preset = { ASSET_GENERATOR: 'assetgenerator' };
// glTF texture types. `envMap` is deliberately omitted, as it's used internally
// by the loader but not part of the glTF format.
export const MAP_NAMES = [
  'map',
  'aoMap',
  'emissiveMap',
  'glossinessMap',
  'metalnessMap',
  'normalMap',
  'roughnessMap',
  'specularMap',
];
//  /armaz/v1/project/uploadResourceInfo
export const DEFAULT_ACTION = '/file/v1/file/upload'
export const AMBIENTINTENSITY = 0.3
export const AMBIENTCOLOR = 0xFFFFFF
export const DIRECTINTENSITY = 0.8 * Math.PI// TODO(#116)
export const DIRECTCOLOR = 0xFFFFFF
export const EXPORSURE = 1.0
export const BACKGROUND = false
export const BGCOLOR1 = '#ffffff'
export const BGCOLOR2 = '#f10e0e'
export const BASE_ASPECT = 16 / 9
export const CANVAS_WIDTH = 500
export const CANVAS_HEIGHT = 281.24
export const TIME_LEN = 400
