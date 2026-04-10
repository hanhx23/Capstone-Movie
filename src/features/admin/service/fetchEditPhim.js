import { api } from "@/lib";

export const fetchThemPhim = (formData) => {
  return api.post("/QuanLyPhim/ThemPhimUploadHinh", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const fetchXoaPhim = (maPhim) => {
  return api.delete("/QuanLyPhim/XoaPhim", {
    params: { MaPhim: maPhim },
  })
}

export const fetchCapNhatPhim = (formData) => {
  return api.post("/QuanLyPhim/CapNhatPhimUpload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
