import React from 'react';
import { Row, Col, Card, Statistic, Alert, Button } from 'antd';
import {
  UserOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  MobileOutlined,
  BankOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';
  const isSchoolStaff = user?.role === 'school';

  return (
    <MainLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1>Dashboard</h1>
          {isSchoolStaff && user?.schoolName && (
            <Alert
              message={`Viewing data for: ${user.schoolName}`}
              type="info"
              showIcon
              style={{ maxWidth: 400 }}
            />
          )}
        </div>
        
        {isAdmin && (
          <Alert
            message="Admin View"
            description="You have full access to all schools and system features."
            type="success"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        {isSchoolStaff && (
          <Alert
            message="School Staff View"
            description={`You are viewing data for ${user?.schoolName || 'your school'} only.`}
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Students"
                value={isAdmin ? 245 : 120}
                prefix={<UserOutlined />}
                suffix="Active"
                valueStyle={{ color: '#1890ff' }}
              />
              <div style={{ marginTop: 8, fontSize: 12, color: '#52c41a' }}>
                {isAdmin ? '+12% from last month' : 'Your school only'}
              </div>
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Attendance"
                value={89}
                prefix={<CheckCircleOutlined />}
                suffix="% Today"
                valueStyle={{ color: '#52c41a' }}
              />
              <div style={{ marginTop: 8, fontSize: 12, color: '#52c41a' }}>
                +5% from yesterday
              </div>
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Payments"
                value={isAdmin ? 12500 : 6200}
                prefix={<DollarOutlined />}
                suffix="RWF"
                valueStyle={{ color: '#52c41a' }}
              />
              <div style={{ marginTop: 8, fontSize: 12, color: '#52c41a' }}>
                {isAdmin ? '+8% from yesterday' : 'Today'}
              </div>
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Devices"
                value={isAdmin ? 8 : 4}
                prefix={<MobileOutlined />}
                suffix="Online"
                valueStyle={{ color: '#1890ff' }}
              />
              <div style={{ marginTop: 8, fontSize: 12, color: '#fa8c16' }}>
                {isAdmin ? '2 Low Battery' : '1 Low Battery'}
              </div>
            </Card>
          </Col>
          
          {isAdmin && (
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Schools"
                  value={2}
                  prefix={<BankOutlined />}
                  suffix="Active"
                  valueStyle={{ color: '#1890ff' }}
                />
                <div style={{ marginTop: 8, fontSize: 12, color: '#52c41a' }}>
                  All schools
                </div>
              </Card>
            </Col>
          )}
        </Row>
        
        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          <Col xs={24} lg={16}>
            <Card title="Today's Attendance (Real-time)" style={{ height: 400 }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <p style={{ color: '#8c8c8c' }}>Chart will be implemented here</p>
              </div>
            </Card>
          </Col>
          
          <Col xs={24} lg={8}>
            <Card title="Quick Actions" style={{ height: 400 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Button
                  type="primary"
                  size="large"
                  icon={<PlusOutlined />}
                  onClick={() => navigate('/students/add')}
                  block
                  style={{ height: 60, fontSize: 16 }}
                >
                  Register New Student
                </Button>
                <Button
                  size="large"
                  icon={<UserOutlined />}
                  onClick={() => navigate('/students')}
                  block
                >
                  View All Students
                </Button>
                <Button
                  size="large"
                  icon={<CheckCircleOutlined />}
                  onClick={() => navigate('/attendance')}
                  block
                >
                  Monitor Attendance
                </Button>
                <Button
                  size="large"
                  icon={<DollarOutlined />}
                  onClick={() => navigate('/payments')}
                  block
                >
                  View Transactions
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

export default Dashboard;

