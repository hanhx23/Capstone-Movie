import { api } from "@/lib";

export const userService = {
  getUserByToken: () => {
    return api.post("/QuanLyNguoiDung/ThongTinTaiKhoan");
  },
  updateUserInfo: (userData) => {
    return api.put("/QuanLyNguoiDung/CapNhatThongTinNguoiDung", userData);
  },
  getBookingHistory: () => {
    return api.post("/QuanLyNguoiDung/ThongTinTaiKhoan");
  },
};
