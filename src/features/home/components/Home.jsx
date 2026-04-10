import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import {
  fetchBanner,
  fetchPhim,
} from "../services"


export const Home = () => {
  const navigate = useNavigate()

  const [banners, setBanners] = useState([])
  const [phimList, setPhimList] = useState([])
  const [loading, setLoading] = useState(true)

  const [trailerUrl, setTrailerUrl] = useState(null)

  useEffect(() => {
    Promise.all([fetchBanner(), fetchPhim()])
      .then(([bannerRes, phimRes]) => {
        const bannerData = bannerRes.data.content
          .map(({ maBanner, maPhim, hinhAnh }) => ({
            maBanner,
            maPhim,
            hinhAnh,
          }))
          .filter((b) => b.maBanner === 1)

        setBanners(bannerData)
        setPhimList(phimRes.data.content)
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const getEmbedUrl = (url) => {
    if (!url) return ""
    return url.replace("watch?v=", "embed/")
  }

  if (loading)
    return (
      <div className="text-center mt-20">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4">Đang tải dữ liệu...</p>
      </div>
    )

  return (
    <div className="container mx-auto px-4">
      {/* Banner */}
      <section className="w-full mb-8">
        {banners.map((banner) => (
          <img
            key={banner.maBanner}
            src={banner.hinhAnh}
            alt={`banner-${banner.maBanner}`}
            className="w-full h-auto object-contain rounded-lg"
          />
        ))}
      </section>

      <section className="py-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Danh Sách Phim
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {phimList.map((phim) => (
            <div
              key={phim.maPhim}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition duration-300"
            >
              <div className="relative">
                <img
                  src={phim.hinhAnh}
                  alt={phim.tenPhim}
                  className="w-full h-80 object-cover"
                />

                <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                  HOT
                </span>

                <span className="absolute top-2 left-2 bg-yellow-400 text-gray-800 px-2 py-1 rounded text-sm font-bold">
                  ⭐ {phim.danhGia || 10}/10
                </span>
              </div>

              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                  {phim.tenPhim}
                </h3>

                <p className="text-gray-600 text-sm mb-3">
                  <strong>Ngày khởi chiếu:</strong>{" "}
                  {new Date(phim.ngayKhoiChieu).toLocaleDateString("vi-VN")}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/movie/${phim.maPhim}`)}
                    className="w-1/2 bg-blue-600 text-white px-2 py-2 rounded hover:bg-blue-700 transition text-sm"
                  >
                    Chi tiết
                  </button>
                  
                  <button
                    onClick={() => setTrailerUrl(phim.trailer)}
                    className="w-1/2 bg-red-600 text-white px-2 py-2 rounded hover:bg-red-700 transition text-sm"
                  >
                    Trailer
                  </button>
                  
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {trailerUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl p-4 relative">
            <button
              onClick={() => setTrailerUrl(null)}
              className="text-red-500 absolute top-2 right-2 text-2xl"
            >
              ×
            </button>

            <div className="aspect-video">
              <iframe
                src={getEmbedUrl(trailerUrl)}
                className="w-full h-full rounded"
                allowFullScreen
                title="Trailer"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}