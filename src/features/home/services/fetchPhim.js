import { api } from '@/lib'

export const fetchPhim = (maNhom = "GP01") => {
  return api.get("/QuanLyPhim/LayDanhSachPhim", {
    params: {
      MaNhom: maNhom,
    },
  });
}
