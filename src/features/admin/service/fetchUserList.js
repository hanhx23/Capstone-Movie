import { api } from "@/lib";

export const fetchUserList = (maNhom = "GP01") => {
  return api.get("/QuanLyNguoiDung/LayDanhSachNguoiDung", {
    params: {
      MaNhom: maNhom,
    },
  });
};

// update user

// delete user
export const deleteUser = (taiKhoan) => {
  return api.delete("/QuanLyNguoiDung/LayDanhSachNguoiDung", {
    params: {
      TaiKhoan: taiKhoan,
    },
  });
};
