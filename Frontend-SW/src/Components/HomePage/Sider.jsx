import React from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { FullSideBar } from "./FullSideBar";
export const Sider = () => {
    const isCollapsed = useSelector((state) => state.sidebarColapse.isCollapsed);
    return (
        <div >
        {!isCollapsed ? (
            <FullSideBar />
        ) : (
            <h1 className="text-white bg-gray-800">Not Collapsed</h1>   )
        }
        </div>
    );
    }