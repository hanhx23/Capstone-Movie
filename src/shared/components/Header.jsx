import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router'
import { Button, Divider, Popover } from 'antd'
import { APP_CONFIG } from '@/config'
import { LOCAL_STORAGE_KEYS, PRIVATE_PATH, PUBLIC_PATH } from '@/constant'
import { useDispatch, useSelector } from 'react-redux'
import { authActions } from '@/store/auth.slice'
// import { APP_CONFIG } from '../../config/appConfig'

export const Header = () => {
    const navigate = useNavigate()
    
    const dispatch = useDispatch()
    const userInfo = useSelector((s) => s.auth.userInfo)

    console.log({userInfo})

    return (
        <header className='shadow' style={{ minHeight: APP_CONFIG.HEADER_HEIGHT }}>
            <div className='container mx-auto flex items-center justify-between h-full'>
                <h1 className='text-4xl font-semibold'>
                    <Link to={PUBLIC_PATH.HOME}>Movie</Link>
                </h1>
                <nav className='space-x-4'>
                    <NavLink to={PUBLIC_PATH.SCHEDULE}>Lịch Chiếu</NavLink>
                    <NavLink to={PUBLIC_PATH.CINEMA}>Rạp Chiếu</NavLink>
                    <NavLink to={PUBLIC_PATH.PROMOTION}>Khuyến Mãi</NavLink>
                    {
                        userInfo && (
                            <NavLink to={PRIVATE_PATH.ADMIN}>Admin</NavLink>
                        )
                    }
                </nav>

                {!userInfo ? (
                    <div className='space-x-5'>
                        <Button
                            color='red'
                            variant='solid'
                            onClick={() => navigate(PUBLIC_PATH.SIGN_IN)}
                        >
                            Đăng nhập
                        </Button>
                        <Button
                            color='red'
                            variant='dashed'
                            onClick={() => navigate(PUBLIC_PATH.REGISTER)}
                        >
                            Đăng ký
                        </Button>
                    </div>
                ) : (
                    <Popover
                        trigger="click"
                        content={
                            <div>
                                <div className='flex flex-col gap-1'>
                                    <Button>Thông tin cá nhân</Button>
                                    <Button>ABC</Button>
                                </div>
                                <Divider />
                                <Button
                                    danger
                                    className='w-full'
                                    onClick={() => {
                                        //xóa thông tin user trong redux store
                                        dispatch(authActions.clearCredentials())

                                        // xóa thông tin user trong localStorage
                                        localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_INFO)
                                        localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)
                                        
                                        // điều hướng về trang chú
                                        navigate(PUBLIC_PATH.HOME)
                                    }}
                                >
                                    Đăng xuất
                                </Button>
                            </div>
                        }
                    >
                        <div>Hi, {userInfo.hoTen}</div>
                    </Popover>
                )}
            </div>
        </header>

    )
}
