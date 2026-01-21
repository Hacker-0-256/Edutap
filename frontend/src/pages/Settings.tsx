import React from 'react';
import { Card, Form, Input, Select, Button, Tabs, Switch, Space, Alert } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../contexts/AuthContext';

const { Option } = Select;
const { TabPane } = Tabs;

const Settings: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Settings:', values);
    // TODO: Call API to save settings
  };

  return (
    <MainLayout>
      <div>
        <h1 style={{ marginBottom: 24 }}>Settings</h1>

        {!isAdmin && (
          <Alert
            message="School Staff Settings"
            description="You can only modify settings for your school. System-wide settings are managed by administrators."
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        <Tabs defaultActiveKey="general">
          <TabPane tab="General" key="general">
            <Card>
              <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item name="schoolName" label="School Name">
                  <Input placeholder="Green Valley School" />
                </Form.Item>

                <Form.Item name="currency" label="Default Currency">
                  <Select defaultValue="rwf">
                    <Option value="rwf">RWF</Option>
                    <Option value="usd">USD</Option>
                  </Select>
                </Form.Item>

                <Form.Item name="lowBalanceThreshold" label="Low Balance Threshold">
                  <Input type="number" placeholder="500" suffix="RWF" />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                    Save Changes
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </TabPane>

          <TabPane tab="SMS" key="sms">
            <Card>
              <Form form={form} layout="vertical">
                <Form.Item name="smsProvider" label="SMS Provider">
                  <Select defaultValue="twilio">
                    <Option value="twilio">Twilio</Option>
                    <Option value="africas_talking">Africa's Talking</Option>
                  </Select>
                </Form.Item>

                <Form.Item name="apiKey" label="API Key">
                  <Input.Password placeholder="••••••••••••••••" />
                </Form.Item>

                <Form.Item>
                  <Space>
                    <Button type="primary">Test SMS</Button>
                    <Button>Save</Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>
          </TabPane>

          <TabPane tab="Notifications" key="notifications">
            <Card>
              <Form layout="vertical">
                <Form.Item label="Email Notifications">
                  <Switch defaultChecked />
                </Form.Item>

                <Form.Item label="SMS Notifications">
                  <Switch defaultChecked />
                </Form.Item>

                <Form.Item label="Attendance Alerts">
                  <Switch defaultChecked />
                </Form.Item>

                <Form.Item label="Payment Alerts">
                  <Switch defaultChecked />
                </Form.Item>

                <Form.Item label="Low Balance Alerts">
                  <Switch defaultChecked />
                </Form.Item>

                <Form.Item>
                  <Button type="primary">Save</Button>
                </Form.Item>
              </Form>
            </Card>
          </TabPane>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;

