import { api } from '@/lib'

export const fetchPhongVe = (maLichChieu) => {
  return api.get ("/QuanLyDatVe/LayDanhSachPhongVe", {
    params: {
      MaLichChieu: maLichChieu,
    },
  });
}

export const datVe = (payload) => {
  return api.post("/QuanLyDatVe/DatVe", payload);
}
