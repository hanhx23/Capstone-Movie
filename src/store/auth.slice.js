import { LOCAL_STORAGE_KEYS } from '@/constant'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    accessToken: localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN) || null,
    userInfo: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_INFO)) || null,
}

export const { reducer: auth, actions: authActions } = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, { payload }) => {
            state.accessToken = payload.accessToken
            state.userInfo = payload.userInfo
        },
        clearCredentials: (state) => {
            state.accessToken = null
            state.userInfo = null
        },
    },
})

