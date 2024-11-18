//create fake HomePage 
import React from 'react'
import LogOut from '../Components/logOut'
import { Sider } from '../Components/HomePage/Sider'


export const HomePage = () => {
    
    return (
        <div className='flex flex-row'>
        <Sider/>
        <LogOut/>
        <h1>Home Page</h1>
        
        </div>
    )
}
