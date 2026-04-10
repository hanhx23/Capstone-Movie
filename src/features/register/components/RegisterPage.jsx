import { PUBLIC_PATH } from '@/constant'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from 'antd'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { useMutationUser } from '../hooks/useMutationUser'
import { registerFormSchema } from '../schema/registerFormSchema'

export const RegisterPage = () => {
  const { createUser } = useMutationUser()

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: zodResolver(registerFormSchema)
  })

  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-lg rounded-[32px] bg-white/95 p-8 shadow-2xl ring-1 ring-slate-200 backdrop-blur-sm">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-600">Bắt đầu ngay</p>
            <h1 className="mt-4 text-3xl font-bold text-slate-900">Đăng ký tài khoản</h1>
            <p className="mt-3 text-sm text-slate-500">Tạo tài khoản mới để đặt vé và quản lý lịch sử cá nhân.</p>
          </div>

          <form
            className="space-y-6"
            onSubmit={handleSubmit(async (data) => {
              createUser.mutate(data, {
                onSuccess() {
                  navigate(PUBLIC_PATH.SIGN_IN)
                },
                onError() {
                  console.log('Đăng ký thất bại')
                }
              })
            })}
          >
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Họ tên</label>
              <Controller
                control={control}
                name='hoTen'
                render={({ field }) => <Input {...field} size="large" placeholder="Nhập họ tên" />}
              />
              <p className='text-red-500 text-xs mt-1'>{errors.hoTen?.message}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <Controller
                control={control}
                name='email'
                render={({ field }) => <Input {...field} size="large" type="email" placeholder="Nhập email" />}
              />
              <p className='text-red-500 text-xs mt-1'>{errors.email?.message}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tài khoản</label>
              <Controller
                control={control}
                name='taiKhoan'
                render={({ field }) => <Input {...field} size="large" placeholder="Chọn tên tài khoản" />}
              />
              <p className='text-red-500 text-xs mt-1'>{errors.taiKhoan?.message}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Mật khẩu</label>
              <Controller
                control={control}
                name='matKhau'
                render={({ field }) => <Input.Password {...field} size="large" placeholder="Tạo mật khẩu" />}
              />
              <p className='text-red-500 text-xs mt-1'>{errors.matKhau?.message}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Số điện thoại</label>
              <Controller
                control={control}
                name='soDt'
                render={({ field }) => <Input {...field} size="large" placeholder="Nhập số điện thoại" />}
              />
              <p className='text-red-500 text-xs mt-1'>{errors.soDt?.message}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Mã nhóm</label>
              <Controller
                control={control}
                name='maNhom'
                render={({ field }) => <Input {...field} size="large" placeholder="VD: GP01" />}
              />
              <p className='text-red-500 text-xs mt-1'>{errors.maNhom?.message}</p>
            </div>
            <Button
              className='w-full'
              color='red'
              variant='solid'
              htmlType='submit'
              loading={createUser.isPending}
              size='large'
            >
              Đăng ký
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            Đã có tài khoản?{' '}
            <Link className="font-semibold text-red-600 hover:text-red-700" to={PUBLIC_PATH.SIGN_IN}>
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
