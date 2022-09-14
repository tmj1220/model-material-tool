import React, { useEffect, useRef, useState } from 'react';
import {
  Tabs, Input, Button, Menu, Dropdown, Space, MenuProps,
} from 'antd';
import { useModelDispatchers, useModelState } from '@/store';
import searchSvg from '@/assets/images/icons/search.svg';
import UploadSvg from '@/assets/images/anticons/upload.svg';

import logo from '@/assets/images/icons/logo.svg';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon, { DownOutlined } from '@ant-design/icons';
import SignoutSvg from '@/assets/images/anticons/signout.svg';
import { redirectLogin } from '@/utils/utils';
import AddModel, { AddModelForwardRefOrops } from './addmodel';
import { menuOptions } from './constant';
import s from './index.less';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const [curKeyword, setCurKeyword] = useState<string>('');
  const addModelRef = useRef<AddModelForwardRefOrops>(null);
  const navigate = useNavigate();
  const urlLocation = useLocation();
  const {
    getMaterialCategory,
    updateCurCategory,
    updateMaterialCategory,
    getResourceList,
    getResourceByKeyword,
    updateSearchKeyword,
    updateIsGetMoreResources,
    updateCurSearchTag,
  } = useModelDispatchers('list');
  const { requestParams, curCategory } = useModelState('list');
  const { name } = useModelState('user');
  // 切换tab
  const onTabChange = async (key) => {
    updateCurCategory(key);
    // 更新可继续获取资源状态
    updateIsGetMoreResources(true);
    // 清空关键字
    updateSearchKeyword('');
    // 清空标签检索
    updateCurSearchTag([]);
    setCurKeyword('');
    if (key === '3') {
      navigate('/about');
    } else {
      navigate('/list');
      // 点击材质请求材质下分类
      if (key === '2') {
        await getMaterialCategory();
        await getResourceList({
          pageNum: 1,
          pageSize: requestParams.pageSize,
          resourceType: key,
          materialCategoryId: null,
        });
      } else {
        getResourceList({
          pageNum: 1,
          pageSize: requestParams.pageSize,
          resourceType: key,
        });
        updateMaterialCategory([]);
      }
    }
  };
  const onClick: MenuProps['onClick'] = () => {
    redirectLogin();
  };
  const menu = (
    <Menu
      onClick={onClick}
      items={[
        {
          label: <div style={{ marginLeft: 35 }}>退出</div>,
          key: '1',
          icon: (
            <Icon
              style={{ fontSize: 14, marginLeft: 6 }}
              component={SignoutSvg}
            />
          ),
        },
      ]}
    />
  );
  const onChangeKeyword = (e) => {
    setCurKeyword(e.target.value);
  };
  // 关键字检索
  const onSearch = (value) => {
    // 更新可继续获取资源状态
    updateIsGetMoreResources(true);
    // 清空标签检索
    updateCurSearchTag([]);
    if (value) {
      updateCurCategory(null);
      getResourceByKeyword({
        pageNum: 1,
        pageSize: requestParams.pageSize,
        resourceType: null,
        keyword: value,
      });
    } else {
      updateCurCategory(menuOptions[0].key);
      getResourceList({
        pageNum: 1,
        pageSize: requestParams.pageSize,
        resourceType: menuOptions[0].key as any,
      });
    }
    updateSearchKeyword(value);
    updateMaterialCategory([]);
  };
  const goHome = () => {
    if (urlLocation?.pathname !== '/list') {
      navigate('/list');
      updateMaterialCategory([]);
      updateCurCategory(1);
    }
  };
  useEffect(() => {
    console.log(urlLocation)
    switch (urlLocation?.pathname) {
      case '/list': updateCurCategory(1);

        break;
      case '/about': updateCurCategory(3);

        break;
      default:
        break;
    }
  }, [])

  return (
    <div className={s['header-root']}>
      <div className={s['left-box']}>
        <h1
          onClick={goHome}
          className={s['logo-box']}
        >
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
            value={curKeyword}
            onChange={onChangeKeyword}
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
            onClick={() => {
              addModelRef.current.onShowDrawer();
            }}
          >
            上传
          </Button>
        </div>
        <div
          className={s['user-info-box']}
        >
          <Dropdown placement="bottomLeft" overlay={menu}>
            <Space>
              <div
                onClick={() => {
                  updateCurCategory(null);
                  navigate('/personal');
                }}
                className={s.avtar}
              >
                {name?.replace(/^(.*[n])*.*(.|n)$/g, '$2')}
              </div>
              <div style={{ minWidth: 40 }}>{name}</div>
              <DownOutlined style={{ color: '#333333', fontSize: 12 }} />
            </Space>
          </Dropdown>
        </div>
      </div>
      <AddModel ref={addModelRef} onAdd={(type) => { onTabChange(type) }} />
    </div>
  );
};

export default Header;
