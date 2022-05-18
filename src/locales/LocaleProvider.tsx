import React from 'react';
import antdCN from 'antd/es/locale/zh_CN';
import antdEN from 'antd/es/locale/en_US';
import localesZh from './zh-CN/index';
import localesEn from './en-US/index';

export const getLocale = (lang: string) => {
  let result = {
    locale: { ...localesZh },
    antLocal: antdCN,
  };
  switch (lang) {
    case 'zh-CN':
      result = {
        locale: { ...localesZh },
        antLocal: antdCN,
      };
      break;
    case 'en-US':
      result = {
        // locale: localesEn,
        locale: { ...localesEn },
        antLocal: antdEN,
      };
      break;
    default:
      result = {
        locale: { ...localesEn },
        antLocal: antdEN,
      };
  }
  return result;
};

const LocaleProvider = ({
  children,
}:{
  children:JSX.Element,
  locale:{
    locale:string, messages:Record<string, any>
  }
}) => React.Children.only(children)

export default LocaleProvider;
