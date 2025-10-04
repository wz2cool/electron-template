import React, { useState, useEffect } from 'react';
import { Card, Typography, Space, Tag, Row, Col, Button, Statistic, Progress, Divider } from 'antd';
import { FileOutlined, InfoCircleOutlined, CodeOutlined, HomeOutlined, RocketOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { ElectronVersions } from '../../types';

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  const [versions, setVersions] = useState<ElectronVersions | null>(null);

  useEffect(() => {
    // 检查是否在 Electron 环境中
    if (window.electronAPI && window.electronAPI.getVersions) {
      const versionInfo = window.electronAPI.getVersions();
      setVersions(versionInfo);
    } else {
      // 在浏览器环境中提供默认值
      setVersions({
        chrome: 'Browser',
        node: 'N/A',
        electron: 'N/A'
      });
    }
  }, []);

  const handleOpenFile = async () => {
    if (window.electronAPI && window.electronAPI.openFile) {
      try {
        const filePath = await window.electronAPI.openFile();
        if (filePath) {
          alert(`选择的文件: ${filePath}`);
        }
      } catch (error) {
        console.error('打开文件失败:', error);
      }
    } else {
      alert('此功能仅在 Electron 环境中可用');
    }
  };

  return (
    <div>
      {/* 欢迎横幅 */}
      <Card 
        style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          marginBottom: '24px'
        }}
      >
        <Row align="middle" gutter={[24, 24]}>
          <Col xs={24} md={16}>
            <Space direction="vertical" size="small">
              <Title level={2} style={{ color: '#fff', margin: 0 }}>
                <RocketOutlined /> 欢迎使用 OurUI Tool v4
              </Title>
              <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', margin: 0 }}>
                现代化的桌面应用开发平台，集成最新技术栈
              </Paragraph>
            </Space>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: 'center' }}>
            <div style={{ 
              background: 'rgba(255,255,255,0.2)', 
              borderRadius: '50%', 
              width: '80px', 
              height: '80px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto'
            }}>
              <ThunderboltOutlined style={{ fontSize: '40px', color: '#fff' }} />
            </div>
          </Col>
        </Row>
      </Card>

      <Row gutter={[24, 24]}>
        {/* 版本信息卡片 */}
        <Col xs={24} lg={16}>
          <Card 
            title={<><InfoCircleOutlined /> 系统版本信息</>} 
            bordered={false}
            style={{ height: '100%' }}
          >
            {versions ? (
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                  <Card size="small" style={{ textAlign: 'center', background: '#f6ffed' }}>
                    <Statistic 
                      title="Chrome 版本" 
                      value={versions.chrome} 
                      valueStyle={{ color: '#52c41a', fontSize: '18px' }}
                    />
                    <Tag color="success" style={{ marginTop: '8px' }}>浏览器内核</Tag>
                  </Card>
                </Col>
                <Col xs={24} sm={8}>
                  <Card size="small" style={{ textAlign: 'center', background: '#f6f7ff' }}>
                    <Statistic 
                      title="Node.js 版本" 
                      value={versions.node} 
                      valueStyle={{ color: '#1890ff', fontSize: '18px' }}
                    />
                    <Tag color="processing" style={{ marginTop: '8px' }}>运行时</Tag>
                  </Card>
                </Col>
                <Col xs={24} sm={8}>
                  <Card size="small" style={{ textAlign: 'center', background: '#fff7e6' }}>
                    <Statistic 
                      title="Electron 版本" 
                      value={versions.electron} 
                      valueStyle={{ color: '#fa8c16', fontSize: '18px' }}
                    />
                    <Tag color="warning" style={{ marginTop: '8px' }}>框架</Tag>
                  </Card>
                </Col>
              </Row>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Progress type="circle" percent={75} status="active" />
                <Paragraph style={{ marginTop: '16px' }}>正在加载版本信息...</Paragraph>
              </div>
            )}
          </Card>
        </Col>

        {/* 快速操作 */}
        <Col xs={24} lg={8}>
          <Card 
            title={<><FileOutlined /> 快速操作</>} 
            bordered={false}
            style={{ height: '100%' }}
          >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Button 
                type="primary" 
                icon={<FileOutlined />} 
                size="large"
                block
                onClick={handleOpenFile}
                style={{ height: '48px' }}
              >
                打开文件
              </Button>
              
              <Divider style={{ margin: '12px 0' }} />
              
              <div style={{ textAlign: 'center' }}>
                <Paragraph type="secondary" style={{ fontSize: '12px' }}>
                  更多功能正在开发中...
                </Paragraph>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 技术栈展示 */}
      <Card 
        title={<><CodeOutlined /> 技术栈架构</>} 
        bordered={false}
        style={{ marginTop: '24px' }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={8} md={4}>
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>⚡</div>
              <Tag color="volcano" style={{ fontSize: '12px' }}>Electron</Tag>
            </div>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>⚛️</div>
              <Tag color="blue" style={{ fontSize: '12px' }}>React 18</Tag>
            </div>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📘</div>
              <Tag color="geekblue" style={{ fontSize: '12px' }}>TypeScript</Tag>
            </div>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📦</div>
              <Tag color="orange" style={{ fontSize: '12px' }}>Rspack</Tag>
            </div>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎨</div>
              <Tag color="cyan" style={{ fontSize: '12px' }}>Ant Design</Tag>
            </div>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🚀</div>
              <Tag color="magenta" style={{ fontSize: '12px' }}>React Router</Tag>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Home;