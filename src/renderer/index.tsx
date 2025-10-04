import React from 'react';
import { createRoot } from 'react-dom/client';
import 'antd/dist/reset.css';
import App from './App';
import '../types';
import './i18n'; // 初始化国际化

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);
root.render(<App />);