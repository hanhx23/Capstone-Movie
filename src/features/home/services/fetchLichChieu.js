import { api } from "@/lib"

export const fetchLichChieu = (maPhim) => {
  return api.get("/QuanLyRap/LayThongTinLichChieuPhim", {
    params: {
      MaPhim: maPhim,
    },
  })
}