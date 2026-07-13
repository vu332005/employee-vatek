import { Table, Button, Popconfirm, Avatar, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  const columns: ColumnsType<Employee> = [
    {
      title: t('table.avatar'),
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
      title: t('table.name'),
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text: string) => <span className="font-semibold text-gray-800">{text}</span>,
    },
    {
      title: t('table.email'),
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: t('table.age'),
      dataIndex: 'age',
      key: 'age',
      align: 'center',
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: t('table.phone'),
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: t('table.country'),
      dataIndex: 'country',
      key: 'country',
    },
    {
      title: t('table.actions'),
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
          >
            {t('table.edit')}
          </Button>
          <Popconfirm
            title={t('table.confirm_delete_title')}
            description={t('table.confirm_delete_desc', { name: record.name })}
            onConfirm={() => onDelete(record.id)}
            okText={t('table.ok_text')}
            cancelText={t('table.cancel_text')}
            okButtonProps={{ danger: true }}
          >
            <Button
              danger
              type="primary"
              ghost
              icon={<DeleteOutlined />}
            >
              {t('table.delete')}
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
        showTotal: (total) => t('table.total_employees', { total }),
      }}
      scroll={{ x: 'max-content' }}
      className="shadow-md rounded-lg overflow-hidden"
    />
  );
};

export default EmployeeTable;
