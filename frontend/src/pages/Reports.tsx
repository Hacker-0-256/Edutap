import React, { useState } from 'react';
import { Card, Form, Select, DatePicker, Button, Radio, Table } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import MainLayout from '../components/layout/MainLayout';

const { RangePicker } = DatePicker;
const { Option } = Select;

const Reports: React.FC = () => {
  const [form] = Form.useForm();
  const [reportType, setReportType] = useState<string>('attendance');

  const onFinish = (values: any) => {
    console.log('Generate report:', values);
    // TODO: Call API to generate report
  };

  return (
    <MainLayout>
      <div>
        <h1 style={{ marginBottom: 24 }}>Reports & Export</h1>

        <Card title="Generate Report" style={{ marginBottom: 24 }}>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="reportType"
              label="Report Type"
              rules={[{ required: true, message: 'Please select report type!' }]}
            >
              <Select
                placeholder="Select Report Type"
                value={reportType}
                onChange={setReportType}
              >
                <Option value="attendance">Attendance Report</Option>
                <Option value="transaction">Transaction Report</Option>
                <Option value="sales">Sales Report</Option>
                <Option value="account">Account Balance Report</Option>
                <Option value="student">Student History Report</Option>
                <Option value="device">Device Activity Report</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="dateRange"
              label="Date Range"
              rules={[{ required: true, message: 'Please select date range!' }]}
            >
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="school" label="School">
              <Select placeholder="All Schools">
                <Option value="all">All Schools</Option>
              </Select>
            </Form.Item>

            <Form.Item name="format" label="Format" rules={[{ required: true }]}>
              <Radio.Group>
                <Radio value="pdf">PDF</Radio>
                <Radio value="csv">CSV</Radio>
                <Radio value="excel">Excel</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<DownloadOutlined />}>
                Generate Report
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card title="Report History">
          <Table
            columns={[
              { title: 'Date', dataIndex: 'date', key: 'date' },
              { title: 'Type', dataIndex: 'type', key: 'type' },
              { title: 'Format', dataIndex: 'format', key: 'format' },
              {
                title: 'Action',
                key: 'action',
                render: () => (
                  <Button type="link" icon={<DownloadOutlined />}>
                    Download
                  </Button>
                ),
              },
            ]}
            dataSource={[
              { key: '1', date: '2024-12-03', type: 'Attendance', format: 'CSV' },
              { key: '2', date: '2024-12-02', type: 'Transactions', format: 'PDF' },
            ]}
            pagination={false}
          />
        </Card>
      </div>
    </MainLayout>
  );
};

export default Reports;

