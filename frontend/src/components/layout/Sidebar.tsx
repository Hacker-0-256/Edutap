import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  AccountBookOutlined,
  MobileOutlined,
  ShopOutlined,
  CreditCardOutlined,
  FileTextOutlined,
  SettingOutlined,
  BankOutlined,
  TeamOutlined,
  FileSearchOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import './Sidebar.css';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Base menu items available to all roles
  const baseMenuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/students',
      icon: <UserOutlined />,
      label: 'Students',
    },
    {
      key: '/attendance',
      icon: <CheckCircleOutlined />,
      label: 'Attendance',
    },
    {
      key: '/payments',
      icon: <DollarOutlined />,
      label: 'Payments',
    },
    {
      key: '/accounts',
      icon: <AccountBookOutlined />,
      label: 'Accounts',
    },
    {
      key: '/devices',
      icon: <MobileOutlined />,
      label: 'Devices',
    },
    {
      key: '/merchants',
      icon: <ShopOutlined />,
      label: 'Merchants',
    },
    {
      key: '/cards',
      icon: <CreditCardOutlined />,
      label: 'Cards',
    },
    {
      key: '/reports',
      icon: <FileTextOutlined />,
      label: 'Reports',
    },
  ];

  // Admin-only menu items
  const adminOnlyItems = [
    {
      key: '/schools',
      icon: <BankOutlined />,
      label: 'Schools',
    },
    {
      key: '/users',
      icon: <TeamOutlined />,
      label: 'Users',
    },
    {
      key: '/logs',
      icon: <FileSearchOutlined />,
      label: 'System Logs',
    },
  ];

  // Settings available to all
  const settingsItem = {
    key: '/settings',
    icon: <SettingOutlined />,
    label: 'Settings',
  };

  // Filter menu items based on user role
  const filteredMenuItems = user?.role === 'admin'
    ? [...baseMenuItems, ...adminOnlyItems, settingsItem]
    : [...baseMenuItems, settingsItem]; // School staff: base items + settings only

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <Sider className="app-sidebar" width={240} collapsible={false}>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={filteredMenuItems}
        onClick={handleMenuClick}
        className="sidebar-menu"
      />
    </Sider>
  );
};

export default Sidebar;

