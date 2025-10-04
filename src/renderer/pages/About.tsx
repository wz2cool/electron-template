import React from 'react';
import { Card, Typography, Space, Descriptions, Tag, Divider, Row, Col, Avatar, Timeline, Badge } from 'antd';
import { InfoCircleOutlined, TeamOutlined, GithubOutlined, MailOutlined, RocketOutlined, StarOutlined, HeartOutlined, CodeOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const About: React.FC = () => {
  return (
    <div>
      {/* 项目介绍横幅 */}
      <Card 
        style={{ 
          background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
          border: 'none',
          marginBottom: '24px'
        }}
      >
        <Row align="middle" gutter={[24, 24]}>
          <Col xs={24} md={4} style={{ textAlign: 'center' }}>
            <Avatar 
              size={80} 
              style={{ 
                background: 'rgba(255,255,255,0.2)',
                border: '3px solid rgba(255,255,255,0.3)'
              }}
              icon={<RocketOutlined style={{ fontSize: '40px', color: '#fff' }} />}
            />
          </Col>
          <Col xs={24} md={20}>
            <Space direction="vertical" size="small">
              <Title level={2} style={{ color: '#fff', margin: 0 }}>
                <InfoCircleOutlined /> Electron Template
              </Title>
              <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', margin: 0 }}>
                现代化的桌面应用程序开发框架，为开发者提供高效、稳定的跨平台桌面应用开发体验
              </Paragraph>
              <Space>
                <Badge count="v1.0.0" style={{ backgroundColor: '#52c41a' }} />
                <Badge count="MIT" style={{ backgroundColor: '#1890ff' }} />
                <Badge count="TypeScript" style={{ backgroundColor: '#722ed1' }} />
              </Space>
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={[24, 24]}>
        {/* 项目信息 */}
        <Col xs={24} lg={12}>
          <Card 
            title={<><TeamOutlined /> 项目详情</>} 
            bordered={false}
            style={{ height: '100%' }}
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item label="项目名称">
                <Text strong>Electron Template</Text>
              </Descriptions.Item>
              <Descriptions.Item label="版本号">
                <Tag color="blue">v1.0.0</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="开发语言">
                <Space>
                  <Tag color="blue">TypeScript</Tag>
                  <Tag color="orange">JavaScript</Tag>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="UI 框架">
                <Tag color="cyan">Ant Design</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="构建工具">
                <Tag color="orange">Rspack</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="桌面框架">
                <Tag color="volcano">Electron</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="许可证">
                <Tag color="green">MIT License</Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* 开发历程 */}
        <Col xs={24} lg={12}>
          <Card 
            title={<><StarOutlined /> 开发历程</>} 
            bordered={false}
            style={{ height: '100%' }}
          >
            <Timeline
              items={[
                {
                  color: 'green',
                  children: (
                    <div>
                      <Text strong>项目初始化</Text>
                      <br />
                      <Text type="secondary">搭建基础架构和开发环境</Text>
                    </div>
                  ),
                },
                {
                  color: 'blue',
                  children: (
                    <div>
                      <Text strong>集成 Ant Design</Text>
                      <br />
                      <Text type="secondary">引入现代化 UI 组件库</Text>
                    </div>
                  ),
                },
                {
                  color: 'orange',
                  children: (
                    <div>
                      <Text strong>添加路由系统</Text>
                      <br />
                      <Text type="secondary">实现多页面导航功能</Text>
                    </div>
                  ),
                },
                {
                  color: 'purple',
                  children: (
                    <div>
                      <Text strong>优化布局框架</Text>
                      <br />
                      <Text type="secondary">完善响应式设计</Text>
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要特性 */}
      <Card 
        title={<><CodeOutlined /> 核心特性</>} 
        bordered={false}
        style={{ marginTop: '24px' }}
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={6}>
            <Card size="small" style={{ textAlign: 'center', background: '#f6ffed' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🚀</div>
              <Title level={5} style={{ margin: '8px 0' }}>现代化技术栈</Title>
              <Paragraph style={{ fontSize: '12px', color: '#666' }}>
                React 18 + TypeScript + Ant Design
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card size="small" style={{ textAlign: 'center', background: '#fff7e6' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚡</div>
              <Title level={5} style={{ margin: '8px 0' }}>快速构建</Title>
              <Paragraph style={{ fontSize: '12px', color: '#666' }}>
                Rspack 极速编译和热重载
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card size="small" style={{ textAlign: 'center', background: '#f6f7ff' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎨</div>
              <Title level={5} style={{ margin: '8px 0' }}>美观界面</Title>
              <Paragraph style={{ fontSize: '12px', color: '#666' }}>
                专业一致的用户界面设计
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card size="small" style={{ textAlign: 'center', background: '#fff0f6' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔧</div>
              <Title level={5} style={{ margin: '8px 0' }}>易于扩展</Title>
              <Paragraph style={{ fontSize: '12px', color: '#666' }}>
                模块化架构，支持插件系统
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* 联系方式和版权 */}
      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col xs={24} md={16}>
          <Card 
            title={<><MailOutlined /> 联系我们</>} 
            bordered={false}
          >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Row align="middle">
                <Col span={2}>
                  <GithubOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                </Col>
                <Col span={22}>
                  <Text>GitHub: </Text>
                  <Text code>https://github.com/yourname/electron-template</Text>
                </Col>
              </Row>
              <Row align="middle">
                <Col span={2}>
                  <MailOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                </Col>
                <Col span={22}>
                  <Text>邮箱: </Text>
                  <Text code>support@electron-template.com</Text>
                </Col>
              </Row>
            </Space>
          </Card>
        </Col>
        
        <Col xs={24} md={8}>
          <Card 
            bordered={false}
            style={{ 
              textAlign: 'center',
              background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
            }}
          >
            <Space direction="vertical" size="small">
              <HeartOutlined style={{ fontSize: '32px', color: '#ff4d4f' }} />
              <Title level={4} style={{ margin: '8px 0', color: '#333' }}>
                Made with ❤️
              </Title>
              <Paragraph style={{ color: '#666', margin: 0, fontSize: '12px' }}>
                © 2024 Electron Template
              </Paragraph>
              <Paragraph style={{ color: '#666', margin: 0, fontSize: '12px' }}>
                All rights reserved
              </Paragraph>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default About;