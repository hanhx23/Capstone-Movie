import React, { useEffect, useState } from 'react'
import { Button, Layout, Menu, Popconfirm, Space, Table, Tag } from 'antd'
import { toast } from 'sonner'
import { deleteUser, fetchUserList } from '../service/fetchUserList'

const { Sider, Content } = Layout
const MA_NHOM = 'GP01'

export const UserManagementPage = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetchUserList(MA_NHOM)
      .then((res) => {
        setUsers(res.data.content)
      })
      .catch((err) => {
        setError(err.response?.data?.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleDeleteUser = (taiKhoan) => {
    setDeleting(taiKhoan)
    deleteUser(taiKhoan)
      .then(() => {
        toast.success('Xóa người dùng thành công')
        return fetchUserList(MA_NHOM)
      })
      .then((res) => {
        setUsers(res.data.content)
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Xóa người dùng thất bại')
      })
      .finally(() => {
        setDeleting(null)
      })
  }

  const columns = [
    {
      title: 'Tài khoản',
      dataIndex: 'taiKhoan',
      key: 'taiKhoan',
    },
    {
      title: 'Họ tên',
      dataIndex: 'hoTen',
      key: 'hoTen',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'SĐT',
      dataIndex: 'soDT',
      key: 'soDT',
    },
    {
      title: 'Loại người dùng',
      dataIndex: 'maLoaiNguoiDung',
      key: 'maLoaiNguoiDung',
      render: (loai) => (
        <Tag color={loai === 'QuanTri' ? 'red' : 'blue'}>{loai}</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, row) => (
        <Space size="middle">
          <Button type="link" className="p-0 h-auto">
            Sửa
          </Button>
          <Popconfirm
            title="Xóa người dùng này?"
            description="Hành động này không thể hoàn tác"
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ loading: deleting === row.taiKhoan }}
            onConfirm={() => handleDeleteUser(row.taiKhoan)}
          >
            <Button type="link" danger className="p-0 h-auto">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Layout className="min-h-120 bg-white rounded overflow-hidden">
      <Sider width={220} theme="light" className="border-r border-gray-200">
        <Menu
          mode="inline"
          defaultSelectedKeys={['users']}
          items={[{ key: 'users', label: 'Quản lý người dùng' }]}
        />
      </Sider>
      <Content className="p-6">
        <h2>Quản lý người dùng</h2>
        {error && <p className="text-red-500">{error}</p>}
        <Table
          rowKey="taiKhoan"
          columns={columns}
          dataSource={users}
          loading={loading}
          pagination={{ pageSize: 8 }}
        />
      </Content>
    </Layout>
  )
}
