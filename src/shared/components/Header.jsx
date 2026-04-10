import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router'
import { Button, Divider, Popover, Avatar } from 'antd'
import { UserOutlined, LogoutOutlined, IdcardOutlined } from '@ant-design/icons'
import { APP_CONFIG } from '@/config'
import { LOCAL_STORAGE_KEYS, PRIVATE_PATH, PUBLIC_PATH } from '@/constant'
import { useDispatch, useSelector } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
import { authActions } from '@/store/auth.slice'

export const Header = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const queryClient = useQueryClient()
    const userInfo = useSelector((s) => s.auth.userInfo)

    const handleLogout = () => {
        dispatch(authActions.clearCredentials())
        localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_INFO)
        localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)
        queryClient.clear()
        navigate(PUBLIC_PATH.HOME)
    }

    return (
        <header
            className="bg-gray-900 text-white shadow-lg flex items-center"
            style={{ minHeight: APP_CONFIG.HEADER_HEIGHT }}
        >
            <div className="container mx-auto flex items-center justify-between h-full px-4">

                <h1 className="text-2xl font-bold tracking-wide">
                    <Link
                        to={PUBLIC_PATH.HOME}
                        className="flex items-center gap-2 text-white hover:text-red-400 transition"
                    >
                        🎬 <span>MovieHub</span>
                    </Link>
                </h1>

                {/* NAV */}
                <nav className="flex items-center gap-6 text-sm font-medium">
                    <NavLink
                        to={PUBLIC_PATH.HOME}
                        className={({ isActive }) =>
                            isActive
                                ? "text-red-400 border-b-2 border-red-400 pb-0.5"
                                : "text-gray-300 hover:text-white transition"
                        }
                    >
                        Trang Chủ
                    </NavLink>
                    <NavLink
                        to={PUBLIC_PATH.BOOKING}
                        className={({ isActive }) =>
                            isActive
                                ? "text-red-400 border-b-2 border-red-400 pb-0.5"
                                : "text-gray-300 hover:text-white transition"
                        }
                    >
                        Đặt Vé
                    </NavLink>
                    {userInfo && (
                        <NavLink
                            to={PRIVATE_PATH.USER_PROFILE}
                            className={({ isActive }) =>
                                isActive
                                    ? "text-red-400 border-b-2 border-red-400 pb-0.5"
                                    : "text-gray-300 hover:text-white transition"
                            }
                        >
                            Lịch sử đặt vé
                        </NavLink>
                    )}
                    {userInfo?.maLoaiNguoiDung === "QuanTri" && (
                        <NavLink
                            to={PRIVATE_PATH.ADMIN}
                            className={({ isActive }) =>
                                isActive
                                    ? "text-red-400 border-b-2 border-red-400 pb-0.5"
                                    : "text-gray-300 hover:text-white transition"
                            }
                        >
                            Admin
                        </NavLink>
                    )}
                </nav>

                {!userInfo ? (
                    <div className="flex items-center gap-3">
                        <Button
                            color="red"
                            variant="solid"
                            onClick={() => navigate(PUBLIC_PATH.SIGN_IN)}
                        >
                            Đăng nhập
                        </Button>
                        <Button
                            color="red"
                            variant="outlined"
                            onClick={() => navigate(PUBLIC_PATH.REGISTER)}
                            className="text-white border-white hover:border-red-400 hover:text-red-400"
                        >
                            Đăng ký
                        </Button>
                    </div>
                ) : (
                    <Popover
                        trigger="click"
                        placement="bottomRight"
                        content={
                            <div className="w-48">
                                <div className="px-2 py-1 mb-2">
                                    <p className="font-semibold text-gray-800">{userInfo.hoTen}</p>
                                    <p className="text-xs text-gray-500">{userInfo.email}</p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Button
                                        icon={<IdcardOutlined />}
                                        type="text"
                                        className="text-left justify-start"
                                        onClick={() => navigate(PRIVATE_PATH.USER_PROFILE)}
                                    >
                                        Thông tin cá nhân
                                    </Button>
                                </div>
                                <Divider className="my-2" />
                                <Button
                                    danger
                                    icon={<LogoutOutlined />}
                                    className="w-full"
                                    onClick={handleLogout}
                                >
                                    Đăng xuất
                                </Button>
                            </div>
                        }
                    >
                        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition">
                            <Avatar
                                size={36}
                                icon={<UserOutlined />}
                                className="bg-red-500"
                            />
                            <div className="hidden md:block text-sm">
                                <p className="text-white font-medium leading-tight">{userInfo.hoTen}</p>
                                <p className="text-gray-400 text-xs leading-tight">{userInfo.maLoaiNguoiDung}</p>
                            </div>
                        </div>
                    </Popover>
                )}
            </div>
        </header>
    )
}