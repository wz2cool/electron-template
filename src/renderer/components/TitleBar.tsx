import React, { useState, useEffect } from 'react';
import { Button, Space } from 'antd';
import { MinusOutlined, BorderOutlined, CloseOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import './TitleBar.css';

const TitleBar: React.FC = () => {
  const [isMaximized, setIsMaximized] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // 检查初始最大化状态
    const checkMaximized = async () => {
      if (window.electronAPI?.window) {
        const maximized = await window.electronAPI.window.isMaximized();
        setIsMaximized(maximized);
      }
    };
    checkMaximized();

    // 监听窗口状态变化
    if (window.electronAPI?.window) {
      window.electronAPI.window.onStateChanged((state) => {
        setIsMaximized(state.isMaximized);
      });
    }

    // 清理监听器
    return () => {
      if (window.electronAPI?.window) {
        window.electronAPI.window.removeStateListener();
      }
    };
  }, []);

  const handleMinimize = async () => {
    if (window.electronAPI?.window) {
      await window.electronAPI.window.minimize();
    }
  };

  const handleMaximize = async () => {
    if (window.electronAPI?.window) {
      await window.electronAPI.window.maximize();
      const maximized = await window.electronAPI.window.isMaximized();
      setIsMaximized(maximized);
    }
  };

  const handleClose = async () => {
    if (window.electronAPI?.window) {
      await window.electronAPI.window.close();
    }
  };

  return (
    <div className="titlebar">
      <div className="titlebar-drag-region">
        <div className="titlebar-title">
          <Space>
            <span className="app-icon">📦</span>
            <span>OurUI Tool v4</span>
          </Space>
        </div>
      </div>
      
      <div className="titlebar-controls">
        <Button
          type="text"
          icon={<MinusOutlined />}
          className="titlebar-button minimize-button"
          onClick={handleMinimize}
          title={t('titlebar.minimize')}
        />
        <Button
          type="text"
          icon={isMaximized ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
          className="titlebar-button maximize-button"
          onClick={handleMaximize}
          title={isMaximized ? t('titlebar.restore') : t('titlebar.maximize')}
        />
        <Button
          type="text"
          icon={<CloseOutlined />}
          className="titlebar-button close-button"
          onClick={handleClose}
          title={t('titlebar.close')}
        />
      </div>
    </div>
  );
};

export default TitleBar;