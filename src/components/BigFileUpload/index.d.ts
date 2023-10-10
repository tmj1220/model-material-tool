/*
 * @Author: like 465420404@qq.com
 * @Date: 2022-09-06 18:02:22
 * @LastEditors: mingjian.tang mingjian.tang@rokid.com
 * @LastEditTime: 2023-10-09 17:14:01
 * @FilePath: /model-material-tool/src/components/BigFileUpload/index.d.ts
 * @Description:
 *
 * Copyright (c) 2022 by like 465420404@qq.com, All Rights Reserved.
 */
/* eslint-disable max-len */
/**
 * calculating 计算hash中
 * checking 查询文件历史上传记录
 * waiting 等待上传
 * uploading 上传中
 * merging 合并中
 * uploaded 该文件已上传（上传成功）
 * error 出错了（上传失败）
 */
export type Status =
  | 'calculating'
  | 'checking'
  | 'waiting'
  | 'uploading'
  | 'merging'
  | 'uploaded'
  | 'error';

/**
 * 上传服务提供的上传文件的文件类型 （value的类型）
 */
export interface OssFile {
  fileId: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  fileUrl: string;
  fileCode: string;
}

/**
 * 大文件上传组件需要的文件类型（上传组件内部使用的类型）
 */
export interface RCFile extends File {
  uid: string;
  name: string;
  url: string;
  ossFile?: OssFile;
  previewUrl?: string;
  status: Status;
  percent?: number;
  modelType?:string;
  [prop: string]: any;
}
export interface ModelResourceFile{
  resourceFileId:string;
  modelType:string;
}
export interface Requests {
  [prop: string]: { abort: Function };
}

export type FileChangeType = 'success' | 'sort' | 'remove' | 'error';

export type Accept =
  | '.avi'
  | '.mp4'
  | '.mp3'
  | '.mkv'
  | '.mov'
  | '.jpeg'
  | '.jpg'
  | '.png'
  | '.gltf'
  | '.glb'
  | '.zip'
  | '.c4d'
  | '.fbx'
  | '.mb'
  | '.obj'
  | '.max'
  | '.blend'
  | '.unitypackage'

export interface Info {
  width?: number;
  height?: number;
  url?: string;
}

/**
 * all 全量计算文件hash （速度慢，但是能基于当前文件准确的计算出唯一的hash。 ）
 * bulon 基于布隆过滤器 计算文件hash（速度快、有概率出现计算失误。适合不会频繁变动的文件）
 * 默认使用 bulon
 */
export type CalculateHashMode = 'all' | 'bulon';

export interface UploadedChunkInfo {
  fileId: string;
  fragmentSequence: number;
  fragmentTag: string;
  uploadId: string;
}

export interface CheckFileResponse {
  fileId: string; // 文件id
  uploadedFragments: UploadedChunkInfo[];
  uploadId: string; // 上传id
}

type BuildPowersOf2LengthArrays<
  N extends number,
  R extends never[][]
> = R[0][N] extends never
  ? R
  : BuildPowersOf2LengthArrays<N, [[...R[0], ...R[0]], ...R]>;

type ConcatLargestUntilDone<
  N extends number,
  R extends never[][],
  B extends never[]
> = B['length'] extends N
  ? B
  : [...R[0], ...B][N] extends never
  ? ConcatLargestUntilDone<
      N,
      R extends [R[0], ...infer U] ? (U extends never[][] ? U : never) : never,
      B
    >
  : ConcatLargestUntilDone<
      N,
      R extends [R[0], ...infer U] ? (U extends never[][] ? U : never) : never,
      [...R[0], ...B]
    >;

// eslint-disable-next-line no-unused-vars
type Replace<R extends any[], T> = { [K in keyof R]: T };

type TupleOf<T, N extends number> = number extends N
  ? T[]
  : {
      [K in N]: BuildPowersOf2LengthArrays<K, [[never]]> extends infer U
        ? U extends never[][]
          ? Replace<ConcatLargestUntilDone<K, U, []>, T>
          : never
        : never;
    }[N];

type RangeOf<N extends number> = Partial<TupleOf<unknown, N>>['length'];

export type RangeOf2<From extends number, To extends number> =
  | Exclude<RangeOf<To>, RangeOf<From>>
  | From;
