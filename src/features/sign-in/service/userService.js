import { api } from "@/lib"

export const userService = {

    dangNhap: (payload)=> api.post('/QuanLyNguoiDung/DangNhap', payload)
}