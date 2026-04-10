import { PUBLIC_PATH } from '@/constant'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from 'antd'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router'
import z from 'zod'
import { useMutationSignIn } from '../hooks'

const signInSchema = z.object({
    taiKhoan: z.string().min(1, 'Vui lòng nhập tài khoản'),
    matKhau: z.string().min(1, 'Vui lòng nhập mật khẩu')
})

export const SignInPage = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        mode: 'onChange',
        resolver: zodResolver(signInSchema),
    })

    const signInMutation = useMutationSignIn()

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 py-12">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-md rounded-[32px] bg-white/95 p-8 shadow-2xl ring-1 ring-slate-200 backdrop-blur-sm">
                    <div className="mb-8 text-center">
                        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-600">Welcome back</p>
                        <h1 className="mt-4 text-3xl font-bold text-slate-900">Đăng nhập</h1>
                        <p className="mt-3 text-sm text-slate-500">Đăng nhập để tiếp tục đặt vé, xem lịch sử và quản lý tài khoản của bạn.</p>
                    </div>

                    <form
                        className="space-y-6"
                        onSubmit={handleSubmit(async (data) => {
                            await signInMutation.mutateAsync(data)
                            const path = searchParams.get('from') || PUBLIC_PATH.HOME
                            navigate(path)
                        })}
                    >
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Tài khoản</label>
                            <Controller
                                control={control}
                                name='taiKhoan'
                                render={({ field }) => <Input {...field} size="large" placeholder="Nhập tài khoản" />}
                            />
                            <p className='text-red-500 text-xs mt-1'>{errors.taiKhoan?.message}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Mật khẩu</label>
                            <Controller
                                control={control}
                                name='matKhau'
                                render={({ field }) => <Input.Password {...field} size="large" placeholder="Nhập mật khẩu" />}
                            />
                            <p className='text-red-500 text-xs mt-1'>{errors.matKhau?.message}</p>
                        </div>
                        <Button
                            className='w-full'
                            color='red'
                            variant='solid'
                            htmlType='submit'
                            loading={signInMutation.isPending}
                            size='large'
                        >
                            Đăng nhập
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-500">
                        Bạn chưa có tài khoản?{' '}
                        <Link className="font-semibold text-red-600 hover:text-red-700" to={PUBLIC_PATH.REGISTER}>
                            Đăng ký ngay
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
