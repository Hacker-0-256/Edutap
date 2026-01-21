import React from 'react';
import { Card, Descriptions, Button, Table, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import MainLayout from '../components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';

interface Transaction {
  id: string;
  date: string;
  type: string;
  amount: number;
  balanceAfter: number;
}

const AccountDetails: React.FC = () => {
  const navigate = useNavigate();

  const transactionColumns: ColumnsType<Transaction> = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const colors: Record<string, string> = {
          Purchase: 'red',
          'Top-up': 'green',
          Refund: 'blue',
        };
        return <span style={{ color: colors[type] || 'black' }}>{type}</span>;
      },
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => {
        const sign = amount > 0 ? '+' : '';
        const color = amount > 0 ? '#52c41a' : '#f5222d';
        return <span style={{ color }}>{sign}{amount.toLocaleString()} RWF</span>;
      },
    },
    {
      title: 'Balance After',
      dataIndex: 'balanceAfter',
      key: 'balanceAfter',
      render: (balance: number) => `${balance.toLocaleString()} RWF`,
    },
  ];

  // Mock data
  const transactions: Transaction[] = [
    { id: '1', date: '2024-12-03', type: 'Purchase', amount: -500, balanceAfter: 2500 },
    { id: '2', date: '2024-12-02', type: 'Top-up', amount: 2000, balanceAfter: 3000 },
    { id: '3', date: '2024-12-01', type: 'Purchase', amount: -300, balanceAfter: 1000 },
  ];

  return (
    <MainLayout>
      <div>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/accounts')}
          style={{ marginBottom: 16 }}
        >
          Back to Accounts
        </Button>

        <Card title="Account Summary" style={{ marginBottom: 24 }}>
          <Descriptions column={2}>
            <Descriptions.Item label="Current Balance">
              <span style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                2,500 RWF
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <span style={{ color: '#52c41a' }}>✅ Active</span>
            </Descriptions.Item>
            <Descriptions.Item label="Total Deposits">10,000 RWF</Descriptions.Item>
            <Descriptions.Item label="Total Withdrawals">7,500 RWF</Descriptions.Item>
            <Descriptions.Item label="Net Balance">2,500 RWF</Descriptions.Item>
          </Descriptions>
        </Card>

        <Card
          title="Transaction History"
          extra={
            <Space>
              <Button onClick={() => navigate('/payments')}>View All Transactions</Button>
            </Space>
          }
        >
          <Table
            columns={transactionColumns}
            dataSource={transactions}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </div>
    </MainLayout>
  );
};

export default AccountDetails;

