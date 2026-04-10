import { useEffect, useState } from "react"
import {
  Button, DatePicker, Form, Input, InputNumber,
  Modal, Popconfirm, Space, Switch, Table
} from "antd"
import { toast } from "sonner"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router"
import dayjs from "dayjs"
import { fetchPhim } from "@/features/home/services/fetchPhim"
import { PRIVATE_PATH } from "@/constant"
import { fetchCapNhatPhim, fetchXoaPhim } from "../service"

const { Search } = Input

export const FilmManagementPage = () => {
  const userInfo = useSelector((state) => state.auth.userInfo)
  const navigate = useNavigate()

  const [phimList, setPhimList] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [error, setError] = useState(null)

  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingPhim, setEditingPhim] = useState(null)
  const [updating, setUpdating] = useState(false)
  const [previewImg, setPreviewImg] = useState(null)
  const [fileImg, setFileImg] = useState(null)
  const [editForm] = Form.useForm()

  const loadPhim = () => {
    setLoading(true)
    fetchPhim()
      .then((res) => {
        setPhimList(res.data.content)
        setFiltered(res.data.content)
      })
      .catch((err) => setError(err.response?.data?.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadPhim()
  }, [])

  if (!userInfo || userInfo.maLoaiNguoiDung !== "QuanTri") {
    return <div className="text-center py-10">Bạn không có quyền truy cập trang này.</div>
  }

  const handleSearch = (value) => {
    const keyword = value.toLowerCase()
    setFiltered(phimList.filter((p) => p.tenPhim.toLowerCase().includes(keyword)))
  }

  const handleDelete = (maPhim) => {
    setDeleting(maPhim)
    fetchXoaPhim(maPhim)
      .then(() => {
        toast.success("Xóa phim thành công")
        loadPhim()
      })
      .catch((err) => toast.error(err.response?.data?.message || "Xóa phim thất bại"))
      .finally(() => setDeleting(null))
  }

  const compressImage = (file, maxSizeMB = 0.8) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (e) => {
        const img = new Image()
        img.src = e.target.result
        img.onload = () => {
          const canvas = document.createElement("canvas")
          let { width, height } = img
          const maxDimension = 800
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height / width) * maxDimension
              width = maxDimension
            } else {
              width = (width / height) * maxDimension
              height = maxDimension
            }
          }
          canvas.width = width
          canvas.height = height
          canvas.getContext("2d").drawImage(img, 0, 0, width, height)
          let quality = 0.9
          const compress = () => {
            canvas.toBlob((blob) => {
              if (blob.size > maxSizeMB * 1024 * 1024 && quality > 0.1) {
                quality -= 0.1
                compress()
              } else {
                resolve(new File([blob], file.name, { type: "image/jpeg", lastModified: Date.now() }))
              }
            }, "image/jpeg", quality)
          }
          compress()
        }
      }
    })
  }

  const handleOpenEdit = (phim) => {
    setEditingPhim(phim)
    setPreviewImg(phim.hinhAnh)
    setFileImg(null)
    editForm.setFieldsValue({
      tenPhim: phim.tenPhim,
      trailer: phim.trailer,
      moTa: phim.moTa,
      ngayKhoiChieu: dayjs(phim.ngayKhoiChieu),
      dangChieu: phim.dangChieu,
      sapChieu: phim.sapChieu,
      hot: phim.hot,
      danhGia: phim.danhGia,
    })
    setEditModalOpen(true)
  }

  const handleCloseEdit = () => {
    setEditModalOpen(false)
    setEditingPhim(null)
    setPreviewImg(null)
    setFileImg(null)
    editForm.resetFields()
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPreviewImg(URL.createObjectURL(file))
    const compressed = await compressImage(file)
    setFileImg(compressed)
  }

  const handleUpdate = () => {
    editForm
      .validateFields()
      .then((values) => {
        const formData = new FormData()
        formData.append("maPhim", editingPhim.maPhim)
        formData.append("tenPhim", values.tenPhim)
        formData.append("trailer", values.trailer || "")
        formData.append("moTa", values.moTa || "")
        formData.append("maNhom", "GP01")
        formData.append("ngayKhoiChieu", values.ngayKhoiChieu.format("DD/MM/YYYY"))
        formData.append("sapChieu", values.sapChieu ?? false)
        formData.append("dangChieu", values.dangChieu ?? true)
        formData.append("hot", values.hot ?? false)
        formData.append("danhGia", values.danhGia ?? 10)
        if (fileImg) {
          formData.append("hinhAnh", fileImg, fileImg.name)
        }

        setUpdating(true)
        fetchCapNhatPhim(formData)
          .then(() => {
            toast.success("Cập nhật phim thành công!")
            handleCloseEdit()
            loadPhim()
          })
          .catch((err) => {
            console.error("Lỗi:", err.response?.data)
            toast.error(err.response?.data?.message || "Cập nhật thất bại")
          })
          .finally(() => setUpdating(false))
      })
      .catch(() => { })
  }

  const columns = [
    {
      title: "Mã phim",
      dataIndex: "maPhim",
      key: "maPhim",
      width: 100,
    },
    {
      title: "Hình ảnh",
      dataIndex: "hinhAnh",
      key: "hinhAnh",
      width: 100,
      render: (src, row) => (
        <img
          src={src}
          alt={row.tenPhim}
          className="w-12 h-14 object-cover rounded"
          onError={(e) => { e.target.src = "https://via.placeholder.com/48x56?text=No+Img" }}
        />
      ),
    },
    {
      title: "Tên phim",
      dataIndex: "tenPhim",
      key: "tenPhim",
    },
    {
      title: "Mô tả",
      dataIndex: "moTa",
      key: "moTa",
      render: (text) => (
        <span className="line-clamp-2 text-sm text-gray-600">{text || "—"}</span>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 100,
      render: (_, row) => (
        <Space>
          <Button
            type="link"
            icon={<span className="text-blue-500">✏️</span>}
            className="p-0 h-auto"
            onClick={() => handleOpenEdit(row)}
          />
          <Popconfirm
            title="Xóa phim này?"
            description="Hành động này không thể hoàn tác"
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ loading: deleting === row.maPhim, danger: true }}
            onConfirm={() => handleDelete(row.maPhim)}
          >
            <Button
              type="link"
              danger
              icon={<span>🗑️</span>}
              className="p-0 h-auto"
            />
          </Popconfirm>
          <Button
            type="link"
            icon={<span>🗓️</span>}
            className="p-0 h-auto"
            onClick={() =>
              navigate(PRIVATE_PATH.ADMIN_SHOWTIME.replace(":idFilm", row.maPhim))
            }
          />
        </Space>
      ),
    },
  ]

  return (
    <div className="p-6">
        <h2 className="text-center text-2xl font-bold mb-4">Quản lý Phim</h2>

        <div className="flex items-center gap-3 mb-4">
          <Button type="default" onClick={() => navigate(PRIVATE_PATH.ADMIN_FILMS_ADD)}>
            + Thêm phim
          </Button>
          <Search
            placeholder="Tìm kiếm tên phim..."
            allowClear
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
            className="max-w-md"
          />
        </div>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <Table
          rowKey="maPhim"
          columns={columns}
          dataSource={filtered}
          loading={loading}
          pagination={{ pageSize: 8 }}
        />

        {/* Modal Sửa phim */}
        <Modal
        title={`Sửa phim — ${editingPhim?.tenPhim}`}
        open={editModalOpen}
        onCancel={handleCloseEdit}
        onOk={handleUpdate}
        okText="Lưu thay đổi"
        cancelText="Hủy"
        confirmLoading={updating}
        width={700}
        destroyOnClose
      >
        <Form
          form={editForm}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          className="mt-4"
        >
          <Form.Item
            label="Tên phim"
            name="tenPhim"
            rules={[{ required: true, message: "Vui lòng nhập tên phim" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Trailer" name="trailer">
            <Input placeholder="Link YouTube trailer" />
          </Form.Item>

          <Form.Item label="Mô tả" name="moTa">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            label="Ngày khởi chiếu"
            name="ngayKhoiChieu"
            rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
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
            <InputNumber min={1} max={10} />
          </Form.Item>

          <Form.Item label="Hình ảnh">
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {previewImg && (
              <img
                src={previewImg}
                alt="preview"
                className="mt-3 w-28 h-36 object-cover rounded shadow"
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}