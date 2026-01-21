import React, { useState } from 'react';
import { Table, DatePicker, Select, Button, Card, Space, Tag } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import MainLayout from '../components/layout/MainLayout';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { type Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

interface LogEntry {
  id: string;
  time: string;
  device: string;
  eventType: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
}

const SystemLogs: React.FC = () => {
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([dayjs().subtract(7, 'day'), dayjs()]);
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const columns: ColumnsType<LogEntry> = [
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      sorter: (a, b) => a.time.localeCompare(b.time),
    },
    {
      title: 'Device',
      dataIndex: 'device',
      key: 'device',
    },
    {
      title: 'Event Type',
      dataIndex: 'eventType',
      key: 'eventType',
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: string) => {
        const colors: Record<string, string> = {
          low: 'default',
          medium: 'warning',
          high: 'error',
        };
        return <Tag color={colors[severity]}>{severity.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
    },
  ];

  // Mock data
  const mockData: LogEntry[] = [
    {
      id: '1',
      time: '10:30',
      device: 'POS-001',
      eventType: 'scan_success',
      severity: 'low',
      message: 'Payment: 500 RWF',
    },
    {
      id: '2',
      time: '10:25',
      device: 'Reader-01',
      eventType: 'error',
      severity: 'high',
      message: 'Connection timeout',
    },
  ];

  return (
    <MainLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1>System Logs</h1>
          <Button icon={<ExportOutlined />}>Export</Button>
        </div>

        <Card style={{ marginBottom: 24 }}>
          <Space>
            <RangePicker
              value={dateRange}
              onChange={(dates) => setDateRange(dates as [Dayjs | null, Dayjs | null])}
            />
            <Select
              value={severityFilter}
              onChange={setSeverityFilter}
              style={{ width: 150 }}
            >
              <Select.Option value="all">All Severities</Select.Option>
              <Select.Option value="low">Low</Select.Option>
              <Select.Option value="medium">Medium</Select.Option>
              <Select.Option value="high">High</Select.Option>
            </Select>
            <Button type="primary">Apply Filters</Button>
            <Button onClick={() => {
              setDateRange([dayjs().subtract(7, 'day'), dayjs()]);
              setSeverityFilter('all');
            }}>Reset</Button>
          </Space>
        </Card>

        <Card>
          <div style={{ marginBottom: 16 }}>
            <Space>
              <span>Total: 12,450</span>
              <span>Errors: 45</span>
              <span>Warnings: 120</span>
            </Space>
          </div>
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

export default SystemLogs;


