import React, { useEffect } from 'react'
import styles from "./styles.module.scss";
import { NavLink } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const Header = () => {
    return (
        <div className={styles.container}>
            <NavLink
                to="/home"
                className={styles.homeNavLink}
                style={({ isActive }) => { return { color: isActive ? "blue" : "white" } }}>
                Home
            </NavLink>
            <div className={styles.loginRegisterContainer}>
                <span>pls dont spam: 'speed limit & rate limit' are used</span>
                <NavLink
                    to="/login"
                    className={styles.loginNavLink}
                    style={({ isActive }) => { return { color: isActive ? "blue" : "white" } }}>
                    Login
                </NavLink>
                <NavLink
                    to="/register"
                    className={styles.registerNavLink}
                    style={({ isActive }) => { return { color: isActive ? "blue" : "white" } }}>
                    Register
                </NavLink>
            </div>
        </div>
    )
}

export default Header
