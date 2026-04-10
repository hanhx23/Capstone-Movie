import { api } from "@/lib";

export const fetchUserList = (maNhom = "GP01") => {
  return api.get("/QuanLyNguoiDung/LayDanhSachNguoiDung", {
    params: {
      MaNhom: maNhom,
    },
  });
};

export const fetchUserTypes = () => {
  return api.get("/QuanLyNguoiDung/LayDanhSachLoaiNguoiDung");
};

// update user
export const updateUser = (userData) => {
  return api.put("/QuanLyNguoiDung/CapNhatThongTinNguoiDung", userData);
};

// delete user
export const deleteUser = (taiKhoan) => {
  return api.delete("/QuanLyNguoiDung/XoaNguoiDung", {
    params: { TaiKhoan: taiKhoan },
  });
};

// add user
export const addUser = (data) => {
  return api.post("/QuanLyNguoiDung/ThemNguoiDung", data);
};
