import { useMutation } from '@tanstack/react-query'
import { userService } from '../service'
import { toast } from 'sonner'
import { useAuthStore } from '../store'
import { useDispatch } from 'react-redux'
import { authActions } from '@/store/auth.slice'
import { LOCAL_STORAGE_KEYS } from '@/constant'

export const useMutationSignIn = () => {
    const setAuth = useAuthStore((s) => s.setAuth)
    const dispatch = useDispatch()

    return useMutation({
        mutationFn: (payload) => userService.dangNhap(payload),
        onSuccess(ressponse) {
            toast.success('Đăng nhập thành công')

            const { accessToken, ...rest } = ressponse.data.content

            // lưu thông tin người dùng vào localStorage
            localStorage.setItem(LOCAL_STORAGE_KEYS.USER_INFO, JSON.stringify(rest))

            // lưu token vào localStorage
            localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, accessToken)

            // hoặc lưu vào zustand store
            setAuth({ accessToken, userInfo: rest })

            // lưu token và user info vào redux store
            dispatch(authActions.setCredentials({ accessToken, userInfo: rest }))

        },
        onError(error) {
            toast.error(error.response.data.content)
        },
    })
}
