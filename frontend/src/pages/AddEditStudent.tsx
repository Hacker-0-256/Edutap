import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Card, Checkbox, Upload, Avatar, message, Space } from 'antd';
import { CameraOutlined, DeleteOutlined, SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import MainLayout from '../components/layout/MainLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentsService, type StudentRegistrationData } from '../services/students.service';
import { getPhotoUrl, getDefaultAvatar } from '../utils/photo';
import { useAuth } from '../contexts/AuthContext';

const { Option } = Select;

const AddEditStudent: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const isEdit = !!id;
  const isSchoolStaff = user?.role === 'school';
  const [form] = Form.useForm();
  const [photoFile, setPhotoFile] = useState<UploadFile | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch student data if editing
  const { data: studentData } = useQuery({
    queryKey: ['student', id],
    queryFn: () => studentsService.getById(id!),
    enabled: isEdit,
  });

  useEffect(() => {
    if (studentData?.data?.student) {
      const student = studentData.data.student;
      
      // School staff can only edit students from their school
      if (isSchoolStaff && student.schoolId !== user?.schoolId) {
        message.error('You can only edit students from your school');
        navigate('/students');
        return;
      }
      
      form.setFieldsValue({
        firstName: student.firstName,
        lastName: student.lastName,
        studentId: student.studentId,
        cardUID: student.cardUID,
        grade: student.grade,
        class: student.class,
        schoolId: student.schoolId,
        parentFirstName: student.parent?.firstName,
        parentLastName: student.parent?.lastName,
        parentPhone: student.parent?.phone,
        parentEmail: student.parent?.email,
        parentAddress: student.parent?.address,
        parentReceiveSMS: student.parent?.receiveSMS ?? true,
      });
      
      if (student.photo) {
        setPhotoPreview(getPhotoUrl(student.photo));
      }
    }
  }, [studentData, form, isSchoolStaff, user?.schoolId, navigate]);

  const registerMutation = useMutation({
    mutationFn: (data: StudentRegistrationData) => studentsService.register(data),
    onSuccess: async (response) => {
      message.success('Student registered successfully!');
      
      // Upload photo if selected
      if (photoFile && response.data?.student?.id) {
        try {
          await studentsService.uploadPhoto(response.data.student.id, photoFile as any);
          message.success('Photo uploaded successfully!');
        } catch (error) {
          message.warning('Student registered but photo upload failed');
        }
      }
      
      queryClient.invalidateQueries({ queryKey: ['students'] });
      navigate('/students');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Registration failed');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<StudentRegistrationData> }) =>
      studentsService.update(id, data),
    onSuccess: async () => {
      message.success('Student updated successfully!');
      
      // Upload photo if changed
      if (photoFile && id) {
        try {
          await studentsService.uploadPhoto(id, photoFile as any);
          message.success('Photo updated successfully!');
        } catch (error) {
          message.warning('Student updated but photo upload failed');
        }
      }
      
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['student', id] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Update failed');
    },
  });

  const handlePhotoChange = (file: UploadFile) => {
    if (file.originFileObj) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file.originFileObj);
      setPhotoFile(file);
    }
    return false; // Prevent auto upload
  };

  const handleRemovePhoto = async () => {
    if (isEdit && id) {
      try {
        await studentsService.deletePhoto(id);
        setPhotoPreview(null);
        setPhotoFile(null);
        message.success('Photo removed successfully');
      } catch (error) {
        message.error('Failed to remove photo');
      }
    } else {
      setPhotoPreview(null);
      setPhotoFile(null);
    }
  };

  const onFinish = (values: any) => {
    // School staff can only add students to their own school
    const schoolId = isSchoolStaff ? user?.schoolId : values.schoolId;
    
    if (!schoolId) {
      message.error('School is required');
      return;
    }
    
    const registrationData: StudentRegistrationData = {
      firstName: values.firstName,
      lastName: values.lastName,
      studentId: values.studentId,
      cardUID: values.cardUID,
      grade: values.grade,
      class: values.class,
      schoolId: schoolId,
      initialBalance: values.createAccount ? values.initialBalance : undefined,
      parentFirstName: values.parentFirstName,
      parentLastName: values.parentLastName,
      parentPhone: values.parentPhone,
      parentEmail: values.parentEmail,
      parentAddress: values.parentAddress,
      parentReceiveSMS: values.parentReceiveSMS ?? true,
    };

    if (isEdit) {
      updateMutation.mutate({ id: id!, data: registrationData });
    } else {
      registerMutation.mutate(registrationData);
    }
  };

  const student = studentData?.data?.student;
  const currentPhotoUrl = student?.photo ? getPhotoUrl(student.photo) : null;

  return (
    <MainLayout>
      <div>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/students')}
          style={{ marginBottom: 16 }}
        >
          Back to Students
        </Button>

        <Card title={isEdit ? 'Edit Student' : 'Register New Student'}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              parentReceiveSMS: true,
              createAccount: false,
              initialBalance: 0,
            }}
          >
            <Card title="Basic Information" style={{ marginBottom: 24 }}>
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[{ required: true, message: 'Please input first name!' }]}
              >
                <Input placeholder="First Name" />
              </Form.Item>

              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: 'Please input last name!' }]}
              >
                <Input placeholder="Last Name" />
              </Form.Item>

              <Form.Item
                name="studentId"
                label="Student ID"
                tooltip="Auto-generated if left empty"
              >
                <Input placeholder="ST001" />
              </Form.Item>

              <Form.Item
                name="grade"
                label="Grade"
                rules={[{ required: true, message: 'Please select grade!' }]}
              >
                <Select placeholder="Select Grade">
                  {['1', '2', '3', '4', '5', '6'].map((grade) => (
                    <Option key={grade} value={grade}>
                      Grade {grade}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="class"
                label="Class"
                rules={[{ required: true, message: 'Please select class!' }]}
              >
                <Select placeholder="Select Class">
                  {['A', 'B', 'C', 'D'].map((cls) => (
                    <Option key={cls} value={cls}>
                      Class {cls}
                    </Option>
                  ))}
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
                    {/* TODO: Fetch schools from API */}
                    <Option value="6942c83c61e18873521275bb">Sunrise Elementary School</Option>
                    <Option value="6942c83c61e18873521275bc">Green Valley International School</Option>
                  </Select>
                )}
              </Form.Item>
            </Card>

            <Card title="Parent/Guardian Information" style={{ marginBottom: 24 }}>
              <Form.Item
                name="parentFirstName"
                label="Parent First Name"
                rules={[{ required: true, message: 'Please input parent first name!' }]}
              >
                <Input placeholder="Parent First Name" />
              </Form.Item>

              <Form.Item
                name="parentLastName"
                label="Parent Last Name"
                rules={[{ required: true, message: 'Please input parent last name!' }]}
              >
                <Input placeholder="Parent Last Name" />
              </Form.Item>

              <Form.Item
                name="parentPhone"
                label="Phone Number"
                rules={[
                  { required: true, message: 'Please input phone number!' },
                  { pattern: /^\+?[1-9]\d{1,14}$/, message: 'Please enter a valid phone number!' },
                ]}
                tooltip="System will find existing parent by phone or create new one automatically"
              >
                <Input placeholder="+250788123456" />
              </Form.Item>

              <Form.Item name="parentEmail" label="Email (Optional)">
                <Input type="email" placeholder="parent@email.com" />
              </Form.Item>

              <Form.Item name="parentAddress" label="Address (Optional)">
                <Input.TextArea rows={2} placeholder="Address" />
              </Form.Item>

              <Form.Item name="parentReceiveSMS" valuePropName="checked">
                <Checkbox>Send SMS notifications to parent</Checkbox>
              </Form.Item>
            </Card>

            <Card title="Card Assignment" style={{ marginBottom: 24 }}>
              <Form.Item
                name="cardUID"
                label="Card UID"
                rules={[{ required: true, message: 'Please input card UID!' }]}
              >
                <Input placeholder="ABC123456789" />
              </Form.Item>

              <Form.Item name="createAccount" valuePropName="checked">
                <Checkbox>Create account with initial balance</Checkbox>
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.createAccount !== currentValues.createAccount}
              >
                {({ getFieldValue }) =>
                  getFieldValue('createAccount') ? (
                    <Form.Item
                      name="initialBalance"
                      label="Initial Balance (RWF)"
                      rules={[{ required: true, message: 'Please input initial balance!' }]}
                    >
                      <Input type="number" min={0} placeholder="0" />
                    </Form.Item>
                  ) : null
                }
              </Form.Item>
            </Card>

            <Card title="Student Photo (Optional)" style={{ marginBottom: 24 }}>
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <Avatar
                  src={photoPreview || currentPhotoUrl || getDefaultAvatar(
                    form.getFieldValue('firstName') || 'S',
                    form.getFieldValue('lastName') || 'T'
                  )}
                  size={200}
                  style={{ marginBottom: 16 }}
                />
              </div>
              <Space>
                <Upload
                  beforeUpload={handlePhotoChange}
                  showUploadList={false}
                  accept="image/*"
                  maxCount={1}
                >
                  <Button icon={<CameraOutlined />}>Upload Photo</Button>
                </Upload>
                {(photoPreview || currentPhotoUrl) && (
                  <Button danger icon={<DeleteOutlined />} onClick={handleRemovePhoto}>
                    Remove Photo
                  </Button>
                )}
              </Space>
              <div style={{ marginTop: 8, color: '#8c8c8c', fontSize: 12 }}>
                Accepted: JPG, PNG, GIF, WebP | Max size: 5MB
                <br />
                ℹ️ Photo will be used for payment verification
              </div>
            </Card>

            <Form.Item>
              <Space>
                <Button onClick={() => navigate('/students')}>Cancel</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={registerMutation.isPending || updateMutation.isPending}
                >
                  {isEdit ? 'Update Student' : 'Register Student & Parent'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AddEditStudent;

