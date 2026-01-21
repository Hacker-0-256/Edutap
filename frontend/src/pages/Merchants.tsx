import React, { useState } from 'react';
import { Table, Button, Input, Tag, Dropdown, Alert } from 'antd';
import { PlusOutlined, SearchOutlined, MoreOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import MainLayout from '../components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { useAuth } from '../contexts/AuthContext';

interface Merchant {
  id: string;
  name: string;
  type: string;
  salesToday: number;
  totalSales: number;
  status: 'active' | 'inactive';
}

const Merchants: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isSchoolStaff = user?.role === 'school';
  const [searchText, setSearchText] = useState('');

  const columns: ColumnsType<Merchant> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record) => (
        <span style={{ cursor: 'pointer' }} onClick={() => navigate(`/merchants/${record.id}/sales`)}>
          {text}
        </span>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const colors: Record<string, string> = {
          Canteen: 'blue',
          Store: 'green',
          Cafeteria: 'orange',
        };
        return <Tag color={colors[type]}>{type}</Tag>;
      },
    },
    {
      title: 'Sales Today',
      dataIndex: 'salesToday',
      key: 'salesToday',
      sorter: (a, b) => a.salesToday - b.salesToday,
      render: (amount: number) => `${amount.toLocaleString()} RWF`,
    },
    {
      title: 'Total Sales',
      dataIndex: 'totalSales',
      key: 'totalSales',
      sorter: (a, b) => a.totalSales - b.totalSales,
      render: (amount: number) => `${amount.toLocaleString()} RWF`,
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
              { key: 'view', icon: <EyeOutlined />, label: 'View Sales Report', onClick: () => navigate(`/merchants/${record.id}/sales`) },
              { key: 'edit', icon: <EditOutlined />, label: 'Edit Merchant', onClick: () => navigate(`/merchants/edit/${record.id}`) },
            ],
          }}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  // Mock data
  const mockData: Merchant[] = [
    {
      id: '1',
      name: 'Canteen A',
      type: 'Canteen',
      salesToday: 12500,
      totalSales: 450000,
      status: 'active',
    },
    {
      id: '2',
      name: 'Store B',
      type: 'Store',
      salesToday: 3200,
      totalSales: 120000,
      status: 'active',
    },
  ];

  return (
    <MainLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1>Merchants</h1>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/merchants/add')}>
            Add Merchant
          </Button>
        </div>

        {isSchoolStaff && user?.schoolName && (
          <Alert
            message={`Showing merchants from ${user.schoolName} only`}
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="Search merchants..."
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

export default Merchants;

