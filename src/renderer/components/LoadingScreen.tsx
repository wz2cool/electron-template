import React, { useState, useEffect } from 'react';
import { Spin, Progress, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import './LoadingScreen.css';

const { Title, Text } = Typography;

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('正在初始化应用...');

  const loadingSteps = [
    { text: '正在初始化应用...', duration: 800 },
    { text: '正在连接数据库...', duration: 600 },
    { text: '正在加载用户数据...', duration: 500 },
    { text: '正在准备界面...', duration: 400 },
    { text: '启动完成！', duration: 300 }
  ];

  useEffect(() => {
    let currentStep = 0;
    let currentProgress = 0;
    
    const updateProgress = () => {
      if (currentStep < loadingSteps.length) {
        const step = loadingSteps[currentStep];
        setLoadingText(step.text);
        
        const targetProgress = ((currentStep + 1) / loadingSteps.length) * 100;
        
        const progressInterval = setInterval(() => {
          currentProgress += 2;
          setProgress(Math.min(currentProgress, targetProgress));
          
          if (currentProgress >= targetProgress) {
            clearInterval(progressInterval);
            
            setTimeout(() => {
              currentStep++;
              if (currentStep < loadingSteps.length) {
                updateProgress();
              } else {
                // 加载完成
                setTimeout(() => {
                  onLoadingComplete?.();
                }, 500);
              }
            }, step.duration);
          }
        }, 50);
      }
    };

    // 延迟开始，让组件有时间渲染
    const startTimeout = setTimeout(() => {
      updateProgress();
    }, 200);

    return () => {
      clearTimeout(startTimeout);
    };
  }, [onLoadingComplete]);

  const antIcon = <LoadingOutlined style={{ fontSize: 48, color: '#1890ff' }} spin />;

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="logo-section">
          <div className="app-logo">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="35" fill="url(#gradient)" />
              <text x="40" y="50" textAnchor="middle" fontSize="32" fontWeight="bold" fill="white">
                O
              </text>
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1890ff" />
                  <stop offset="100%" stopColor="#722ed1" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <Title level={2} style={{ color: '#1890ff', marginTop: 16, marginBottom: 8 }}>
            OurUI Tool V4
          </Title>
          <Text type="secondary" style={{ fontSize: 14 }}>
            现代化的用户界面工具
          </Text>
        </div>

        <div className="loading-section">
          <Spin indicator={antIcon} />
          <div className="progress-section">
            <Progress 
              percent={Math.round(progress)} 
              strokeColor={{
                '0%': '#1890ff',
                '100%': '#722ed1',
              }}
              trailColor="#f0f0f0"
              strokeWidth={6}
              showInfo={false}
              style={{ marginTop: 24, marginBottom: 16 }}
            />
            <Text style={{ color: '#666', fontSize: 14 }}>
              {loadingText}
            </Text>
          </div>
        </div>
      </div>
      
      <div className="loading-footer">
        <Text type="secondary" style={{ fontSize: 12 }}>
          版本 1.0.0 | 正在为您准备最佳体验
        </Text>
      </div>
    </div>
  );
};

export default LoadingScreen;