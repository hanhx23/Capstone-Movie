import { useState } from "react"
import { Button, DatePicker, Form, Input, InputNumber, Switch } from "antd"
import { useNavigate } from "react-router"
import { useSelector } from "react-redux"
import { toast } from "sonner"
import { PRIVATE_PATH } from "@/constant"
import { fetchThemPhim } from "../service"

export const AddFilmPage = () => {
    const userInfo = useSelector((state) => state.auth.userInfo)
    const navigate = useNavigate()
    const [form] = Form.useForm()
    const [submitting, setSubmitting] = useState(false)
    const [previewImg, setPreviewImg] = useState(null)
    const [fileImg, setFileImg] = useState(null)

    if (!userInfo || userInfo.maLoaiNguoiDung !== "QuanTri") {
        return <div className="text-center py-10">Bạn không có quyền truy cập trang này.</div>
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setFileImg(file)
        setPreviewImg(URL.createObjectURL(file))
    }

    const handleSubmit = () => {
        form
            .validateFields()
            .then((values) => {
                if (!fileImg) {
                    toast.error("Vui lòng chọn hình ảnh")
                    return
                }

                const formData = new FormData()
                formData.append("maPhim", 0)
                formData.append("tenPhim", values.tenPhim)
                formData.append("trailer", values.trailer || "")
                formData.append("moTa", values.moTa || "")
                formData.append("maNhom", "GP01")
                formData.append("ngayKhoiChieu", values.ngayKhoiChieu.format("DD/MM/YYYY"))
                formData.append("sapChieu", values.sapChieu ?? false)
                formData.append("dangChieu", values.dangChieu ?? true)
                formData.append("hot", values.hot ?? false)
                formData.append("danhGia", values.danhGia ?? 10)
                formData.append("hinhAnh", fileImg, fileImg.name)

                // Debug — kiểm tra trước khi gửi
                for (let [key, value] of formData.entries()) {
                    console.log(key, "→", value)
                }

                setSubmitting(true)
                fetchThemPhim(formData)
                    .then(() => {
                        toast.success("Thêm phim thành công!")
                        form.resetFields()
                        setPreviewImg(null)
                        setFileImg(null)
                        navigate(PRIVATE_PATH.ADMIN_FILMS)
                    })
                    .catch((err) => {
                        console.error("Lỗi API:", err.response?.data)
                        toast.error(err.response?.data?.message || "Thêm phim thất bại")
                    })
                    .finally(() => setSubmitting(false))
            })
            .catch(() => { })
    }

    return (
        <div className="p-8">
            <h2 className="text-center text-2xl font-bold mb-6">Thêm mới phim</h2>

            <Form
                form={form}
                layout="horizontal"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 16 }}
                initialValues={{
                    dangChieu: true,
                    sapChieu: false,
                    hot: false,
                    danhGia: 10,
                }}
            >
                <Form.Item
                    label="Tên phim"
                    name="tenPhim"
                    rules={[{ required: true, message: "Vui lòng nhập tên phim" }]}
                >
                    <Input placeholder="Nhập tên phim" />
                </Form.Item>

                <Form.Item label="Trailer" name="trailer">
                    <Input placeholder="Link YouTube trailer" />
                </Form.Item>

                <Form.Item label="Mô tả" name="moTa">
                    <Input.TextArea rows={3} placeholder="Mô tả nội dung phim" />
                </Form.Item>

                <Form.Item
                    label="Ngày khởi chiếu"
                    name="ngayKhoiChieu"
                    rules={[{ required: true, message: "Vui lòng chọn ngày khởi chiếu" }]}
                >
                    <DatePicker format="DD/MM/YYYY" className="w-full" />
                </Form.Item>

                <Form.Item label="Đang chiếu" name="dangChieu" valuePropName="checked">
                    <Switch />
                </Form.Item>

                <Form.Item label="Sắp chiếu" name="sapChieu" valuePropName="checked">
                    <Switch />
                </Form.Item>

                <Form.Item label="Hot" name="hot" valuePropName="checked">
                    <Switch />
                </Form.Item>

                <Form.Item label="Số sao" name="danhGia">
                    <InputNumber min={1} max={10} className="w-24" />
                </Form.Item>

                <Form.Item label="Hình ảnh">
                    <label className="inline-block px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700">
                        Chọn ảnh
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </label>

                    {previewImg && (
                        <img
                            src={previewImg}
                            alt="preview"
                            className="mt-3 w-32 h-40 object-cover rounded shadow"
                        />
                    )}
                </Form.Item>


                <Form.Item wrapperCol={{ offset: 5 }}>
                    <Button type="primary" loading={submitting} onClick={handleSubmit}>
                        Thêm phim
                    </Button>
                    <Button className="ml-3" onClick={() => navigate(PRIVATE_PATH.ADMIN_FILMS)}>
                        Hủy
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}