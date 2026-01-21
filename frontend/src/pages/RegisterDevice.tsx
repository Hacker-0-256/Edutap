import React from 'react';
import { Form, Input, Select, Button, Card, Space } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import MainLayout from '../components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const { Option } = Select;

const RegisterDevice: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isSchoolStaff = user?.role === 'school';
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Device registration:', values);
    // TODO: Call API to register device
    navigate('/devices');
  };

  return (
    <MainLayout>
      <div>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/devices')}
          style={{ marginBottom: 16 }}
        >
          Back to Devices
        </Button>

        <Card title="Register Device">
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Card title="Device Information" style={{ marginBottom: 24 }}>
              <Form.Item
                name="deviceId"
                label="Device ID"
                rules={[{ required: true, message: 'Please input device ID!' }]}
              >
                <Input placeholder="POS-001" />
              </Form.Item>

              <Form.Item
                name="name"
                label="Device Name"
                rules={[{ required: true, message: 'Please input device name!' }]}
              >
                <Input placeholder="Main Canteen POS" />
              </Form.Item>

              <Form.Item
                name="deviceType"
                label="Device Type"
                rules={[{ required: true, message: 'Please select device type!' }]}
              >
                <Select placeholder="Select Type">
                  <Option value="pos">POS</Option>
                  <Option value="attendance_reader">Attendance Reader</Option>
                  <Option value="canteen_reader">Canteen Reader</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="schoolId"
                label="School"
                rules={[{ required: true, message: 'Please select school!' }]}
              >
                {isSchoolStaff ? (
                  <Input disabled value={user?.schoolName || 'Your School'} />
                ) : (
                  <Select placeholder="Select School">
                    <Option value="6942c83c61e18873521275bb">Sunrise Elementary School</Option>
                    <Option value="6942c83c61e18873521275bc">Green Valley International School</Option>
                  </Select>
                )}
              </Form.Item>
            </Card>

            <Card title="Location Information" style={{ marginBottom: 24 }}>
              <Form.Item name="zone" label="Zone">
                <Input placeholder="Canteen" />
              </Form.Item>

              <Form.Item name="building" label="Building">
                <Input placeholder="Main Building" />
              </Form.Item>

              <Form.Item name="room" label="Room">
                <Input placeholder="Canteen Hall" />
              </Form.Item>
            </Card>

            <Form.Item>
              <Space>
                <Button onClick={() => navigate('/devices')}>Cancel</Button>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                  Register Device
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </MainLayout>
  );
};

export default RegisterDevice;

