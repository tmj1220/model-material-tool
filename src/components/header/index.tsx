import React from 'react';
import {
  Tabs, Input, Button,
} from 'antd';
import { useModelDispatchers, useModelState } from '@/store'
import searchSvg from '@/assets/images/icons/search.svg';
import UploadSvg from '@/assets/images/anticons/upload.svg';
import logo from '@/assets/images/icons/logo.svg';
import { menuOptions } from './constant';
import s from './index.less';

interface HeaderProps { }

const Header: React.FC<HeaderProps> = () => {
  const {
    getMaterialCategory, updateCurCategory, updateMaterialCategory,
    getResourceList, getResourceByKeyword, updateSearchKeyword,
  } = useModelDispatchers('list')
  const { requestParams, curCategory } = useModelState('list')
  // 切换tab
  const onTabChange = async (key) => {
    updateCurCategory(key)
    if (key === '2') {
      // 点击材质请求材质下分类
      await getMaterialCategory()
      await getResourceList({
        pageNum: 1,
        pageSize: requestParams.pageSize,
        resourceType: key,
        materialCategoryId: null,
      })
    } else {
      getResourceList({
        pageNum: 1,
        pageSize: requestParams.pageSize,
        resourceType: key,
      })
      updateMaterialCategory([])
    }
  }
  // 关键字检索
  const onSearch = (value) => {
    if (value) {
      updateCurCategory(null)
      getResourceByKeyword({
        pageNum: 1,
        pageSize: requestParams.pageSize,
        resourceType: null,
        keyword: value,
      })
    } else {
      updateCurCategory(menuOptions[0].key)
      getResourceList({
        pageNum: 1,
        pageSize: requestParams.pageSize,
        resourceType: menuOptions[0].key as any,
      })
    }
    updateSearchKeyword(value)
    updateMaterialCategory([])
  }
  return (
    <div className={s['header-root']}>
      <div className={s['left-box']}>
        <h1 className={s['logo-box']}>
          <img src={logo} alt="" />
        </h1>
        <div className={s['menu-box']}>
          <Tabs activeKey={String(curCategory)} onChange={onTabChange}>
            {menuOptions.map(({ key, title }) => (
              <Tabs.TabPane key={key} tab={title} />
            ))}
          </Tabs>
        </div>
      </div>
      <div className={s['right-box']}>
        <div className={s['input-box']}>
          <Input.Search
            placeholder="搜索"
            onSearch={onSearch}
            prefix={(
              <img
                src={searchSvg}
                style={{ width: '24px', height: '24px' }}
                alt="search"
              />
            )}
            allowClear
            className={s.input}
          />
          <Button
            icon={<UploadSvg style={{ marginRight: 7, fontSize: 18 }} />}
            type="primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              borderRadius: 100,
            }}
          >
            上传
          </Button>
        </div>
        <div className={s['user-info-box']}>
          <div className={s.avtar}>A</div>
          Annndy
        </div>
      </div>
    </div>
  );
};

export default Header;
