import React from 'react';
import { Card, Descriptions, Button, Space, Avatar } from 'antd';
import { PrinterOutlined, RollbackOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import MainLayout from '../components/layout/MainLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { getPhotoUrl, getDefaultAvatar } from '../utils/photo';

const TransactionDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Mock data - replace with actual API call
  const transaction = {
    id: id,
    reference: 'TXN-1234567890-abc123',
    status: 'completed',
    type: 'Purchase',
    date: '2024-12-03 10:30 AM',
    amount: 500,
    merchant: 'Canteen A',
    location: 'Main Canteen',
    device: 'POS-001',
    student: {
      id: '1',
      name: 'John Doe',
      studentId: 'ST001',
      grade: '5A',
      photo: '/uploads/students/student-123.jpg',
    },
    account: {
      balanceBefore: 3000,
      amount: -500,
      balanceAfter: 2500,
    },
  };

  const photoUrl = transaction.student.photo
    ? getPhotoUrl(transaction.student.photo)
    : getDefaultAvatar('John', 'Doe');

  return (
    <MainLayout>
      <div>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/payments')}
          style={{ marginBottom: 16 }}
        >
          Back to Transactions
        </Button>

        <Card title="Transaction Details">
          <Descriptions title="Transaction Information" bordered column={1} style={{ marginBottom: 24 }}>
            <Descriptions.Item label="Reference">{transaction.reference}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <span style={{ color: '#52c41a' }}>✅ {transaction.status.toUpperCase()}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Type">{transaction.type}</Descriptions.Item>
            <Descriptions.Item label="Date">{transaction.date}</Descriptions.Item>
            <Descriptions.Item label="Amount">{transaction.amount.toLocaleString()} RWF</Descriptions.Item>
            <Descriptions.Item label="Merchant">{transaction.merchant}</Descriptions.Item>
            <Descriptions.Item label="Location">{transaction.location}</Descriptions.Item>
            <Descriptions.Item label="Device">{transaction.device}</Descriptions.Item>
          </Descriptions>

          <Card title="Student Information" style={{ marginBottom: 24 }}>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <Avatar src={photoUrl} size={150} />
            </div>
            <Descriptions column={1}>
              <Descriptions.Item label="Name">{transaction.student.name}</Descriptions.Item>
              <Descriptions.Item label="Student ID">{transaction.student.studentId}</Descriptions.Item>
              <Descriptions.Item label="Grade">{transaction.student.grade}</Descriptions.Item>
            </Descriptions>
            <Button type="link" onClick={() => navigate(`/students/edit/${transaction.student.id}`)}>
              View Student Profile →
            </Button>
          </Card>

          <Card title="Account Information" style={{ marginBottom: 24 }}>
            <Descriptions column={1}>
              <Descriptions.Item label="Balance Before">
                {transaction.account.balanceBefore.toLocaleString()} RWF
              </Descriptions.Item>
              <Descriptions.Item label="Amount">
                <span style={{ color: '#f5222d' }}>
                  {transaction.account.amount.toLocaleString()} RWF
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Balance After">
                <span style={{ color: '#52c41a', fontSize: 18 }}>
                  {transaction.account.balanceAfter.toLocaleString()} RWF
                </span>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Space>
            <Button icon={<PrinterOutlined />}>Print Receipt</Button>
            <Button icon={<RollbackOutlined />} danger>Refund Transaction</Button>
            <Button onClick={() => navigate('/payments')}>Close</Button>
          </Space>
        </Card>
      </div>
    </MainLayout>
  );
};

export default TransactionDetails;

