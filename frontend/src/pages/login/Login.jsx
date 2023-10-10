import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Header from "../../components/header/Header";
import styles from "./styles.module.scss";
import { useCookies } from "react-cookie";
import useNetwork from "../../hooks/useNetwork";

const Login = () => {
    let url = "http://localhost:1198/api/v1";

    const handleError = (err) => {
        Swal.fire({
            title: 'Error!',
            text: err,
            icon: 'error',
            confirmButtonText: 'Okay'
        });
    }
    const handleSuccess = (msg) => {
        Swal.fire({
            title: 'Success!',
            text: msg,
            icon: 'success',
            confirmButtonText: 'Okay'
        });
    }

    const [cookies, removeCookie] = useCookies([]);
    useEffect(() => {
        console.log(cookies.token, "cookies.token");
        if (cookies.token.length > 20) {
            navigate("/home");
        }
    }, []);

    const networkState = useNetwork();
    const {
        online,
        since,
        downLink,
        downLinkMax,
        effectiveType,
        rtt,
        saveData,
        type,
    } = networkState;

    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState({
        email: "",
        password: "",
    });
    const { email, password } = inputValue;
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setInputValue({
            ...inputValue,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (!online) {
                handleError("NOT CONNECTED TO INTERNET. Enable WI-FI / Mobile Data.");
                return;
            }
            const { data } = await axios.post(`${url}/user/login`, { ...inputValue }, { withCredentials: true });
            console.log(data);
            const { success, message } = data;
            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate("/");
                }, 1000);
            } else {
                handleError(message);
            }
        } catch (error) {
            console.log(error, "catch error");
            if (error.response?.status === 429) {
                handleError(error.response.data);
            } else {
                handleError(error.message);
            }
        }
        setInputValue({
            ...inputValue,
            email: "",
            password: "",
        });
    };

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.contentContainer}>
                <h2 className={styles.heading}>Login Account</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        placeholder="Enter your email"
                        onChange={handleOnChange}
                    />

                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        placeholder="Enter your password"
                        onChange={handleOnChange}
                    />

                    <button type="submit">Submit</button>
                </form>
            </div>

        </div>
    );
};

export default Login;