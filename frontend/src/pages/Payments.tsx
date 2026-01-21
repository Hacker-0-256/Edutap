import React, { useState } from 'react';
import { Table, Card, Row, Col, Statistic, DatePicker, Select, Button, Tag, Space, Alert } from 'antd';
import { DollarOutlined, ExportOutlined, EyeOutlined } from '@ant-design/icons';
import MainLayout from '../components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { type Dayjs } from 'dayjs';
import { useAuth } from '../contexts/AuthContext';

const { RangePicker } = DatePicker;

interface Transaction {
  id: string;
  time: string;
  studentName: string;
  amount: number;
  merchant: string;
  reference: string;
  status: 'completed' | 'pending' | 'failed';
}

const Payments: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isSchoolStaff = user?.role === 'school';
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([dayjs().subtract(7, 'day'), dayjs()]);

  const columns: ColumnsType<Transaction> = [
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      sorter: (a, b) => a.time.localeCompare(b.time),
    },
    {
      title: 'Student',
      dataIndex: 'studentName',
      key: 'studentName',
      render: (text: string, record) => (
        <span style={{ cursor: 'pointer' }} onClick={() => navigate(`/transactions/${record.id}`)}>
          {text}
        </span>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      sorter: (a, b) => a.amount - b.amount,
      render: (amount: number) => (
        <span style={{ color: '#52c41a' }}>{amount.toLocaleString()} RWF</span>
      ),
    },
    {
      title: 'Merchant',
      dataIndex: 'merchant',
      key: 'merchant',
    },
    {
      title: 'Reference',
      dataIndex: 'reference',
      key: 'reference',
      render: (text: string) => <code>{text.substring(0, 10)}...</code>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: Record<string, string> = {
          completed: 'success',
          pending: 'warning',
          failed: 'error',
        };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/transactions/${record.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  // Mock data
  const mockData: Transaction[] = [
    {
      id: '1',
      time: '10:30',
      studentName: 'John Doe',
      amount: 500,
      merchant: 'Canteen A',
      reference: 'TXN-1234567890-abc123',
      status: 'completed',
    },
    {
      id: '2',
      time: '10:25',
      studentName: 'Mary Smith',
      amount: 300,
      merchant: 'Store B',
      reference: 'TXN-0987654321-def456',
      status: 'completed',
    },
  ];

  return (
    <MainLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1>Transactions</h1>
          <Space>
            <RangePicker value={dateRange} onChange={(dates) => setDateRange(dates as [Dayjs | null, Dayjs | null])} />
            <Select placeholder="All Merchants" style={{ width: 150 }}>
              <Select.Option value="all">All Merchants</Select.Option>
            </Select>
            <Button icon={<ExportOutlined />}>Export</Button>
          </Space>
        </div>

        {isSchoolStaff && user?.schoolName && (
          <Alert
            message={`Showing transactions from ${user.schoolName} only`}
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Card style={{ marginBottom: 24 }}>
          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Statistic
                title="Today"
                value={12500}
                prefix={<DollarOutlined />}
                suffix="RWF"
                valueStyle={{ color: '#1890ff' }}
              />
            </Col>
            <Col xs={24} sm={8}>
              <Statistic
                title="This Week"
                value={45000}
                prefix={<DollarOutlined />}
                suffix="RWF"
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
            <Col xs={24} sm={8}>
              <Statistic
                title="This Month"
                value={180000}
                prefix={<DollarOutlined />}
                suffix="RWF"
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
          </Row>
        </Card>

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

export default Payments;

