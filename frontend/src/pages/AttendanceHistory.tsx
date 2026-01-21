import React, { useState } from 'react';
import { Table, DatePicker, Select, Button, Card, Space } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import MainLayout from '../components/layout/MainLayout';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { type Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

interface AttendanceRecord {
  id: string;
  date: string;
  studentName: string;
  time: string;
  location: string;
}

const AttendanceHistory: React.FC = () => {
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([dayjs().subtract(7, 'day'), dayjs()]);
  const [selectedStudent, setSelectedStudent] = useState<string>('all');

  const columns: ColumnsType<AttendanceRecord> = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => a.date.localeCompare(b.date),
    },
    {
      title: 'Student',
      dataIndex: 'studentName',
      key: 'studentName',
      sorter: (a, b) => a.studentName.localeCompare(b.studentName),
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      sorter: (a, b) => a.time.localeCompare(b.time),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
  ];

  // Mock data - replace with actual API call
  const mockData: AttendanceRecord[] = [
    { id: '1', date: '2024-12-03', studentName: 'John Doe', time: '08:15', location: 'Gate A' },
    { id: '2', date: '2024-12-03', studentName: 'Mary Smith', time: '08:20', location: 'Gate A' },
    { id: '3', date: '2024-12-02', studentName: 'John Doe', time: '08:10', location: 'Gate A' },
  ];

  return (
    <MainLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1>Attendance History</h1>
          <Button icon={<ExportOutlined />}>Export</Button>
        </div>

        <Card style={{ marginBottom: 24 }}>
          <Space>
            <RangePicker
              value={dateRange}
              onChange={(dates) => setDateRange(dates as [Dayjs | null, Dayjs | null])}
            />
            <Select
              value={selectedStudent}
              onChange={setSelectedStudent}
              style={{ width: 200 }}
              placeholder="All Students"
            >
              <Select.Option value="all">All Students</Select.Option>
            </Select>
            <Button type="primary">Apply Filters</Button>
            <Button onClick={() => {
              setDateRange([dayjs().subtract(7, 'day'), dayjs()]);
              setSelectedStudent('all');
            }}>Reset</Button>
          </Space>
        </Card>

        <Table
          columns={columns}
          dataSource={mockData}
          rowKey="id"
          pagination={{ pageSize: 20 }}
        />
      </div>
    </MainLayout>
  );
};

export default AttendanceHistory;


