import React, { useState } from 'react';
import { Table, Button, Input, Tag, Dropdown } from 'antd';
import { PlusOutlined, SearchOutlined, MoreOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import MainLayout from '../components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';

interface School {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
}

const Schools: React.FC = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');

  const columns: ColumnsType<School> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record) => (
        <span style={{ cursor: 'pointer' }} onClick={() => navigate(`/schools/${record.id}`)}>
          {text}
        </span>
      ),
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
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
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              { key: 'view', icon: <EyeOutlined />, label: 'View Details', onClick: () => navigate(`/schools/${record.id}`) },
              { key: 'edit', icon: <EditOutlined />, label: 'Edit School' },
            ],
          }}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  // Mock data - replace with actual API call
  const mockData: School[] = [
    {
      id: '1',
      name: 'Green Valley International School',
      address: '123 Education Street',
      phone: '+1-555-0101',
      email: 'info@greenvalley.edu',
      status: 'active',
    },
    {
      id: '2',
      name: 'Sunrise Elementary School',
      address: '456 Learning Avenue',
      phone: '+1-555-0102',
      email: 'contact@sunrise.edu',
      status: 'active',
    },
  ];

  return (
    <MainLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1>Schools</h1>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/schools/add')}>
            Add School
          </Button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="Search schools..."
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

export default Schools;

