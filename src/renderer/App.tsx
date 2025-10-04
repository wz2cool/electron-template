import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, Menu, theme, Button, Space } from 'antd';
import { 
  HomeOutlined, 
  InfoCircleOutlined, 
  MenuFoldOutlined, 
  MenuUnfoldOutlined,
  CodeOutlined,
  SettingOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './App.css';
import Home from './pages/Home';
import About from './pages/About';
import Settings from './pages/Settings';
import UserManagement from './pages/UserManagement';
import TitleBar from './components/TitleBar';
import LoadingScreen from './components/LoadingScreen';
import UpdateNotification from './components/UpdateNotification';

const { Header, Sider, Content } = Layout;

const SidebarMenu: React.FC<{ collapsed: boolean }> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: t('navigation.home'),
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: t('navigation.users'),
    },
    {
      key: '/about',
      icon: <InfoCircleOutlined />,
      label: t('navigation.about'),
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: t('navigation.settings'),
    },
  ];

  const handleMenuClick = (e: { key: string }) => {
    navigate(e.key);
  };

  // 获取当前路径，处理 hash 路由
  const currentPath = location.pathname;

  return (
    <Menu
      theme="light"
      mode="inline"
      selectedKeys={[currentPath]}
      items={menuItems}
      onClick={handleMenuClick}
      style={{ height: '100%', borderRight: 0 }}
    />
  );
};

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAppReady, setIsAppReady] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    // 检查应用是否准备就绪
    const checkAppReady = async () => {
      try {
        // 等待一小段时间确保所有资源加载完成
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 可以在这里添加更多的初始化检查
        // 比如检查用户数据、配置等
        
        setIsAppReady(true);
      } catch (error) {
        console.error('App initialization error:', error);
        // 即使出错也要显示应用，避免永久加载
        setIsAppReady(true);
      }
    };

    checkAppReady();
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  // 如果正在加载或应用未准备就绪，显示加载界面
  if (isLoading || !isAppReady) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <Router>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <TitleBar />
        <UpdateNotification />
        <Layout style={{ height: 'calc(100vh - 32px)' }}>
          <Sider 
            trigger={null} 
            collapsible 
            collapsed={collapsed}
            style={{ 
              background: colorBgContainer,
              height: '100%',
              overflow: 'hidden'
            }}
          >
          <div style={{
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            padding: '0 16px',
            borderBottom: '1px solid #f0f0f0',
          }}>
            {!collapsed && (
              <Space align="center" size="small">
                <CodeOutlined style={{ 
                  fontSize: '24px', 
                  color: '#1890ff' 
                }} />
                <span style={{ 
                  fontSize: '16px', 
                  fontWeight: 'bold', 
                  color: '#1890ff'
                }}>
                  OurUI Tool
                </span>
              </Space>
            )}
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 32,
                height: 32,
              }}
            />
          </div>
          <SidebarMenu collapsed={collapsed} />
        </Sider>

        <Layout style={{ height: '100%', overflow: 'hidden' }}>
          <Content
            style={{
              margin: '16px',
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              overflow: 'auto',
              height: 'calc(100% - 32px)',
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/about" element={<About />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </div>
    </Router>
  );
};

export default App;