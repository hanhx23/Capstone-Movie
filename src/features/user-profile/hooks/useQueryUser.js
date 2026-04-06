import { userService } from "@/features/register/services";

export const useQueryUser = () => {
  return useQueryUser({
    queryKey: ["user"],
    queryFn: () => userService.getUserByToken(),
    staleTime: 30 * 60 * 1000, // 30 phút
    // // staleTime là thời gian mà dữ liệu được coi là mới và sẽ không được làm mới lại khi truy cập. Nếu staleTime được đặt thành 0, dữ liệu sẽ luôn được coi là cũ và sẽ được làm mới lại mỗi khi truy cập.

    gcTime: 60 * 60 * 1000, // 1 giờ
    // // gcTime la thời gian để dữ liệu bị xóa khỏi cache sau khi nó trở nên cũ, ngay cả khi nó không được truy cập. Nếu gcTime được đặt thành 0, dữ liệu sẽ không bao giờ bị xóa khỏi cache trừ khi nó bị xóa thủ công hoặc bộ nhớ cache bị xóa hoàn toàn.

    select: (response) => response.data.content,
  });
};
