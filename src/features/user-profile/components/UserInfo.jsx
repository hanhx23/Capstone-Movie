import { Button, Input } from 'antd'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useQueryUser } from '../hooks'

export const UserInfo = () => {
    const {data: user} = useQueryUser()
    
    const { 
        control,
        handleSubmit,
        formState: {errors},
    } = useForm({
        values: {
            ...user,
            soDt: user?.soDt ?? '',
        },
    })

  return (
    <div>
        <form
            onSubmit={handleSubmit((data) => {
                console.log(data)
            })}
        >
            <div>
                <label htmlFor="">Họ tên</label>
                <Controller
                control={control}
                name='hoTen'
                render={({field}) => {
                    return <Input {...field}/>
                }}
                />
                <p className='text-red-500 text-xs'>{errors.hoTen?.message}</p>
            </div>
            <div>
                <label htmlFor="">Email</label>
                <Controller
                control={control}
                name='email'
                render={({field}) => {
                    return <Input {...field}/>
                }}
                />
                <p className='text-red-500 text-xs'>{errors.email?.message}</p>
            </div>
            <div>
                <label htmlFor="">Tài khoản</label>
                <Controller
                control={control}
                name='taiKhoan'
                render={({field}) => {
                    return <Input {...field}/>
                }}
                />
            </div>
            <div>
                <label htmlFor="">Mật khẩu</label>
                <Controller
                control={control}
                name='matKhau'
                render={({field}) => {
                    return <Input {...field}/>
                }}
                />
            </div>
            <div>
                <label htmlFor="">Số điện thoại</label>
                <Controller
                control={control}
                name='soDt'
                render={({field}) => {
                    return <Input {...field}/>
                }}
                />
            </div>
             <div>
                    <label htmlFor="">Mã nhóm</label>
                    <Controller
                        control={control}
                        name="maNhom"
                        render={({ field }) => {
                            return <Input {...field} />
                        }}
                    />
                </div>
            <Button
            htmlType='submit'
            className='w-full mt-4'
            size='large'
            color='red'
            variant='solid'
            >Chỉnh sửa</Button>
        </form>
    </div>
  )
}
