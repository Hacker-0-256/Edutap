import React from 'react';
import { Form, Input, Select, Button, Card, Space } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import MainLayout from '../components/layout/MainLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const { Option } = Select;

const AddEditMerchant: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const isSchoolStaff = user?.role === 'school';
  const isEdit = !!id;
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Merchant data:', values);
    // TODO: Call API
    navigate('/merchants');
  };

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

        <Card title={isEdit ? 'Edit Merchant' : 'Add Merchant'}>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Card title="Basic Information" style={{ marginBottom: 24 }}>
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please input merchant name!' }]}
              >
                <Input placeholder="Canteen A" />
              </Form.Item>

              <Form.Item
                name="type"
                label="Type"
                rules={[{ required: true, message: 'Please select type!' }]}
              >
                <Select placeholder="Select Type">
                  <Option value="canteen">Canteen</Option>
                  <Option value="store">Store</Option>
                  <Option value="cafeteria">Cafeteria</Option>
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
                <Input placeholder="Canteen Zone" />
              </Form.Item>

              <Form.Item name="building" label="Building">
                <Input placeholder="Main Building" />
              </Form.Item>

              <Form.Item name="room" label="Room">
                <Input placeholder="Canteen Hall" />
              </Form.Item>
            </Card>

            <Card title="Contact Information" style={{ marginBottom: 24 }}>
              <Form.Item name="managerName" label="Manager Name">
                <Input placeholder="Manager Name" />
              </Form.Item>

              <Form.Item name="phone" label="Phone">
                <Input placeholder="+250 788 123456" />
              </Form.Item>

              <Form.Item name="email" label="Email">
                <Input type="email" placeholder="canteen@school.edu" />
              </Form.Item>
            </Card>

            <Form.Item>
              <Space>
                <Button onClick={() => navigate('/merchants')}>Cancel</Button>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                  {isEdit ? 'Update Merchant' : 'Save Merchant'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AddEditMerchant;

