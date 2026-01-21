import React from 'react';
import { Card, Descriptions, Button, Tag, Progress } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import MainLayout from '../components/layout/MainLayout';
import { useNavigate, useParams } from 'react-router-dom';

const DeviceDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Mock data
  const device = {
    id: id,
    name: 'Main Canteen POS',
    deviceId: 'POS-001',
    type: 'POS',
    status: 'online',
    healthScore: 95,
    lastSeen: '2 minutes ago',
    battery: 85,
    signal: 92,
    temperature: 25,
    totalScans: 1245,
    successful: 1200,
    failed: 45,
    successRate: 96,
    uptime: 120,
    location: {
      zone: 'Canteen',
      building: 'Main Building',
      room: 'Canteen Hall',
    },
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

        <Card title="Device Overview" style={{ marginBottom: 24 }}>
          <Descriptions column={2}>
            <Descriptions.Item label="Name">{device.name}</Descriptions.Item>
            <Descriptions.Item label="Device ID">{device.deviceId}</Descriptions.Item>
            <Descriptions.Item label="Type">
              <Tag color="blue">{device.type}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color="success">✅ {device.status.toUpperCase()}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Health Score">
              <Progress percent={device.healthScore} status="active" />
            </Descriptions.Item>
            <Descriptions.Item label="Last Seen">{device.lastSeen}</Descriptions.Item>
          </Descriptions>
        </Card>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <Card title="Device Metrics">
            <div style={{ marginBottom: 16 }}>
              <div>Battery: {device.battery}%</div>
              <Progress percent={device.battery} status={device.battery < 20 ? 'exception' : 'active'} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <div>Signal: {device.signal}%</div>
              <Progress percent={device.signal} status="active" />
            </div>
            <div>Temperature: {device.temperature}°C</div>
          </Card>

          <Card title="Statistics">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Total Scans">{device.totalScans}</Descriptions.Item>
              <Descriptions.Item label="Successful">{device.successful}</Descriptions.Item>
              <Descriptions.Item label="Failed">{device.failed}</Descriptions.Item>
              <Descriptions.Item label="Success Rate">{device.successRate}%</Descriptions.Item>
              <Descriptions.Item label="Uptime">{device.uptime} hours</Descriptions.Item>
            </Descriptions>
          </Card>
        </div>

        <Card title="Location">
          <Descriptions column={1}>
            <Descriptions.Item label="Zone">{device.location.zone}</Descriptions.Item>
            <Descriptions.Item label="Building">{device.location.building}</Descriptions.Item>
            <Descriptions.Item label="Room">{device.location.room}</Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
    </MainLayout>
  );
};

export default DeviceDetails;

