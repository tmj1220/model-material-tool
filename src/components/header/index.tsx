import React, { useState } from 'react';
import {
  Tabs,
  Input,
  Button,
  Menu,
  Dropdown,
  Space,
  MenuProps,
  Drawer,
} from 'antd';
import { useModelDispatchers, useModelState } from '@/store';
import searchSvg from '@/assets/images/icons/search.svg';
import UploadSvg from '@/assets/images/anticons/upload.svg';
import closeSvg from '@/assets/images/anticons/close.svg';
import logo from '@/assets/images/icons/logo.svg';
import { useNavigate } from 'react-router-dom';
import Icon, { DownOutlined } from '@ant-design/icons';
import SignoutSvg from '@/assets/images/anticons/signout.svg';
import { redirectLogin } from '@/utils/utils';
import AddModel from './addmodel';
import { menuOptions } from './constant';
import s from './index.less';

interface HeaderProps { }

const Header: React.FC<HeaderProps> = () => {
  const [addModelVisible, setaddModelVisible] = useState<boolean>(false);
  const navigate = useNavigate();
  const {
    getMaterialCategory,
    updateCurCategory,
    updateMaterialCategory,
    getResourceList,
    getResourceByKeyword,
    updateSearchKeyword,
    updateIsGetMoreResources,
  } = useModelDispatchers('list');
  const { requestParams, curCategory } = useModelState('list');
  const { name } = useModelState('user');
  // 切换tab
  const onTabChange = async (key) => {
    updateCurCategory(key);
    // 更新可继续获取资源状态
    updateIsGetMoreResources(true)
    // 清空关键字
    updateSearchKeyword('');
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
  // 关键字检索
  const onSearch = (value) => {
    // 更新可继续获取资源状态
    updateIsGetMoreResources(true)
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
  return (
    <div className={s['header-root']}>
      <div className={s['left-box']}>
        <h1
          onClick={() => {
            navigate('/list');
          }}
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
              setaddModelVisible(true);
            }}
          >
            上传
          </Button>
        </div>
        <div className={s['user-info-box']}>
          <Dropdown placement="bottomLeft" overlay={menu}>
            <Space>
              <div className={s.avtar}>{name.replace(/^(.*[n])*.*(.|n)$/g, '$2')}</div>
              <div style={{ minWidth: 40 }}>{name}</div>
              <DownOutlined style={{ color: '#333333', fontSize: 12 }} />
            </Space>
          </Dropdown>
        </div>
      </div>
      <Drawer
        contentWrapperStyle={{ borderRadius: '14px', overflow: 'hidden' }}
        maskStyle={{ background: 'rgba(0,0,0,0.8)' }}
        placement="bottom"
        height="calc(100% - 64px)"
        destroyOnClose
        maskClosable={false}
        closable={false}
        visible={addModelVisible}
      >
        <div className={s['drawer-close']}>
          <Icon
            onClick={() => {
              setaddModelVisible(false);
            }}
            component={closeSvg}
            style={{ fontSize: 36, color: '#fff' }}
          />
        </div>
        <AddModel onAdd={() => {
          setaddModelVisible(false);
        }}
        />
      </Drawer>
    </div>
  );
};

export default Header;
