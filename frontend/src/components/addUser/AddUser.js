import React, { useState } from "react";
import styles from "./styles.module.scss";
import axios from "axios";
import Swal from "sweetalert2";
import useNetwork from "../../hooks/useNetwork";

const AddUser = ({ cancelAction, userId }) => {
    let url = "http://localhost:1198/api/v1";

    console.log(userId, "userId");
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

    const [isLoading, setIsLoading] = useState(false);
    const [person, setPerson] = useState({
        username: "",
        mobile: "",
        email: "",
        userId: userId
    });
    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(person, "person");
        // return;

        if (person.username.trim().length < 3) {
            handleError("username length minimum 3 required");
            return;
        }

        if (person.mobile.trim().length < 10) {
            handleError("mobile length minimum 10 required");
            return;
        }

        if (person.email.trim().length === 0 || !person.email.match(/^(?=[^@]*[A-Za-z])([a-zA-Z0-9])(([a-zA-Z0-9])*([\._-])?([a-zA-Z0-9]))*@(([a-zA-Z0-9\-])+(\.))+([a-zA-Z]{2,4})+$/i)) {
            handleError("Invalid Email [only alphanumeric allowed]");
            return false;
        }

        try {
            if (!online) {
                handleError("NOT CONNECTED TO INTERNET. Enable WI-FI / Mobile Data.");
                return;
            }
            setIsLoading(true);
            console.log(person, "inside try");
            const response = await axios.post(`${url}/contact/add-contact`,
                person, { withCredentials: true });
            const { success, message, contact } = response.data;
            if (success) {
                handleSuccess(message);
                window.location.reload();
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
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.heading}>Add New User</h3>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input type="text" name="username" id="username" placeholder="Username" value={person.username} onChange={(event) => setPerson({
                    ...person,
                    username: event.target.value
                })} />

                <label htmlFor="mobile">Mobile</label>
                <input type="number" name="mobile" id="mobile" placeholder="mobile" value={person.mobile} onChange={(event) => setPerson({
                    ...person,
                    mobile: event.target.value
                })} />

                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" placeholder="Email" value={person.email} onChange={(event) => setPerson({
                    ...person,
                    email: event.target.value
                })} />

                <button type="submit" disabled={isLoading}>Save</button>
                <button name="cancel" onClick={() => cancelAction(false)}>Cancel</button>
            </form>
        </div>
    )
}

export default AddUser
