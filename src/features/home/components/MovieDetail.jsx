import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import { fetchLichChieu, fetchMovieDetail } from "../services"

export const MovieDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [movie, setMovie] = useState(null)
  const [showtime, setShowtime] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMovieDetail(id)
      .then((res) => setMovie(res.data.content))
      .catch((err) => console.error(err))

    fetchLichChieu(id)
      .then((res) => setShowtime(res.data.content))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [id])

  if (loading)
    return (
      <div className="text-center mt-20">
        <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full mx-auto"></div>
        <p className="mt-4">Đang tải...</p>
      </div>
    )

  if (!movie)
    return (
      <div className="text-center mt-20">
        <p>Không có dữ liệu</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Quay về trang chủ
        </button>
      </div>
    )

  const getEmbedUrl = (url) => {
    if (!url) return ""
    if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/")
    if (url.includes("youtu.be/"))
      return url.replace("youtu.be/", "youtube.com/embed/")
    return url
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">

        <img
          src={movie.hinhAnh}
          alt={movie.tenPhim}
          className="w-full h-96 object-cover"
        />

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{movie.tenPhim}</h1>

          <p className="mb-2">
            <strong>Ngày khởi chiếu:</strong>{" "}
            {new Date(movie.ngayKhoiChieu).toLocaleDateString("vi-VN")}
          </p>

          <p className="mb-2">
            <strong>Đánh giá:</strong> {movie.danhGia}/10
          </p>

          <p className="mb-4">
            <strong>Mô tả:</strong> {movie.moTa}
          </p>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Trailer</h2>

            <div className="aspect-video">
              <iframe
                src={getEmbedUrl(movie.trailer)}
                className="w-full h-full rounded"
                allowFullScreen
                title="Trailer"
              ></iframe>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">Lịch chiếu</h2>

            {!showtime?.heThongRapChieu?.length && (
              <p>Hiện chưa có lịch chiếu</p>
            )}

            {showtime?.heThongRapChieu?.map((heThong) => (
              <div
                key={heThong.maHeThongRap}
                className="mb-6 border-b pb-4"
              >
                <h3 className="text-lg font-semibold text-red-600 mb-2">
                  {heThong.tenHeThongRap}
                </h3>

                {heThong.cumRapChieu.map((cumRap) => (
                  <div key={cumRap.maCumRap} className="ml-4 mb-3">
                    <p className="font-medium">{cumRap.tenCumRap}</p>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {cumRap.lichChieuPhim
                        .sort(
                          (a, b) =>
                            new Date(a.ngayChieuGioChieu) -
                            new Date(b.ngayChieuGioChieu)
                        )
                        .map((lich) => (
                          <button
                            key={lich.maLichChieu}
                            onClick={() => navigate(`/booking?maLichChieu=${lich.maLichChieu}`)}
                            className="bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 text-sm"
                          >
                            {new Date(lich.ngayChieuGioChieu).toLocaleTimeString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("/")}
            className="mt-6 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
          >
            ← Quay về trang chủ
          </button>
        </div>
      </div>
    </div>
  )
}