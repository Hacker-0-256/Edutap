import React, { useState, useEffect } from 'react';
import { Card, Button, Space, Avatar, Typography, Divider, message, Spin } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import MainLayout from '../components/layout/MainLayout';
import { getPhotoUrl, getDefaultAvatar } from '../utils/photo';
import { useNavigate } from 'react-router-dom';
import './PaymentVerification.css';

const { Title, Text } = Typography;

interface PaymentData {
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentId: string;
    grade: string;
    class: string;
    photo?: string;
    accountBalance: number;
  };
  transaction: {
    amount: number;
    balanceAfter: number;
  };
  merchant: {
    name: string;
    type: string;
  };
}

const PaymentVerification: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  // In a real implementation, this would come from:
  // 1. Socket.io event when card is tapped
  // 2. API call to get payment data
  // For now, using mock data for demonstration
  useEffect(() => {
    // Simulate receiving payment data (would come from Socket.io or API)
    const mockData: PaymentData = {
      student: {
        id: '123',
        firstName: 'Alice',
        lastName: 'Johnson',
        studentId: 'STU002',
        grade: '6',
        class: 'B',
        photo: '/uploads/students/student-1234567890-abc123.jpg',
        accountBalance: 2000,
      },
      transaction: {
        amount: 500,
        balanceAfter: 1500,
      },
      merchant: {
        name: 'Main Canteen',
        type: 'Canteen',
      },
    };
    setPaymentData(mockData);
  }, []);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      // In real implementation, this would call the backend to confirm payment
      // await paymentService.confirmPayment(transactionId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('Payment confirmed successfully!');
      
      // Auto-close after 2 seconds
      setTimeout(() => {
        navigate('/payments');
      }, 2000);
    } catch (error) {
      message.error('Failed to confirm payment');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // In real implementation, this would abort the transaction
    navigate('/payments');
  };

  if (!paymentData) {
    return (
      <MainLayout>
        <div className="payment-verification-container">
          <Spin size="large" tip="Waiting for card tap..." />
        </div>
      </MainLayout>
    );
  }

  const { student, transaction, merchant } = paymentData;
  const photoUrl = student.photo ? getPhotoUrl(student.photo) : getDefaultAvatar(student.firstName, student.lastName);

  return (
    <MainLayout>
      <div className="payment-verification-container">
        <Card className="verification-card">
          <div className="verification-header">
            <Title level={2}>PAYMENT VERIFICATION</Title>
          </div>

          <div className="student-identity-section">
            <Title level={4}>Student Identity Verification</Title>
            <div className="photo-container">
              <Avatar
                src={photoUrl}
                size={300}
                style={{ border: '4px solid #1890ff', borderRadius: '50%' }}
              />
            </div>
            <div className="student-info">
              <Title level={3} style={{ margin: '16px 0 8px' }}>
                {student.firstName} {student.lastName}
              </Title>
              <Text type="secondary" style={{ fontSize: 16 }}>
                Student ID: {student.studentId}
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: 16 }}>
                Grade: {student.grade} - Class: {student.class}
              </Text>
            </div>
          </div>

          <Divider />

          <div className="transaction-details-section">
            <Title level={4}>Transaction Details</Title>
            <div className="transaction-info">
              <div className="info-row">
                <Text strong>Amount:</Text>
                <Text style={{ fontSize: 18, color: '#f5222d' }}>-{transaction.amount.toLocaleString()} RWF</Text>
              </div>
              <div className="info-row">
                <Text strong>Current Balance:</Text>
                <Text>{student.accountBalance.toLocaleString()} RWF</Text>
              </div>
              <div className="info-row">
                <Text strong>New Balance:</Text>
                <Text style={{ fontSize: 18, color: '#52c41a' }}>
                  {transaction.balanceAfter.toLocaleString()} RWF
                </Text>
              </div>
              <Divider style={{ margin: '16px 0' }} />
              <div className="info-row">
                <Text strong>Merchant:</Text>
                <Text>{merchant.name}</Text>
              </div>
              <div className="info-row">
                <Text strong>Location:</Text>
                <Text>{merchant.name}</Text>
              </div>
              <div className="info-row">
                <Text strong>Time:</Text>
                <Text>{new Date().toLocaleTimeString()}</Text>
              </div>
            </div>
          </div>

          <Divider />

          <div className="verification-actions">
            <Space size="large">
              <Button
                type="primary"
                size="large"
                icon={<CheckCircleOutlined />}
                onClick={handleConfirm}
                loading={loading}
                style={{ minWidth: 200, height: 50 }}
              >
                Confirm Payment
              </Button>
              <Button
                danger
                size="large"
                icon={<CloseCircleOutlined />}
                onClick={handleCancel}
                disabled={loading}
                style={{ minWidth: 200, height: 50 }}
              >
                Cancel
              </Button>
            </Space>
          </div>

          <div className="verification-note">
            <Text type="secondary" style={{ fontSize: 12 }}>
              ℹ️ Verify student identity before confirming payment
            </Text>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default PaymentVerification;

