import { api } from "@/lib"

export const fetchHeThongRap = () => {
  return api.get("/QuanLyRap/LayThongTinHeThongRap")
}

export const fetchCumRapTheoHeThong = (maHeThongRap) => {
  return api.get("/QuanLyRap/LayThongTinCumRapTheoHeThong", {
    params: { maHeThongRap },
  })
}

export const fetchTaoLichChieu = (data) => {
  return api.post("/QuanLyDatVe/TaoLichChieu", data)
}