import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Table, Button, DatePicker, Space } from 'antd';
import { ArrowLeftOutlined, ExportOutlined } from '@ant-design/icons';
import MainLayout from '../components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { type Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

interface Transaction {
  id: string;
  time: string;
  studentName: string;
  amount: number;
  reference: string;
}

const MerchantSalesReport: React.FC = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([dayjs().subtract(7, 'day'), dayjs()]);

  const columns: ColumnsType<Transaction> = [
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Student',
      dataIndex: 'studentName',
      key: 'studentName',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `${amount.toLocaleString()} RWF`,
    },
    {
      title: 'Reference',
      dataIndex: 'reference',
      key: 'reference',
      render: (text: string) => <code>{text.substring(0, 10)}...</code>,
    },
  ];

  // Mock data
  const mockData: Transaction[] = [
    { id: '1', time: '10:30', studentName: 'John Doe', amount: 500, reference: 'TXN-123' },
    { id: '2', time: '10:25', studentName: 'Mary Smith', amount: 300, reference: 'TXN-456' },
  ];

  return (
    <MainLayout>
      <div>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/merchants')}
          style={{ marginBottom: 16 }}
        >
          Back to Merchants
        </Button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1>Sales Report - Canteen A</h1>
          <Space>
            <RangePicker value={dateRange} onChange={(dates) => setDateRange(dates as [Dayjs | null, Dayjs | null])} />
            <Button icon={<ExportOutlined />}>Export</Button>
          </Space>
        </div>

        <Card style={{ marginBottom: 24 }}>
          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Statistic title="Total Sales" value={45000} suffix="RWF" />
            </Col>
            <Col xs={24} sm={8}>
              <Statistic title="Transactions" value={120} />
            </Col>
            <Col xs={24} sm={8}>
              <Statistic title="Average Amount" value={375} suffix="RWF" />
            </Col>
          </Row>
        </Card>

        <Card title="Transaction List">
          <Table
            columns={columns}
            dataSource={mockData}
            rowKey="id"
            pagination={{ pageSize: 20 }}
          />
        </Card>
      </div>
    </MainLayout>
  );
};

export default MerchantSalesReport;

