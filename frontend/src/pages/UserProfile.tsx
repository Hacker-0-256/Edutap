import React from 'react';
import { Card, Form, Input, Button, Avatar } from 'antd';
import { UserOutlined, SaveOutlined, LockOutlined } from '@ant-design/icons';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../contexts/AuthContext';

const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  React.useEffect(() => {
    if (user) {
      form.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    }
  }, [user, form]);

  const onProfileFinish = (values: any) => {
    console.log('Update profile:', values);
    // TODO: Call API to update profile
  };

  const onPasswordFinish = (values: any) => {
    console.log('Change password:', values);
    // TODO: Call API to change password
  };

  return (
    <MainLayout>
      <div>
        <h1 style={{ marginBottom: 24 }}>Profile</h1>

        <Card title="Profile Information" style={{ marginBottom: 24 }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Avatar size={100} icon={<UserOutlined />} />
          </div>

          <Form form={form} layout="vertical" onFinish={onProfileFinish}>
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[{ required: true, message: 'Please input first name!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[{ required: true, message: 'Please input last name!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item name="email" label="Email">
              <Input disabled />
            </Form.Item>

            <Form.Item name="role" label="Role">
              <Input disabled value={user?.role} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                Save Changes
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card title="Change Password">
          <Form form={passwordForm} layout="vertical" onFinish={onPasswordFinish}>
            <Form.Item
              name="currentPassword"
              label="Current Password"
              rules={[{ required: true, message: 'Please input current password!' }]}
            >
              <Input.Password prefix={<LockOutlined />} />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[{ required: true, message: 'Please input new password!' }]}
            >
              <Input.Password prefix={<LockOutlined />} />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm New Password"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Please confirm new password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<LockOutlined />}>
                Change Password
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </MainLayout>
  );
};

export default UserProfile;

