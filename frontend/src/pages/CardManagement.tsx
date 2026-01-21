import React, { useState } from 'react';
import { Card, Input, Button, Descriptions, Tag, Table, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import MainLayout from '../components/layout/MainLayout';
import type { ColumnsType } from 'antd/es/table';

interface Card {
  id: string;
  cardUID: string;
  studentName: string;
  studentId: string;
  status: 'active' | 'lost' | 'stolen' | 'deactivated';
  assignedDate: string;
}

const CardManagement: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const columns: ColumnsType<Card> = [
    {
      title: 'Card UID',
      dataIndex: 'cardUID',
      key: 'cardUID',
      render: (text: string) => <code>{text}</code>,
    },
    {
      title: 'Student',
      key: 'student',
      render: (_, record) => (
        <div>
          <div>{record.studentName}</div>
          <div style={{ fontSize: 12, color: '#8c8c8c' }}>{record.studentId}</div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config: Record<string, { color: string; text: string }> = {
          active: { color: 'success', text: '✅ Active' },
          lost: { color: 'warning', text: '⚠️ Lost' },
          stolen: { color: 'error', text: '🔴 Stolen' },
          deactivated: { color: 'default', text: '⚫ Deactivated' },
        };
        return <Tag color={config[status]?.color}>{config[status]?.text}</Tag>;
      },
    },
    {
      title: 'Assigned',
      dataIndex: 'assignedDate',
      key: 'assignedDate',
    },
  ];

  // Mock data
  const mockData: Card[] = [
    {
      id: '1',
      cardUID: 'ABC123456789',
      studentName: 'John Doe',
      studentId: 'ST001',
      status: 'active',
      assignedDate: '2024-11-01',
    },
    {
      id: '2',
      cardUID: 'DEF987654321',
      studentName: 'Mary Smith',
      studentId: 'ST002',
      status: 'lost',
      assignedDate: '2024-12-01',
    },
  ];

  return (
    <MainLayout>
      <div>
        <h1 style={{ marginBottom: 24 }}>Card Management</h1>

        <Card style={{ marginBottom: 24 }}>
          <Input
            placeholder="Search by Card UID or Student..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            size="large"
            allowClear
          />
        </Card>

        {selectedCard && (
          <Card title="Card Details" style={{ marginBottom: 24 }}>
            <Descriptions column={1}>
              <Descriptions.Item label="Card UID">{selectedCard.cardUID}</Descriptions.Item>
              <Descriptions.Item label="Student">{selectedCard.studentName} ({selectedCard.studentId})</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={selectedCard.status === 'active' ? 'success' : 'default'}>
                  {selectedCard.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Assigned">{selectedCard.assignedDate}</Descriptions.Item>
            </Descriptions>
            <Space>
              <Button danger>Deactivate</Button>
              <Button>Reactivate</Button>
              <Button>Replace Card</Button>
            </Space>
          </Card>
        )}

        <Card title="All Cards">
          <Table
            columns={columns}
            dataSource={mockData}
            rowKey="id"
            onRow={(record) => ({
              onClick: () => setSelectedCard(record),
              style: { cursor: 'pointer' },
            })}
            pagination={{ pageSize: 20 }}
          />
        </Card>
      </div>
    </MainLayout>
  );
};

export default CardManagement;


