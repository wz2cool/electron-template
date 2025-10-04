import React, { useState, useEffect } from 'react';
import { notification, Modal, Progress, Button, Typography, Space } from 'antd';
import { DownloadOutlined, ReloadOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { UpdateInfo, DownloadProgress } from '../../types';

const { Text, Title } = Typography;

const UpdateNotification: React.FC = () => {
  const { t } = useTranslation();
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress | null>(null);
  const [isUpdateReady, setIsUpdateReady] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentVersion, setCurrentVersion] = useState<string>('');

  useEffect(() => {
    // Get current version
    window.electronAPI.updater.getVersion().then((version: string) => {
      setCurrentVersion(version);
    });

    // Set up update event listeners
    window.electronAPI.updater.onUpdateChecking(() => {
      notification.info({
        message: t('update.checking'),
        description: t('update.checkingDescription'),
        placement: 'topRight',
        duration: 3,
      });
    });

    window.electronAPI.updater.onUpdateAvailable((info: UpdateInfo) => {
      setUpdateInfo(info);
      setShowUpdateModal(true);
      notification.success({
        message: t('update.available'),
        description: t('update.availableDescription', { version: info.version }),
        placement: 'topRight',
        duration: 5,
      });
    });

    window.electronAPI.updater.onUpdateNotAvailable(() => {
      notification.info({
        message: t('update.notAvailable'),
        description: t('update.notAvailableDescription'),
        placement: 'topRight',
        duration: 3,
      });
    });

    window.electronAPI.updater.onUpdateError((error: string) => {
      notification.error({
        message: t('update.error'),
        description: error,
        placement: 'topRight',
        duration: 5,
      });
      setIsDownloading(false);
      setDownloadProgress(null);
    });

    window.electronAPI.updater.onDownloadProgress((progress: DownloadProgress) => {
      setDownloadProgress(progress);
      setIsDownloading(true);
    });

    window.electronAPI.updater.onUpdateDownloaded((info: UpdateInfo) => {
      setIsUpdateReady(true);
      setIsDownloading(false);
      setDownloadProgress(null);
      notification.success({
        message: t('update.downloaded'),
        description: t('update.downloadedDescription'),
        placement: 'topRight',
        duration: 0, // Don't auto close
        btn: (
          <Button 
            type="primary" 
            size="small" 
            onClick={() => handleInstallUpdate()}
            icon={<ReloadOutlined />}
          >
            {t('update.installNow')}
          </Button>
        ),
      });
    });

    // Cleanup listeners on unmount
    return () => {
      window.electronAPI.updater.removeUpdateListeners();
    };
  }, [t]);

  const handleCheckForUpdates = async () => {
    try {
      await window.electronAPI.updater.checkForUpdates();
    } catch (error) {
      notification.error({
        message: t('update.error'),
        description: t('update.checkError'),
        placement: 'topRight',
      });
    }
  };

  const handleDownloadUpdate = async () => {
    try {
      setIsDownloading(true);
      await window.electronAPI.updater.downloadUpdate();
    } catch (error) {
      notification.error({
        message: t('update.error'),
        description: t('update.downloadError'),
        placement: 'topRight',
      });
      setIsDownloading(false);
    }
  };

  const handleInstallUpdate = () => {
    Modal.confirm({
      title: t('update.installConfirm'),
      content: t('update.installConfirmDescription'),
      okText: t('update.installNow'),
      cancelText: t('common.cancel'),
      onOk: () => {
        window.electronAPI.updater.quitAndInstall();
      },
    });
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatSpeed = (bytesPerSecond: number): string => {
    return formatBytes(bytesPerSecond) + '/s';
  };

  return (
    <>
      {/* Update Available Modal */}
      <Modal
        title={
          <Space>
            <ExclamationCircleOutlined style={{ color: '#faad14' }} />
            {t('update.newVersionAvailable')}
          </Space>
        }
        open={showUpdateModal}
        onCancel={() => setShowUpdateModal(false)}
        footer={[
          <Button key="later" onClick={() => setShowUpdateModal(false)}>
            {t('update.later')}
          </Button>,
          <Button
            key="download"
            type="primary"
            icon={<DownloadOutlined />}
            loading={isDownloading}
            onClick={handleDownloadUpdate}
          >
            {isDownloading ? t('update.downloading') : t('update.downloadNow')}
          </Button>,
        ]}
        width={600}
      >
        {updateInfo && (
          <div>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div>
                <Text strong>{t('update.currentVersion')}: </Text>
                <Text code>{currentVersion}</Text>
              </div>
              <div>
                <Text strong>{t('update.newVersion')}: </Text>
                <Text code>{updateInfo.version}</Text>
              </div>
              {updateInfo.releaseDate && (
                <div>
                  <Text strong>{t('update.releaseDate')}: </Text>
                  <Text>{new Date(updateInfo.releaseDate).toLocaleDateString()}</Text>
                </div>
              )}
              {updateInfo.releaseNotes && (
                <div>
                  <Text strong>{t('update.releaseNotes')}:</Text>
                  <div style={{ 
                    marginTop: 8, 
                    padding: 12, 
                    backgroundColor: '#f5f5f5', 
                    borderRadius: 6,
                    maxHeight: 200,
                    overflowY: 'auto'
                  }}>
                    <Text style={{ whiteSpace: 'pre-wrap' }}>{updateInfo.releaseNotes}</Text>
                  </div>
                </div>
              )}
              
              {/* Download Progress */}
              {isDownloading && downloadProgress && (
                <div>
                  <Title level={5}>{t('update.downloadProgress')}</Title>
                  <Progress 
                    percent={Math.round(downloadProgress.percent)} 
                    status="active"
                    format={() => `${Math.round(downloadProgress.percent)}%`}
                  />
                  <Space style={{ marginTop: 8 }}>
                    <Text type="secondary">
                      {formatBytes(downloadProgress.transferred)} / {formatBytes(downloadProgress.total)}
                    </Text>
                    <Text type="secondary">
                      {formatSpeed(downloadProgress.bytesPerSecond)}
                    </Text>
                  </Space>
                </div>
              )}
            </Space>
          </div>
        )}
      </Modal>

      {/* Install Ready Notification */}
      {isUpdateReady && (
        <div style={{ 
          position: 'fixed', 
          top: 20, 
          right: 20, 
          zIndex: 9999,
          background: '#fff',
          padding: 16,
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          border: '1px solid #d9d9d9'
        }}>
          <Space>
            <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 18 }} />
            <div>
              <Text strong>{t('update.readyToInstall')}</Text>
              <br />
              <Button 
                type="link" 
                size="small" 
                onClick={handleInstallUpdate}
                style={{ padding: 0 }}
              >
                {t('update.installNow')}
              </Button>
            </div>
          </Space>
        </div>
      )}
    </>
  );
};

export default UpdateNotification;