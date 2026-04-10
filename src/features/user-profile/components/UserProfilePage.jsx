import { Tabs } from "antd";
import { UserInfo } from "./UserInfo";
import { HistoryBooking } from "./HistoryBooking";
import { useQueryUser } from "../hooks";

export const UserProfilePage = () => {
  const { data: user, isLoading, error } = useQueryUser();

  if (isLoading) {
    return <div className="text-center py-10">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Lỗi tải dữ liệu: {error.message}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs
        defaultActiveKey="info"
        items={[
          {
            key: "info",
            label: "Thông tin cá nhân",
            children: <UserInfo />,
          },
          {
            key: "booking",
            label: "Lịch sử đặt vé",
            children: (
              <HistoryBooking bookings={user?.thongTinDatVe || []} />
            ),
          },
        ]}
      />
    </div>
  );
};