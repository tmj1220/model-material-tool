### CoreUpload

##### 大文件上传组件（核心组件）
该组件不包含样式 只提供大文件 分片上传、断点续传、失败重试等核心功能

## API

| 参数              | 说明                                                           | 是否必填 | 类型                                          | 默认值                  |
| ----------------- | -------------------------------------------------------------- | -------- | --------------------------------------------- | ----------------------- |
| request           | 请求工具函数                                                   | 是       | (url:string,options:Record<string,any>)=>void | -        |
| concurrentQuantity          | 并发上传的分片文件个数                                        |    是       | number                                   |   -       |
| chunkSize        | 分片文件大小                                                   |   是       | number                                     | -         |
| calculateHashMode          | 计算文件hash的方式    全量：all 布隆过滤器：bulon       |     是     | 'all'\|'bulon'                                |  -|
| checkFileUrl      | 校验文件历史上传记录的请求地址                                  |     是     | string                                        |  -   |
| uploadFileUrl      | 上传分片文件的请求地址                                  |     是     | string                                        |     -|
| mergeFileUrl      | 请求合并分片文件的请求地址                                  |     是     | string                                        |   -  |
| accepts      | 允许上传文件的后缀集合                                         |     是     | string[]                                      | -         |
| beforeUpload | 上传前的勾子函数 用来自定义校验规则来确定哪些文件可以被上传以及何时被上传   | 是 | (file: RCFile, files: RCFile[]) => boolean \| Promise\<boolean\> | - |
| getFileItem      | 获取当前文件在外部的信息的回调函数                          |     是     | (file: RCFile) => RCFile \| undefined  | -         |
| updateFileStatus  | 更新当前文件在外部的信息的回调函数                          |     是     | (file:RCFile, propTypes:Partial<RCFile>)=>void | -         |
| onFileChange      | 文件状态变化时的回调函数                          |     是     | (type: FileChangeType, file?: RCFile)=>void | -         |


### AwesomeUpload

##### 通用大文件上传组件（标准表单控件）

该组件基于CoreUpload 增加了样式、默认值、以及一下功能：
1、拖拽排序（可选）
2、多媒体文件预览
3、校验图片长宽比（可选）
3、图片、视频分辨率校验（可选）

## API

| 参数              | 说明                                                           | 是否必填 | 类型                                          | 默认值                  |
| ----------------- | -------------------------------------------------------------- | -------- | --------------------------------------------- | ----------------------- |
| request           | 请求工具函数     | 否       | (url:string,options:Record<string,any>)=>void | axios       |
| concurrentQuantity          | 并发上传的分片文件个数       |    否       | number       |   3       |
| chunkSize        | 分片文件大小               |   否       | number    |5 * 1024 * 1024         |
| calculateHashMode          | 计算文件hash的方式    全量：all 布隆过滤器：bulon       |     否    | 'all'\|'bulon'      | 'bulon'|
| checkFileUrl      | 校验文件历史上传记录的请求地址                |     否     | string  |  '/largeFile/check'   |
| uploadFileUrl      | 上传分片文件的请求地址                |     否     | string      |     '/largeFile/upload'|
| mergeFileUrl      | 请求合并分片文件的请求地址            |     否     | string       |   '/largeFile/merge'  |
| accepts      | 允许上传文件的后缀集合      |     否     | Accept[]  | ['.png', '.jpg', '.jpeg', '.mp4', '.zip']        |
| beforeUpload | 上传前的勾子函数 用来自定义校验规则来确定哪些文件可以被上传以及何时被上传   | 否 | (file: RCFile, files: RCFile[]) => boolean | Promise<boolean> | () => Promise.resolve(true) |
| value | 当前组件上传成功的文件(或文件集合) limit===1的时候 是OssFile ; limit>1 的时候是  OssFile[]   | 否 | OssFile[] \| OssFile | [] |
| onChange |  OssFile文件上传成功或者删除已上传成功后的文件的回调函数   | 否 | (file:OssFile[] \| OssFile)=>void  | (file:OssFile[] \| OssFile) => {} |
| onChaonOriginFileChangenge |  RCFile文件上传成功或者删除已上传成功后的文件的回调函数   | 否 | (file:RCFile[] \| RCFile)=>void  | (file:RCFile[] \| RCFile) => {} |
| needSort |  是否需要拖拽排序   | 否 | boolean|true|
| imgRatio |  需要校验的图片的长宽比 needCheckImgRatio为true 才能生效   | 否 | number  | 16/9 |
| needCheckImgRatio |  是否需要检查图片长宽比    | 否 | boolean  | true |
| minImgResolutionRatio |  最小的图片分辨率   | 否 | `${width}*${height}`  | - |
| maxImgResolutionRatio |  最大的图片分辨率   | 否 | `${width}*${height}`  | - |
| minVideoResolutionRatio |  最小的视频分辨率   | 否 | `${width}*${height}`  | - |
| maxVideoResolutionRatio |  最小的视频分辨率   | 否 | `${width}*${height}`  | - |


