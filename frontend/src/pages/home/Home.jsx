import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import Header from "../../components/header/Header";

import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import Swal from "sweetalert2";
import Dashboard from "../dashboard";
import AddUser from "../../components/addUser";
import useNetwork from "../../hooks/useNetwork";


const Home = () => {
    let url = "http://localhost:1198/api/v1";

    const handleError = (err) => {
        let timerInterval;
        Swal.fire({
            title: 'Error!',
            text: err,
            icon: 'error',
            confirmButtonText: 'Okay'
        });
    }
    const handleSuccess = (msg) => {
        let timerInterval;
        Swal.fire({
            title: 'Success',
            html: msg,
            timer: 2000,
            timerProgressBar: true,
            willClose: () => {
                clearInterval(timerInterval)
            }
        });
    }

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
    const [cookies, removeCookie] = useCookies([]);
    const [user, setUser] = useState({ username: "", email: "" });
    useEffect(() => {
        const verifyCookie = async () => {
            if (!cookies.token) {
                navigate("/login");
            }
            if (!online) {
                handleError("NOT CONNECTED TO INTERNET. Enable WI-FI / Mobile Data.");
                return;
            }
            try {
                const response = await axios.post(`${url}/user`, {}, { withCredentials: true });
                const { success, user } = response.data;
                // console.log(success, user, cookies, cookies.token, "success user cookies");
                setUser({ username: user?.username, email: user?.email });

                return success
                    ? ""//handleSuccess(`Hello ${user.username}`)
                    : (removeCookie("token"), navigate("/login"));
            } catch (error) {
                console.log(error, "catch error");
                if (error.response?.status === 429) {
                    handleError(error.response.data);
                } else {
                    handleError(error.message);
                }
            }
        };
        verifyCookie();
    }, [cookies, navigate, removeCookie]);
    const Logout = () => {
        removeCookie("token");
        navigate("/login");
    };

    // add new user
    const [addUserFlag, setAddUserFlag] = useState(false);
    const [newContact, setNewContact] = useState();

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.contentContainer}>
                <h4 className={styles.heading}>
                    <span>Welcome {user.username}</span>
                    <button onClick={Logout}>LOGOUT</button>
                </h4>

                <div className={styles.addNewUserContainer}>
                    <button className={`${styles.addNewUserButton} addNewUserButton`} title="add new user" onClick={() => setAddUserFlag(!addUserFlag)}>{addUserFlag ? "-" : "+"}</button>
                </div>

                {addUserFlag ? <AddUser cancelAction={setAddUserFlag} userId={user.email} /> : ""}

                <Dashboard userId={user.email} />
            </div>
        </div>
    )
}

export default Home
