import React, { useState } from 'react';
import { Table, Card, Row, Col, Statistic, Input, Button, Tag, Alert } from 'antd';
import { SearchOutlined, ExportOutlined } from '@ant-design/icons';
import MainLayout from '../components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { useAuth } from '../contexts/AuthContext';

interface Account {
  id: string;
  studentName: string;
  studentId: string;
  grade: string;
  balance: number;
  lastTopup: string;
  status: 'active' | 'low' | 'inactive';
}

const AccountBalances: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isSchoolStaff = user?.role === 'school';
  const [searchText, setSearchText] = useState('');

  const columns: ColumnsType<Account> = [
    {
      title: 'Student',
      key: 'student',
      render: (_, record) => (
        <div>
          <div style={{ cursor: 'pointer' }} onClick={() => navigate(`/accounts/${record.id}`)}>
            {record.studentName}
          </div>
          <div style={{ fontSize: 12, color: '#8c8c8c' }}>
            {record.studentId} - Grade {record.grade}
          </div>
        </div>
      ),
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      sorter: (a, b) => a.balance - b.balance,
      render: (balance: number) => {
        let color = '#52c41a';
        if (balance < 100) color = '#f5222d';
        else if (balance < 500) color = '#fa8c16';
        return <span style={{ color }}>{balance.toLocaleString()} RWF</span>;
      },
    },
    {
      title: 'Last Top-up',
      dataIndex: 'lastTopup',
      key: 'lastTopup',
      render: (text: string) => text || '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: Record<string, string> = {
          active: 'success',
          low: 'warning',
          inactive: 'default',
        };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
  ];

  // Mock data
  const mockData: Account[] = [
    {
      id: '1',
      studentName: 'John Doe',
      studentId: 'ST001',
      grade: '5A',
      balance: 2500,
      lastTopup: '2 days ago',
      status: 'active',
    },
    {
      id: '2',
      studentName: 'Mary Smith',
      studentId: 'ST002',
      grade: '5B',
      balance: 1200,
      lastTopup: '5 days ago',
      status: 'active',
    },
    {
      id: '3',
      studentName: 'Peter Jones',
      studentId: 'ST003',
      grade: '6A',
      balance: 0,
      lastTopup: '-',
      status: 'low',
    },
  ];

  return (
    <MainLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1>Account Balances</h1>
          <Button icon={<ExportOutlined />}>Export</Button>
        </div>

        {isSchoolStaff && user?.schoolName && (
          <Alert
            message={`Showing account balances from ${user.schoolName} only`}
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Card style={{ marginBottom: 24 }}>
          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Statistic title="Total Balance" value={125000} suffix="RWF" />
            </Col>
            <Col xs={24} sm={8}>
              <Statistic title="Accounts" value={245} />
            </Col>
            <Col xs={24} sm={8}>
              <Statistic title="Average Balance" value={510} suffix="RWF" />
            </Col>
          </Row>
        </Card>

        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="Search by student name or ID..."
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

export default AccountBalances;

