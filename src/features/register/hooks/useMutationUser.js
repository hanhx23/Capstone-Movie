import { useMutation } from '@tanstack/react-query'
import { userService } from '../services'
import {toast} from 'sonner'

export const useMutationUser = () => {
  //create user
  const createUser = useMutation ({
    mutationFn: (payload) => userService.dangKy(payload),
    onSuccess(){
        toast.success('Đăng ký thành công')
    },
    onError(){
        toast.error('Đăng ký thất bại')
    }
  })

  // update User
  const updateUser = useMutation({
    mutationFn:(payload) => userService.dangKy(payload),
  })

  // delete User
  const deleteUser = useMutation({
    mutationFn:(payload) => userService.dangKy(payload),
  })

    return {createUser, updateUser, deleteUser}
}
