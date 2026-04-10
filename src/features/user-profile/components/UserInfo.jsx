import { Button, Input } from "antd";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryUser } from "../hooks";
import { toast } from "sonner";
import { userService } from "../services";

export const UserInfo = () => {
  const { data: user } = useQueryUser();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (user) {
      reset({
        ...user,
        soDT: user.soDT ?? "",
        matKhau: "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        soDt: data.soDT,
        maLoaiNguoiDung: user?.maLoaiNguoiDung,
        maNhom: user?.maNhom,
      };

      if (!data.matKhau) {
        delete payload.matKhau;
      }

      await userService.updateUserInfo(payload);

      toast.success("Cập nhật thành công");


      queryClient.invalidateQueries({ queryKey: ['user'] });

      reset({
        ...payload,
        soDT: payload.soDt,
        matKhau: "",
      });

      setIsEditing(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Cập nhật thất bại");
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      {!isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Họ tên</label>
            <p className="mt-1 text-gray-900">{user?.hoTen || "—"}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-gray-900">{user?.email || "—"}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tài khoản</label>
            <p className="mt-1 text-gray-900">{user?.taiKhoan || "—"}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
            <p className="mt-1 text-gray-900">{user?.soDT || "—"}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mã nhóm</label>
            <p className="mt-1 text-gray-900">{user?.maNhom || "—"}</p>
          </div>

          <Button
            type="primary"
            onClick={() => setIsEditing(true)}
            className="w-full mt-4"
            size="large"
          >
            Sửa
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label>Họ tên</label>
            <Controller
              control={control}
              name="hoTen"
              rules={{ required: "Không được bỏ trống" }}
              render={({ field }) => <Input {...field} />}
            />
            <p className="text-red-500 text-xs">{errors.hoTen?.message}</p>
          </div>

          <div>
            <label>Email</label>
            <Controller
              control={control}
              name="email"
              rules={{ required: "Không được bỏ trống" }}
              render={({ field }) => <Input {...field} />}
            />
            <p className="text-red-500 text-xs">{errors.email?.message}</p>
          </div>

          <div>
            <label>Tài khoản</label>
            <Controller
              control={control}
              name="taiKhoan"
              render={({ field }) => <Input {...field} disabled />}
            />
          </div>

          <div>
            <label>Mật khẩu mới</label>
            <Controller
              control={control}
              name="matKhau"
              render={({ field }) => (
                <Input.Password
                  {...field}
                  placeholder="Không nhập nếu không đổi"
                />
              )}
            />
          </div>

          <div>
            <label>Số điện thoại</label>
            <Controller
              control={control}
              name="soDT"
              rules={{ required: "Không được bỏ trống" }}
              render={({ field }) => <Input {...field} />}
            />
            <p className="text-red-500 text-xs">{errors.soDT?.message}</p>
          </div>

          <div>
            <label>Mã nhóm</label>
            <Controller
              control={control}
              name="maNhom"
              render={({ field }) => <Input {...field} disabled />}
            />
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              htmlType="submit"
              type="primary"
              loading={isSubmitting}
              className="flex-1"
            >
              Cập nhật
            </Button>
            <Button
              onClick={() => {
                setIsEditing(false);
                reset({
                  ...user,
                  soDT: user?.soDT ?? "",
                  matKhau: "",
                });
              }}
              className="flex-1"
            >
              Hủy
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};