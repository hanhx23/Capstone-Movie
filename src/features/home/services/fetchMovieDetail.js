import { api } from '@/lib'

export const fetchMovieDetail = (maPhim) => {
  return api.get("/QuanLyPhim/LayThongTinPhim", {
    params: {
      MaPhim: maPhim,
    },
  });
}
