import { Tabs } from 'antd'
import React from 'react'
import { UserInfo } from './UserInfo'

export const UserProfilePage = () => {
    return (
        <div>
            <Tabs
                items={[
                    {
                        key: 'info',
                        label: 'Thông tin cá nhân',
                        children: <UserInfo />
                    },
                    {
                        key: 'booking',
                        label: 'Lịch sử đặt vé',
                        children: <div>Lịch sử đặt vé</div>
                    }
                ]}
            />
        </div>
    )
}
