import React from 'react';
import { Button, Space } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Space>
      <GlobalOutlined />
      <Button 
        type={i18n.language === 'zh' ? 'primary' : 'default'} 
        size="small" 
        onClick={() => changeLanguage('zh')}
      >
        中文
      </Button>
      <Button 
        type={i18n.language === 'en' ? 'primary' : 'default'} 
        size="small" 
        onClick={() => changeLanguage('en')}
      >
        English
      </Button>
    </Space>
  );
};

export default LanguageSwitcher;