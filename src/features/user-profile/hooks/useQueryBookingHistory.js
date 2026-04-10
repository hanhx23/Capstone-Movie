import { useQuery } from "@tanstack/react-query";
import { userService } from "../services";

export const useQueryBookingHistory = () => {
  return useQuery({
    queryKey: ["booking-history"],
    queryFn: () => userService.getBookingHistory(),
    staleTime: 5 * 60 * 1000, // 5 phút
    select: (response) => response.data.content?.thongTinDatVe || [],
  });
};