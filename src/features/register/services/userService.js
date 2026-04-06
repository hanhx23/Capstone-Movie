import { api } from "@/lib";

export const userService = {
    dangKy: (payload) => api.post('/QuanLyNguoiDung/DangKy', payload),
}
