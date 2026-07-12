
import { Table, Button, Popconfirm, Avatar, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Employee } from '../../types/employee';
import type { ColumnsType } from 'antd/es/table';

interface EmployeeTableProps {
  employees: Employee[];
  loading: boolean;
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
}

const EmployeeTable = ({
  employees,
  loading,
  onEdit,
  onDelete,
}: EmployeeTableProps) => {
  const columns: ColumnsType<Employee> = [
    {
      title: 'Ảnh đại diện',
      dataIndex: 'image',
      key: 'image',
      width: 120,
      align: 'center',
      render: (text: string, record: Employee) => (
        <Avatar
          src={text || undefined}
          alt={record.name}
          size={50}
          className="border border-gray-200 shadow-sm"
        >
          {record.name.charAt(0).toUpperCase()}
        </Avatar>
      ),
    },
    {
      title: 'Họ và tên',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text: string) => <span className="font-semibold text-gray-800">{text}</span>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Tuổi',
      dataIndex: 'age',
      key: 'age',
      align: 'center',
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Quốc gia',
      dataIndex: 'country',
      key: 'country',
    },
    {
      title: 'Hành động',
      key: 'actions',
      align: 'center',
      width: 160,
      render: (_, record: Employee) => (
        <Space size="middle">
          <Button
            type="primary"
            ghost
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            className="hover:scale-105 transition-transform"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa"
            description={`Bạn có chắc chắn muốn xóa nhân viên ${record.name}?`}
            onConfirm={() => onDelete(record.id)}
            okText="Đồng ý"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button
              danger
              type="primary"
              ghost
              icon={<DeleteOutlined />}
              className="hover:scale-105 transition-transform"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={employees}
      rowKey="id"
      loading={loading}
      pagination={{
        pageSize: 5,
        showTotal: (total) => `Tổng số ${total} nhân viên`,
      }}
      scroll={{ x: 'max-content' }}
      className="shadow-md rounded-lg overflow-hidden"
    />
  );
};

export default EmployeeTable;
