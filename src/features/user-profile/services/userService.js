import { api } from "@/lib";

export const userService = () => {
  getUserByToken: () => {
    return api.post("/QuanLyNguoiDung/ThongTinTaiKhoan");
  };
};
