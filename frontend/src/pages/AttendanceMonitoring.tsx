import React, { useState } from 'react';
import { Card, Row, Col, Statistic, DatePicker, Button, List, Tag, Space, Alert } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ExportOutlined } from '@ant-design/icons';
import MainLayout from '../components/layout/MainLayout';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { useAuth } from '../contexts/AuthContext';
import './AttendanceMonitoring.css';

const AttendanceMonitoring: React.FC = () => {
  const { user } = useAuth();
  const isSchoolStaff = user?.role === 'school';
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

  // Mock data - replace with actual API call
  const { data, isLoading } = useQuery({
    queryKey: ['attendance', selectedDate.format('YYYY-MM-DD')],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return {
        present: 218,
        absent: 27,
        total: 245,
        presentStudents: [
          { id: '1', name: 'John Doe', time: '08:15', location: 'Gate A' },
          { id: '2', name: 'Mary Smith', time: '08:20', location: 'Gate A' },
          { id: '3', name: 'Peter Jones', time: '08:25', location: 'Gate B' },
        ],
        absentStudents: [
          { id: '4', name: 'Alice Brown', grade: '4B' },
          { id: '5', name: 'Bob Wilson', grade: '5A' },
          { id: '6', name: 'Charlie Davis', grade: '6B' },
        ],
      };
    },
  });

  return (
    <MainLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1>Attendance Monitoring</h1>
          <Space>
            <DatePicker
              value={selectedDate}
              onChange={(date) => setSelectedDate(date || dayjs())}
              format="YYYY-MM-DD"
            />
            <Button icon={<ExportOutlined />}>Export</Button>
          </Space>
        </div>

        {isSchoolStaff && user?.schoolName && (
          <Alert
            message={`Showing attendance from ${user.schoolName} only`}
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Card title="Summary" style={{ marginBottom: 24 }}>
          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Statistic
                title="Present"
                value={data?.present || 0}
                suffix={`(${data ? Math.round((data.present / data.total) * 100) : 0}%)`}
                valueStyle={{ color: '#52c41a' }}
                prefix={<CheckCircleOutlined />}
              />
            </Col>
            <Col xs={24} sm={8}>
              <Statistic
                title="Absent"
                value={data?.absent || 0}
                suffix={`(${data ? Math.round((data.absent / data.total) * 100) : 0}%)`}
                valueStyle={{ color: '#f5222d' }}
                prefix={<CloseCircleOutlined />}
              />
            </Col>
            <Col xs={24} sm={8}>
              <Statistic title="Total Students" value={data?.total || 0} />
            </Col>
          </Row>
        </Card>

        <Row gutter={16}>
          <Col xs={24} lg={12}>
            <Card title={`Present Students (${data?.present || 0})`} loading={isLoading}>
              <List
                dataSource={data?.presentStudents || []}
                renderItem={(item: any) => (
                  <List.Item>
                    <List.Item.Meta
                      title={item.name}
                      description={
                        <Space>
                          <Tag color="green">{item.time}</Tag>
                          <span>{item.location}</span>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title={`Absent Students (${data?.absent || 0})`} loading={isLoading}>
              <List
                dataSource={data?.absentStudents || []}
                renderItem={(item: any) => (
                  <List.Item>
                    <List.Item.Meta
                      title={item.name}
                      description={<Tag>{item.grade}</Tag>}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

export default AttendanceMonitoring;

