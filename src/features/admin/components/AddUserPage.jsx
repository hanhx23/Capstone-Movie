import React, { useEffect, useState } from "react";
import { Button, Form, Input, Select } from "antd";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { addUser, fetchUserTypes } from "../service";
import { PRIVATE_PATH } from "@/constant";

const MA_NHOM = "GP01";

export const AddUserPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [userTypes, setUserTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserTypes();
  }, []);

  const loadUserTypes = async () => {
    try {
      const res = await fetchUserTypes();
      setUserTypes(res.data.content);
    } catch {
      toast.error("Lỗi tải loại người dùng");
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        taiKhoan: values.taiKhoan,
        matKhau: values.matKhau,
        hoTen: values.hoTen,
        email: values.email,
        soDt: values.soDT,
        maLoaiNguoiDung: values.maLoaiNguoiDung,
        maNhom: MA_NHOM,
      };

      setLoading(true);
      await addUser(payload);

      toast.success("Thêm người dùng thành công");
      navigate(PRIVATE_PATH.ADMIN);
    } catch (err) {
      if (err?.response) {
        toast.error(err.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-center text-2xl font-bold mb-6">Thêm người dùng</h2>

      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item name="taiKhoan" label="Tài khoản" rules={[{ required: true, message: "Vui lòng nhập tài khoản" }]}>
          <Input placeholder="Nhập tài khoản" />
        </Form.Item>

        <Form.Item name="matKhau" label="Mật khẩu" rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}>
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>

        <Form.Item name="hoTen" label="Họ tên" rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}>
          <Input placeholder="Nhập họ tên" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, type: "email", message: "Vui lòng nhập email hợp lệ" }]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item name="soDT" label="SĐT" rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}>
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item name="maLoaiNguoiDung" label="Loại user" rules={[{ required: true }]}>
          <Select
            placeholder="Chọn loại user"
            options={userTypes.map((item) => ({
              value: item.maLoaiNguoiDung,
              label: item.tenLoai,
            }))}
          />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 5 }}>
          <Button type="primary" loading={loading} onClick={handleSubmit}>
            Thêm người dùng
          </Button>
          <Button className="ml-3" onClick={() => navigate(PRIVATE_PATH.ADMIN)}>
            Hủy
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};