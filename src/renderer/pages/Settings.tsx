import React, { useState, useEffect } from 'react';
import { Card, Typography, Space, Radio, Divider, Switch, Button, message } from 'antd';
import { SettingOutlined, GlobalOutlined, CloudDownloadOutlined, ReloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph } = Typography;

const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [autoUpdate, setAutoUpdate] = useState<boolean>(true);
  const [currentVersion, setCurrentVersion] = useState<string>('');
  const [isCheckingUpdate, setIsCheckingUpdate] = useState<boolean>(false);

  useEffect(() => {
    // 获取当前版本
    window.electronAPI.updater.getVersion().then((version: string) => {
      setCurrentVersion(version);
    });

    // 获取自动更新设置
    window.electronAPI.updater.getAutoDownload().then((enabled: boolean) => {
      setAutoUpdate(enabled);
    });
  }, []);

  const handleLanguageChange = (e: any) => {
    const language = e.target.value;
    i18n.changeLanguage(language);
  };

  const getCurrentLanguage = () => {
    return i18n.language || 'zh';
  };

  const handleAutoUpdateChange = async (checked: boolean) => {
    try {
      await window.electronAPI.updater.setAutoDownload(checked);
      setAutoUpdate(checked);
      message.success(t('common.save') + ' ' + t('common.success'));
    } catch (error) {
      message.error(t('common.save') + ' ' + t('common.failed'));
    }
  };

  const handleCheckForUpdates = async () => {
    setIsCheckingUpdate(true);
    try {
      await window.electronAPI.updater.checkForUpdates();
      message.success(t('update.checking'));
    } catch (error) {
      message.error(t('update.checkError'));
    } finally {
      setIsCheckingUpdate(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={2}>
            <SettingOutlined style={{ marginRight: '8px' }} />
            {t('settings.title')}
          </Title>
        </div>

        <Card>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Title level={4}>
                <GlobalOutlined style={{ marginRight: '8px' }} />
                {t('settings.language.title')}
              </Title>
              <Paragraph type="secondary">
                {t('settings.language.description')}
              </Paragraph>
            </div>

            <Divider />

            <div>
              <Paragraph strong>{t('settings.language.current')}</Paragraph>
              <Radio.Group
                value={getCurrentLanguage()}
                onChange={handleLanguageChange}
                style={{ marginTop: '8px' }}
              >
                <Space direction="vertical">
                  <Radio value="zh">{t('settings.language.chinese')}</Radio>
                  <Radio value="en">{t('settings.language.english')}</Radio>
                </Space>
              </Radio.Group>
            </div>
          </Space>
        </Card>

        <Card>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Title level={4}>
                <CloudDownloadOutlined style={{ marginRight: '8px' }} />
                {t('update.autoUpdate')}
              </Title>
              <Paragraph type="secondary">
                {t('update.autoUpdateDescription')}
              </Paragraph>
            </div>

            <Divider />

            <div>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Paragraph strong>{t('update.autoUpdate')}</Paragraph>
                    <Paragraph type="secondary" style={{ margin: 0 }}>
                      {t('update.autoUpdateDescription')}
                    </Paragraph>
                  </div>
                  <Switch
                    checked={autoUpdate}
                    onChange={handleAutoUpdateChange}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Paragraph strong>{t('update.currentVersion')}</Paragraph>
                    <Paragraph type="secondary" style={{ margin: 0 }}>
                      {currentVersion}
                    </Paragraph>
                  </div>
                  <Button
                    type="primary"
                    icon={<ReloadOutlined />}
                    loading={isCheckingUpdate}
                    onClick={handleCheckForUpdates}
                  >
                    {t('update.checkForUpdates')}
                  </Button>
                </div>
              </Space>
            </div>
          </Space>
        </Card>
      </Space>
    </div>
  );
};

export default Settings;