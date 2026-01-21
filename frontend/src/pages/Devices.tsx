import React, { useState } from 'react';
import { Table, Button, Input, Tag, Badge, Dropdown, Alert } from 'antd';
import { PlusOutlined, SearchOutlined, MoreOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import MainLayout from '../components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { useAuth } from '../contexts/AuthContext';

interface Device {
  id: string;
  name: string;
  deviceId: string;
  type: string;
  status: 'online' | 'offline' | 'maintenance';
  battery: number;
  zone: string;
}

const Devices: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isSchoolStaff = user?.role === 'school';
  const [searchText, setSearchText] = useState('');

  const columns: ColumnsType<Device> = [
    {
      title: 'Name',
      key: 'name',
      render: (_, record) => (
        <div>
          <div style={{ cursor: 'pointer' }} onClick={() => navigate(`/devices/${record.id}`)}>
            {record.name}
          </div>
          <div style={{ fontSize: 12, color: '#8c8c8c' }}>{record.deviceId}</div>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const colors: Record<string, string> = {
          POS: 'blue',
          'Attendance Reader': 'green',
          'Canteen Reader': 'orange',
        };
        return <Tag color={colors[type]}>{type}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config: Record<string, { color: string; text: string }> = {
          online: { color: 'success', text: '✅ Online' },
          offline: { color: 'error', text: '❌ Offline' },
          maintenance: { color: 'warning', text: '⚠️ Maintenance' },
        };
        return <Tag color={config[status]?.color}>{config[status]?.text}</Tag>;
      },
    },
    {
      title: 'Battery',
      dataIndex: 'battery',
      key: 'battery',
      render: (battery: number) => {
        let color = '#52c41a';
        if (battery < 20) color = '#f5222d';
        else if (battery < 50) color = '#fa8c16';
        return <Badge count={battery} showZero style={{ backgroundColor: color }} />;
      },
    },
    {
      title: 'Zone',
      dataIndex: 'zone',
      key: 'zone',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              { key: 'view', icon: <EyeOutlined />, label: 'View Details', onClick: () => navigate(`/devices/${record.id}`) },
              { key: 'edit', icon: <EditOutlined />, label: 'Configure' },
            ],
          }}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  // Mock data
  const mockData: Device[] = [
    {
      id: '1',
      name: 'Main Canteen POS',
      deviceId: 'POS-001',
      type: 'POS',
      status: 'online',
      battery: 85,
      zone: 'Canteen',
    },
    {
      id: '2',
      name: 'Gate A Reader',
      deviceId: 'Reader-01',
      type: 'Attendance Reader',
      status: 'online',
      battery: 92,
      zone: 'Gate',
    },
    {
      id: '3',
      name: 'Gate B Reader',
      deviceId: 'Reader-02',
      type: 'Attendance Reader',
      status: 'online',
      battery: 15,
      zone: 'Gate',
    },
  ];

  return (
    <MainLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1>Devices</h1>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/devices/register')}>
            Register Device
          </Button>
        </div>

        {isSchoolStaff && user?.schoolName && (
          <Alert
            message={`Showing devices from ${user.schoolName} only`}
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="Search devices..."
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

export default Devices;

