import React, { useState } from 'react';
import { Table, Button, Input, Tag, Dropdown } from 'antd';
import { PlusOutlined, SearchOutlined, MoreOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import MainLayout from '../components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'school';
  schoolName?: string;
  status: 'active' | 'inactive';
}

const Users: React.FC = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');

  const columns: ColumnsType<User> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        const colors: Record<string, string> = {
          admin: 'red',
          school: 'blue',
        };
        return <Tag color={colors[role]}>{role.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'School',
      dataIndex: 'schoolName',
      key: 'schoolName',
      render: (schoolName: string) => schoolName || '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? '✅ Active' : '❌ Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Dropdown
          menu={{
            items: [
              { key: 'view', icon: <EyeOutlined />, label: 'View Details' },
              { key: 'edit', icon: <EditOutlined />, label: 'Edit User' },
              { key: 'reset', label: 'Reset Password' },
              { type: 'divider' },
              { key: 'deactivate', label: 'Deactivate', danger: true },
            ],
          }}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  // Mock data - replace with actual API call
  const mockData: User[] = [
    {
      id: '1',
      name: 'System Administrator',
      email: 'admin@school.edu',
      role: 'admin',
      status: 'active',
    },
    {
      id: '2',
      name: 'Green Valley Staff',
      email: 'staff.greenvalley@school.edu',
      role: 'school',
      schoolName: 'Green Valley International School',
      status: 'active',
    },
    {
      id: '3',
      name: 'Sunrise Staff',
      email: 'staff.sunrise@school.edu',
      role: 'school',
      schoolName: 'Sunrise Elementary School',
      status: 'active',
    },
  ];

  return (
    <MainLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1>Users</h1>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/users/add')}>
            Add User
          </Button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="Search users..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ maxWidth: 400 }}
            allowClear
          />
        </div>

        <Table
          columns={columns}
          dataSource={mockData}
          rowKey="id"
          pagination={{ pageSize: 20 }}
        />
      </div>
    </MainLayout>
  );
};

export default Users;

