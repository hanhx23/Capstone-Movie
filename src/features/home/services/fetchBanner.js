import { api } from "@/lib";
import React from "react";

export const fetchBanner = () => {
  return api.get("/QuanLyPhim/LayDanhSachBanner");
};
