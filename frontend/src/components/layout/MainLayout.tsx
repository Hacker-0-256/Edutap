import React from 'react';
import { Layout } from 'antd';
import Header from './Header';
import Sidebar from './Sidebar';
import './MainLayout.css';

const { Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Layout className="main-layout">
      <Header />
      <Layout className="layout-body">
        <Sidebar />
        <Content className="main-content">{children}</Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;


