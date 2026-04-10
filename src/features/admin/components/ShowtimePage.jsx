import { useEffect, useState } from "react"
import { Button, DatePicker, Form, Input, InputNumber, Select } from "antd"
import { useNavigate, useParams } from "react-router"
import { useSelector } from "react-redux"
import { toast } from "sonner"
import dayjs from "dayjs"
import { PRIVATE_PATH } from "@/constant"
import { fetchHeThongRap, fetchCumRapTheoHeThong, fetchTaoLichChieu } from "../service/fetchShowtime"
import { fetchPhim } from "@/features/home/services/fetchPhim"

export const ShowtimePage = () => {
    const { idFilm } = useParams()
    const navigate = useNavigate()
    const userInfo = useSelector((state) => state.auth.userInfo)
    const [form] = Form.useForm()

    const [phim, setPhim] = useState(null)
    const [heThongRapList, setHeThongRapList] = useState([])
    const [cumRapList, setCumRapList] = useState([])
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        fetchPhim()
            .then((res) => {
                const found = res.data.content.find((p) => p.maPhim === Number(idFilm))
                setPhim(found)
            })

        fetchHeThongRap()
            .then((res) => setHeThongRapList(res.data.content))
            .catch(console.error)
    }, [idFilm])

    if (!userInfo || userInfo.maLoaiNguoiDung !== "QuanTri") {
        return <div className="text-center py-10">Bạn không có quyền truy cập.</div>
    }

    const handleChonHeThong = (maHeThongRap) => {
        form.setFieldValue("maRap", undefined)
        setCumRapList([])
        fetchCumRapTheoHeThong(maHeThongRap)
            .then((res) => setCumRapList(res.data.content))
            .catch(console.error)
    }

    const handleSubmit = () => {
        form
            .validateFields()
            .then((values) => {
                const data = {
                    maPhim: Number(idFilm),
                    ngayChieuGioChieu: values.ngayChieuGioChieu.format("DD/MM/YYYY hh:mm:ss"),
                    maRap: values.maRap,
                    giaVe: values.giaVe,
                }

                setSubmitting(true)
                fetchTaoLichChieu(data)
                    .then(() => {
                        toast.success("Tạo lịch chiếu thành công!")
                        form.resetFields()
                        form.setFieldValue("maPhim", Number(idFilm))
                    })
                    .catch((err) => {
                        console.error(err.response?.data)
                        toast.error(err.response?.data?.message || "Tạo lịch chiếu thất bại")
                    })
                    .finally(() => setSubmitting(false))
            })
            .catch(() => { })
    }

    return (
        <div className="p-8">
                <h2 className="text-2xl font-bold mb-6">
                    Tạo lịch chiếu — {phim?.tenPhim}
                </h2>

                {phim && (
                    <img
                        src={phim.hinhAnh}
                        alt={phim.tenPhim}
                        className="w-40 h-52 object-cover rounded shadow mb-6"
                    />
                )}

                <Form
                    form={form}
                    layout="horizontal"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                    initialValues={{ maPhim: Number(idFilm) }}
                >
                    <Form.Item
                        label="Hệ thống rạp"
                        name="maHeThongRap"
                        rules={[{ required: true, message: "Vui lòng chọn hệ thống rạp" }]}
                    >
                        <Select
                            placeholder="Chọn hệ thống rạp"
                            onChange={handleChonHeThong}
                            options={heThongRapList.map((r) => ({
                                value: r.maHeThongRap,
                                label: r.tenHeThongRap,
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Cụm rạp"
                        name="maRap"
                        rules={[{ required: true, message: "Vui lòng chọn cụm rạp" }]}
                    >
                        <Select
                            placeholder="Chọn cụm rạp"
                            disabled={cumRapList.length === 0}
                            options={cumRapList.map((c) => ({
                                value: c.maCumRap,
                                label: c.tenCumRap,
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Ngày chiếu giờ chiếu"
                        name="ngayChieuGioChieu"
                        rules={[{ required: true, message: "Vui lòng chọn ngày giờ chiếu" }]}
                    >
                        <DatePicker
                            showTime
                            format="DD/MM/YYYY HH:mm:ss"
                            className="w-full"
                            disabledDate={(current) => current && current < dayjs().startOf("day")}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Giá vé"
                        name="giaVe"
                        rules={[{ required: true, message: "Vui lòng nhập giá vé" }]}
                    >
                        <InputNumber
                            min={75000}
                            max={200000}
                            step={5000}
                            className="w-full"
                            formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            parser={(v) => v.replace(/,/g, "")}
                            addonAfter="VNĐ"
                        />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 6 }}>
                        <Button
                            type="primary"
                            loading={submitting}
                            onClick={handleSubmit}
                        >
                            Tạo lịch chiếu
                        </Button>
                        <Button
                            className="ml-3"
                            onClick={() => navigate(PRIVATE_PATH.ADMIN_FILMS)}
                        >
                            Quay lại
                        </Button>
                    </Form.Item>
                </Form>
        </div>
    )
}