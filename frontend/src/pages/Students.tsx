import React, { useState } from 'react';
import { Table, Button, Input, Space, Tag, Avatar, Dropdown, message, Alert } from 'antd';
import { PlusOutlined, SearchOutlined, MoreOutlined, EyeOutlined, EditOutlined, DeleteOutlined, CameraOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import MainLayout from '../components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { studentsService, type Student } from '../services/students.service';
import { getPhotoUrl } from '../utils/photo';
import { useAuth } from '../contexts/AuthContext';

const Students: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isSchoolStaff = user?.role === 'school';
  const [searchText, setSearchText] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['students', searchText, user?.schoolId],
    queryFn: () => {
      // School staff only see their school's students
      const params: any = { search: searchText };
      if (isSchoolStaff && user?.schoolId) {
        params.schoolId = user.schoolId;
      }
      return studentsService.getAll(params);
    },
  });

  const handleDelete = async (id: string) => {
    try {
      await studentsService.delete(id);
      message.success('Student deleted successfully');
      refetch();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to delete student');
    }
  };

  const columns: ColumnsType<Student> = [
    {
      title: 'Photo',
      dataIndex: 'photo',
      key: 'photo',
      width: 80,
      render: (photo: string, record: Student) => (
        <Avatar
          src={photo ? getPhotoUrl(photo) : null}
          icon={!photo ? <span>{record.firstName[0]}{record.lastName[0]}</span> : undefined}
          size={50}
          style={{ cursor: 'pointer' }}
          onClick={() => navigate(`/students/edit/${record.id}`)}
        />
      ),
    },
    {
      title: 'Name',
      key: 'name',
      sorter: (a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`),
      render: (_, record) => (
        <span style={{ cursor: 'pointer' }} onClick={() => navigate(`/students/edit/${record.id}`)}>
          {record.firstName} {record.lastName}
        </span>
      ),
    },
    {
      title: 'Student ID',
      dataIndex: 'studentId',
      key: 'studentId',
      sorter: (a, b) => a.studentId.localeCompare(b.studentId),
      render: (text: string) => <code>{text}</code>,
    },
    {
      title: 'Grade',
      dataIndex: 'grade',
      key: 'grade',
      filters: [
        { text: '4', value: '4' },
        { text: '5', value: '5' },
        { text: '6', value: '6' },
      ],
      onFilter: (value, record) => record.grade === value,
      render: (text: string) => <Tag>{text}</Tag>,
    },
    {
      title: 'Class',
      dataIndex: 'class',
      key: 'class',
      render: (text: string) => <Tag>{text}</Tag>,
    },
    {
      title: 'Card Status',
      dataIndex: 'cardUID',
      key: 'cardStatus',
      render: (cardUID: string) => (
        <Tag color={cardUID ? 'success' : 'default'}>
          {cardUID ? '✅ Active' : '⚫ No Card'}
        </Tag>
      ),
    },
    {
      title: 'Balance',
      dataIndex: 'accountBalance',
      key: 'balance',
      sorter: (a, b) => (a.accountBalance || 0) - (b.accountBalance || 0),
      render: (balance: number) => (
        <span style={{ color: balance && balance < 500 ? '#fa8c16' : undefined }}>
          {balance ? `${balance.toLocaleString()} RWF` : '0 RWF'}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'view',
                icon: <EyeOutlined />,
                label: 'View Details',
                onClick: () => navigate(`/students/edit/${record.id}`),
              },
              {
                key: 'edit',
                icon: <EditOutlined />,
                label: 'Edit Student',
                onClick: () => navigate(`/students/edit/${record.id}`),
              },
              {
                key: 'photo',
                icon: <CameraOutlined />,
                label: 'Upload/Change Photo',
                onClick: () => navigate(`/students/edit/${record.id}?tab=photo`),
              },
              {
                type: 'divider',
              },
              {
                key: 'delete',
                icon: <DeleteOutlined />,
                label: 'Deactivate',
                danger: true,
                onClick: () => {
                  if (window.confirm('Are you sure you want to deactivate this student?')) {
                    handleDelete(record.id);
                  }
                },
              },
            ],
          }}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <MainLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1>Students</h1>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/students/add')} size="large">
            Register New Student
          </Button>
        </div>

        {isSchoolStaff && user?.schoolName && (
          <Alert
            message={`Showing students from ${user.schoolName} only`}
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Space style={{ marginBottom: 16, width: '100%' }} direction="vertical">
          <Input
            placeholder="Search students..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ maxWidth: 400 }}
          />
        </Space>

        <Table
          columns={columns}
          dataSource={data?.data?.students || []}
          loading={isLoading}
          rowKey="id"
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} students`,
          }}
        />
      </div>
    </MainLayout>
  );
};

export default Students;

