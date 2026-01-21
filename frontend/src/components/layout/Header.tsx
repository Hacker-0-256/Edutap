import React from 'react';
import { Layout, Input, Badge, Dropdown, Avatar, Space } from 'antd';
import {
  BellOutlined,
  SearchOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/edutap-logo.svg';
import './Header.css';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/settings'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <AntHeader className="app-header">
      <div className="header-left">
        <img src={logo} alt="EduTap" className="logo" onClick={() => navigate('/dashboard')} />
        <Input
          placeholder="Search students, transactions, devices..."
          prefix={<SearchOutlined />}
          className="search-bar"
          allowClear
        />
      </div>
      <div className="header-right">
        <Space size="large">
          <Badge count={3} size="small">
            <BellOutlined className="header-icon" />
          </Badge>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space className="user-profile" style={{ cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} />
              <span className="user-name">
                {user?.firstName} {user?.lastName}
              </span>
            </Space>
          </Dropdown>
        </Space>
      </div>
    </AntHeader>
  );
};

export default Header;


