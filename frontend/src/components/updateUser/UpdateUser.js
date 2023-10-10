import React, { useState } from "react";
import styles from "./styles.module.scss";
import axios from "axios";
import Swal from "sweetalert2";
import useNetwork from "../../hooks/useNetwork";

const UpdateUser = ({ item, closeClick }) => {
    let url = "http://localhost:1198/api/v1";

    // console.log(item, "userId");
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
    const [contact, setContact] = useState({
        username: item.username,
        id: item._id
    });
    const handleSubmit = async (event) => {
        event.preventDefault();
        // console.log(contact, "contact");

        if (contact.username.trim().length < 3) {
            handleError("username length minimum 3 required");
            return;
        }

        try {
            if (!online) {
                handleError("NOT CONNECTED TO INTERNET. Enable WI-FI / Mobile Data.");
                return;
            }

            setIsLoading(true);
            const response = await axios.post(`${url}/contact/update-contact`,
                contact, { withCredentials: true });
            const { success, message } = response.data;
            if (success) {
                handleSuccess(message);
                setTimeout(() => { window.location.reload(); }, 1000 / 2);
            } else {
                handleError(message);
            }
        } catch (error) {
            // console.log(error);
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
            <h3 className={styles.heading}>Update User</h3>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input type="text" name="username" id="username" placeholder="Username" value={contact.username} onChange={(event) => setContact({
                    ...contact,
                    username: event.target.value
                })} />

                <button type="submit" disabled={isLoading}>Update</button>
                <button name="cancel" onClick={closeClick}>Cancel</button>
            </form>
        </div>
    )
}

export default UpdateUser
