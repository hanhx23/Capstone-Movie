import z from "zod";

export const registerFormSchema = z.object({
  //khai báo tất cả các trường thông tin của form kèm validation nếu có
  hoTen: z
    .string({
      error: "Vui lòng nhập họ tên",
    })
    .min(1, "Vui lòng nhập họ tên")
    .min(5, "Họ tên phải có ít nhất 5 ký tự")
    .max(20, "Họ tên không được vượt quá 20 ký tự")
    .regex(/^[a-zA-Z\s]+$/, "Họ tên chỉ được chứa chữ cái và khoảng trắng"),

  email: z.email("Vui lòng nhập email hợp lệ").optional(),
  taiKhoan: z.string().optional(),
  matKhau: z.string().optional(),
  soDt: z.string().optional(),
  maNhom: z.string().optional(),
});
