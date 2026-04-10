import { useEffect, useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { toast } from "sonner"
import { fetchPhim, fetchLichChieu } from "@/features/home/services"
import { fetchPhongVe, datVe } from "../service"

export const Booking = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const maLichChieuFromUrl = searchParams.get("maLichChieu")
    const didLoadFromUrl = useRef(false)

    const [phimList, setPhimList] = useState([])
    const [phimDangChon, setPhimDangChon] = useState(null)
    const [lichChieu, setLichChieu] = useState(null)
    const [phongVe, setPhongVe] = useState(null)
    const [gheSelected, setGheSelected] = useState([])

    const [loading, setLoading] = useState(true)
    const [loadingLich, setLoadingLich] = useState(false)
    const [loadingGhe, setLoadingGhe] = useState(false)
    const [loadingDatVe, setLoadingDatVe] = useState(false)

    useEffect(() => {
        fetchPhim()
            .then((res) => setPhimList(res.data.content))
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        if (!maLichChieuFromUrl || didLoadFromUrl.current) return
        didLoadFromUrl.current = true

        setLoadingGhe(true)
        fetchPhongVe(maLichChieuFromUrl)
            .then((res) => setPhongVe(res.data.content))
            .catch(console.error)
            .finally(() => setLoadingGhe(false))
    }, [maLichChieuFromUrl])

    const handleChonPhim = (phim) => {
        setPhimDangChon(phim)
        setLichChieu(null)
        setPhongVe(null)
        setGheSelected([])
        setLoadingLich(true)
        didLoadFromUrl.current = true 

        navigate("/booking", { replace: true })

        fetchLichChieu(phim.maPhim)
            .then((res) => setLichChieu(res.data.content))
            .catch(console.error)
            .finally(() => setLoadingLich(false))
    }

    const handleChonSuat = (maLich) => {
        setPhongVe(null)
        setGheSelected([])
        setLoadingGhe(true)
        didLoadFromUrl.current = true 

        navigate(`/booking?maLichChieu=${maLich}`, { replace: true })

        fetchPhongVe(maLich)
            .then((res) => setPhongVe(res.data.content))
            .catch(console.error)
            .finally(() => setLoadingGhe(false))
    }

    const handleChonGhe = (ghe) => {
        if (ghe.daDat) return
        setGheSelected((prev) =>
            prev.find((g) => g.maGhe === ghe.maGhe)
                ? prev.filter((g) => g.maGhe !== ghe.maGhe)
                : [...prev, ghe]
        )
    }

    const tongTien = gheSelected.reduce((sum, g) => sum + g.giaVe, 0)

    if (loading) {
        return (
            <div className="text-center mt-20">
                <div className="animate-spin h-10 w-10 border-b-2 border-red-600 rounded-full mx-auto"></div>
                <p className="mt-4">Đang tải danh sách phim...</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex gap-6">

                <div className="w-1/4 space-y-4">
                    <h2 className="text-xl font-semibold text-gray-700">1. Chọn phim</h2>

                    <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                        {phimList.map((phim) => (
                            <div
                                key={phim.maPhim}
                                onClick={() => handleChonPhim(phim)}
                                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer border transition
                                    ${phimDangChon?.maPhim === phim.maPhim
                                        ? "border-red-500 bg-red-50"
                                        : "border-gray-200 hover:border-red-300"
                                    }`}
                            >
                                <img
                                    src={phim.hinhAnh}
                                    alt={phim.tenPhim}
                                    className="w-12 h-16 object-cover rounded"
                                />
                                <span className="text-sm font-medium line-clamp-2">
                                    {phim.tenPhim}
                                </span>
                            </div>
                        ))}
                    </div>

                    {phimDangChon && (
                        <>
                            <h2 className="text-xl font-semibold mt-6">2. Chọn suất chiếu</h2>

                            {loadingLich && <p className="text-sm text-gray-500">Đang tải...</p>}

                            {lichChieu?.heThongRapChieu?.map((heThong) => (
                                <div key={heThong.maHeThongRap} className="mb-3">
                                    <p className="font-bold text-red-600 mb-1">
                                        {heThong.tenHeThongRap}
                                    </p>
                                    {heThong.cumRapChieu?.map((cumRap) => (
                                        <div key={cumRap.maCumRap} className="ml-2 mb-2">
                                            <p className="text-sm font-medium text-gray-700 mb-1">
                                                {cumRap.tenCumRap}
                                            </p>
                                            <div className="flex flex-wrap gap-1">
                                                {cumRap.lichChieuPhim?.map((lich) => (
                                                    <button
                                                        key={lich.maLichChieu}
                                                        onClick={() => handleChonSuat(lich.maLichChieu)}
                                                        className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs hover:bg-green-300 transition"
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
                        </>
                    )}
                </div>

                <div className="w-2/4">
                    {(phimDangChon || phongVe?.thongTinPhim) && (
                        <div className="bg-white shadow-md rounded-xl p-4 mb-5 flex gap-4 items-center border">
                            <img
                                src={phimDangChon?.hinhAnh || phongVe?.thongTinPhim?.hinhAnh}
                                alt="phim"
                                className="w-16 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-800">
                                    {phimDangChon?.tenPhim || phongVe?.thongTinPhim?.tenPhim}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {phongVe?.thongTinPhim?.tenCumRap}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {phongVe?.thongTinPhim?.ngayChieu} —{" "}
                                    {phongVe?.thongTinPhim?.gioChieu}
                                </p>
                            </div>
                            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                                Đang chọn
                            </span>
                        </div>
                    )}

                    <h2 className="text-xl font-semibold text-gray-700 mb-3">3. Chọn ghế</h2>

                    {loadingGhe && (
                        <p className="text-sm text-gray-500">Đang tải sơ đồ ghế...</p>
                    )}

                    {phongVe && (
                        <>
                            <div className="bg-gray-800 text-white text-center py-2 rounded mb-6 text-sm tracking-widest">
                                MÀN HÌNH
                            </div>

                            <div className="flex flex-wrap gap-1 justify-center">
                                {phongVe.danhSachGhe?.map((ghe) => {
                                    const isSelected = gheSelected.find((g) => g.maGhe === ghe.maGhe)
                                    const isVip = ghe.loaiGhe === "Vip"
                                    return (
                                        <button
                                            key={ghe.maGhe}
                                            onClick={() => handleChonGhe(ghe)}
                                            title={`${ghe.tenGhe} - ${ghe.giaVe?.toLocaleString()}đ`}
                                            disabled={ghe.daDat}
                                            className={`w-8 h-8 text-xs rounded transition font-medium
                                                ${ghe.daDat
                                                    ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                                                    : isSelected
                                                        ? "bg-yellow-400 text-gray-900"
                                                        : isVip
                                                            ? "bg-purple-500 text-white hover:bg-purple-600"
                                                            : "bg-blue-500 text-white hover:bg-blue-600"
                                                }`}
                                        >
                                            {ghe.tenGhe}
                                        </button>
                                    )
                                })}
                            </div>

                            <div className="flex gap-4 mt-6 justify-center text-sm">
                                <span className="flex items-center gap-1">
                                    <span className="w-4 h-4 bg-blue-500 rounded inline-block"></span> Thường
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="w-4 h-4 bg-purple-500 rounded inline-block"></span> VIP
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="w-4 h-4 bg-yellow-400 rounded inline-block"></span> Đang chọn
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="w-4 h-4 bg-gray-300 rounded inline-block"></span> Đã đặt
                                </span>
                            </div>
                        </>
                    )}
                </div>

                {/* CỘT PHẢI */}
                <div className="w-1/4">
                    <h2 className="text-xl font-semibold text-gray-700 mb-3">4. Xác nhận</h2>

                    <div className="bg-gray-50 rounded-lg p-4 border space-y-3">
                        <div>
                            <p className="text-xs text-gray-500">Phim</p>
                            <p className="font-semibold text-sm">
                                {phimDangChon?.tenPhim || phongVe?.thongTinPhim?.tenPhim || "Chưa chọn"}
                            </p>
                        </div>

                        {gheSelected.length > 0 && (
                            <div>
                                <p className="text-xs text-gray-500">Ghế</p>
                                <div className="flex flex-wrap gap-1">
                                    {gheSelected.map((g) => (
                                        <span
                                            key={g.maGhe}
                                            className="bg-yellow-400 px-2 py-0.5 rounded text-xs font-medium"
                                        >
                                            {g.tenGhe}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="border-t pt-3">
                            <p className="text-xs text-gray-500">Tổng tiền</p>
                            <p className="text-xl font-bold text-red-600">
                                {tongTien.toLocaleString("vi-VN")}đ
                            </p>
                        </div>

                        <button
                            disabled={gheSelected.length === 0 || loadingDatVe}
                            onClick={async () => {
                                try {
                                    setLoadingDatVe(true)
                                    const danhSachVe = gheSelected.map((ghe) => ({
                                        maGhe: ghe.maGhe,
                                        giaVe: ghe.giaVe,
                                    }))
                                    await datVe({
                                        maLichChieu: maLichChieuFromUrl,
                                        danhSachVe,
                                    })
                                    toast.success("Đặt vé thành công!")
                                    setGheSelected([])
                                    setLoadingGhe(true)
                                    const res = await fetchPhongVe(maLichChieuFromUrl)
                                    setPhongVe(res.data.content)
                                    setLoadingGhe(false)
                                } catch (error) {
                                    console.error("Lỗi đặt vé:", error)
                                    toast.error("Đặt vé thất bại. Vui lòng đăng nhập!")
                                } finally {
                                    setLoadingDatVe(false)
                                }
                            }}
                            className={`w-full py-2 rounded text-white font-semibold transition
                                ${gheSelected.length > 0 && !loadingDatVe
                                    ? "bg-red-600 hover:bg-red-700"
                                    : "bg-gray-300 cursor-not-allowed"
                                }`}
                        >
                            {loadingDatVe ? "Đang đặt vé..." : `Đặt vé (${gheSelected.length})`}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}