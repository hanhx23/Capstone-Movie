import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { PRIVATE_PATH } from "@/constant";
import {
  deleteUser,
  fetchUserList,
  fetchUserTypes,
  updateUser,
} from "../service";

const MA_NHOM = "GP01";

export const UserManagementPage = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);

  const [userTypes, setUserTypes] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [updating, setUpdating] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    loadUsers();
    loadUserTypes();
  }, []);

  if (!userInfo || userInfo.maLoaiNguoiDung !== "QuanTri") {
    return <div className="text-center py-10">Không có quyền truy cập</div>;
  }

  const loadUserTypes = async () => {
    try {
      const res = await fetchUserTypes();
      setUserTypes(res.data.content);
    } catch {
      toast.error("Lỗi tải loại người dùng");
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetchUserList(MA_NHOM);
      setUsers(res.data.content);
    } catch {
      toast.error("Lỗi tải danh sách");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taiKhoan) => {
    try {
      setDeleting(taiKhoan);
      await deleteUser(taiKhoan);
      toast.success("Xóa thành công");
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Xóa thất bại");
    } finally {
      setDeleting(null);
    }
  };

  const openEdit = (user) => {
    setEditingUser(user);

    form.setFieldsValue({
      taiKhoan: user.taiKhoan,
      hoTen: user.hoTen,
      email: user.email,
      soDT: user.soDT,
      maLoaiNguoiDung: user.maLoaiNguoiDung,
      matKhau: "",
    });

    setOpen(true);
  };

  const closeEdit = () => {
    setOpen(false);
    setEditingUser(null);
    form.resetFields();
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        taiKhoan: values.taiKhoan,
        hoTen: values.hoTen,
        email: values.email,
        soDt: values.soDT,
        maLoaiNguoiDung: values.maLoaiNguoiDung,
        maNhom: MA_NHOM,
      };

      if (values.matKhau) {
        payload.matKhau = values.matKhau;
      }

      setUpdating(true);
      await updateUser(payload);

      toast.success("Cập nhật thành công");
      closeEdit();
      loadUsers();
    } catch (err) {
      if (err?.response) {
        toast.error(err.response.data.message);
      }
    } finally {
      setUpdating(false);
    }
  };

  const columns = [
    {
      title: "Tài khoản",
      dataIndex: "taiKhoan",
      key: "taiKhoan",
    },
    {
      title: "Họ tên",
      dataIndex: "hoTen",
      key: "hoTen",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "SĐT",
      dataIndex: "soDT",
      key: "soDT",
    },
    {
      title: "Loại",
      dataIndex: "maLoaiNguoiDung",
      key: "maLoaiNguoiDung",
      render: (val) => {
        const found = userTypes.find(
          (i) => i.maLoaiNguoiDung === val
        );

        return (
          <Tag color={val === "QuanTri" ? "red" : "blue"}>
            {found?.tenLoai || val}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, row) => (
        <Space>
          <Button type="link" onClick={() => openEdit(row)}>
            Sửa
          </Button>

          <Popconfirm
            title="Xóa user?"
            onConfirm={() => handleDelete(row.taiKhoan)}
            okButtonProps={{ loading: deleting === row.taiKhoan }}
          >
            <Button type="link" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
        <h2 className="text-center text-xl font-bold mb-4">
          Quản lý người dùng
        </h2>

        <Table
          rowKey="taiKhoan"
          columns={columns}
          dataSource={users}
          loading={loading}
        />

        <Modal
        title={`Sửa user: ${editingUser?.taiKhoan}`}
        open={open}
        onCancel={closeEdit}
        onOk={handleUpdate}
        confirmLoading={updating}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="taiKhoan" label="Tài khoản">
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="hoTen"
            label="Họ tên"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="soDT"
            label="SĐT"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="matKhau" label="Mật khẩu mới">
            <Input.Password placeholder="Không nhập nếu không đổi" />
          </Form.Item>

          <Form.Item name="maLoaiNguoiDung" label="Loại user">
            <Select
              loading={!userTypes.length}
              options={userTypes.map((item) => ({
                value: item.maLoaiNguoiDung,
                label: item.tenLoai,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};