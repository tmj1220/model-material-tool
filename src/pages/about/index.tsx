/*
 * @Author: like 465420404@qq.com
 * @Date: 2022-09-12 10:09:03
 * @LastEditors: like 465420404@qq.com
 * @LastEditTime: 2022-09-15 16:03:27
 * @FilePath: /model-material-tool/src/pages/about/index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by like 465420404@qq.com, All Rights Reserved.
 */
import React from 'react';
import { Avatar } from 'antd'
import Icon from '@ant-design/icons';
import rcuxSvg from '@/assets/images/anticons/rcux.svg';
import banner from '@/assets/images/about-banner.png'
import s from './index.less'

interface AboutProps {

}

const participants = ['静静', 'reamey', 'like', 'Akiza', '铭键', '徐佳']

const About: React.FC<AboutProps> = () => (
  <div className={s['about-content']}>
    <div style={{ backgroundImage: `url(${banner})` }} className={s['banner-box']} />
    <div className={s['content-box']}>
      <div className={s['msg-box']}>
        <div className={s['title-msg']}>Plouto是什么?</div>
        <div style={{ padding: '20px 0' }}>古希腊语：Plouto（Πλουτώ ）意为“财富”。</div>
        <div>正如设计资源之于设计师的价值一样。</div>
        <div style={{ padding: '20px 0' }}>
          为了解决3D模型、材质与其它设计资源在设计师与开发同学之间共享的痛点，
          更大程度地消除低效共享协同与设计一致性差等问题，
          Rokid 产品技术中心 RCUX 体验设计组与平台组研发同学倾力打造了 Plouto 设计资源管理与共享平台。
        </div>
        <div>现在，你可以将自己本地的模型与材质资源等上传到 Plouto 平台，方便地浏览、管理与分享。</div>
        <div style={{ padding: '20px 0' }}>如您有任何建议或在使用中遇到问题，请邮件 rcux@rokid.com 联系我们，谢谢！</div>
        <div style={{ padding: '20px 0' }}>❤️特别鸣谢：</div>
        <div style={{ display: 'flex' }}>
          {
            participants.map((item, index) => (
              <span key={item} style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar size={16}>{item.replace(/^(.*[n])*.*(.|n)$/g, '$2')}</Avatar>
                <span style={{ paddingLeft: 5 }}>{item}</span>
                {
                  index !== participants.length - 1 && <span>、</span>
                }
              </span>
            ))
          }
        </div>
      </div>
    </div>
    <div className={s['footer-box']}>
      <div className={s.title}>Designed by</div>
      <a className={s.logo} href="www.rcux.team" target="_blank">
        <Icon component={rcuxSvg} style={{ fontSize: 72 }} />
      </a>
      <div className={s.copyright}>Copyright © 2022 Rokid.inc</div>
    </div>
  </div>
)
export default About
