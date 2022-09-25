/*
 * @Author: like 465420404@qq.com
 * @Date: 2022-08-26 17:24:16
 * @LastEditors: like 465420404@qq.com
 * @LastEditTime: 2022-09-25 15:16:22
 * @FilePath: /model-material-tool/src/pages/loading/index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by like 465420404@qq.com, All Rights Reserved.
 */
import { Spin } from 'antd';
import React, { useEffect } from 'react'

interface LoadingProps {}

const Loading: React.FC<LoadingProps> = () => {
  useEffect(() => {}, [])
  return (
    <div style={{
      display: 'flex', position: 'fixed', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center',
    }}
    >

      <Spin spinning />
    </div>
  )
};

export default Loading
