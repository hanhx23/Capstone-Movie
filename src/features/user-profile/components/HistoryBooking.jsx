export const HistoryBooking = ({ bookings, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-sm text-gray-500 mt-2">Đang tải lịch sử đặt vé...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        <p className="text-lg">Lỗi tải lịch sử đặt vé</p>
        <p className="text-sm mt-2">{error.message}</p>
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p className="text-lg">Bạn chưa có lịch sử đặt vé nào.</p>
        <p className="text-sm mt-2">Hãy đặt vé để xem phim nhé!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((item) => (
        <div key={item.maVe} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition">
          <div className="flex gap-4">
            <img
              src={item.hinhAnh || "https://via.placeholder.com/80x120?text=No+Image"}
              alt={item.tenPhim}
              className="w-20 h-28 object-cover rounded"
              onError={(e) => { e.target.src = "https://via.placeholder.com/80x120?text=No+Image"; }}
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-800 mb-1">{item.tenPhim}</h3>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Rạp:</span> {item.tenRap}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Ngày đặt:</span> {new Date(item.ngayDat).toLocaleDateString("vi-VN")}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Ghế:</span> {item.danhSachGhe.map(g => g.tenGhe).join(", ")}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Tổng tiền:</span> {item.giaVe?.toLocaleString("vi-VN")}đ
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};