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
import { menuOptions } from '@/utils/constant';
import AddModel, { AddModelForwardRefOrops } from './addmodel';
import s from './index.less';

interface HeaderProps { }

const Header: React.FC<HeaderProps> = () => {
  const [curKeyword, setCurKeyword] = useState<string>('');
  const addModelRef = useRef<AddModelForwardRefOrops>(null);
  const navigate = useNavigate();
  const urlLocation = useLocation();
  const {
    getMaterialCategory,
    updateCurCategory,
    getResourceList,
    getResourceByKeyword,
    updateSearchKeyword,
    updateIsGetMoreResources,
    updateCurSearchTag,
  } = useModelDispatchers('list');
  const { requestParams, defaultRequestParams, curCategory } = useModelState('list');
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
    if (key === menuOptions[1].key) {
      navigate('/about');
    } else if (key === menuOptions[0].key) {
      navigate('/list');
      await getMaterialCategory();
      await getResourceList({
        ...defaultRequestParams,
        pageSize: requestParams.pageSize,
        resourceType: key,
        materialCategoryId: null,
      });
    }
    /** 在自己资源页面上传后获取新的资源列表 */
    if (!key) {
      getResourceList({
        ...defaultRequestParams,
        pageSize: requestParams.pageSize,
        mine: 1,
      });
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
    updateSearchKeyword(value);
    // 更新可继续获取资源状态
    updateIsGetMoreResources(true);
    // 清空标签检索
    updateCurSearchTag([]);
    getResourceByKeyword({
      ...requestParams,
      pageNum: 1,
      resourceType: menuOptions[0].key as any,
      keyword: value ?? '',
    });
  };
  const goHome = () => {
    if (urlLocation?.pathname !== '/list') {
      navigate('/list');
      updateCurCategory(menuOptions[0].key as any);
    }
  };
  useEffect(() => {
    console.log(urlLocation)
    switch (urlLocation?.pathname) {
      case '/list': updateCurCategory(menuOptions[0].key as any);

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
