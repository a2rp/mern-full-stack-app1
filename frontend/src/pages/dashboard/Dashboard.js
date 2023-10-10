import React, { useEffect, useRef, useState } from 'react';
import styles from "./styles.module.scss";
import axios from "axios";
import Swal from 'sweetalert2'
import UpdateUser from '../../components/updateUser/UpdateUser';
import { useCookies } from "react-cookie";
import useNetwork from '../../hooks/useNetwork';

import loadingImage from "../../assets/images/loading-gif.gif";

const Dashboard = ({ userId }) => {
    let url = "http://localhost:1198/api/v1";

    // console.log(userId, "dashboard");
    const handleError = (err) => {
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

    const [latestTime, setLatestTime] = useState(new Date());
    const updateLatestTime = (receiveTime) => {
        setLatestTime(latestTime => receiveTime);
    };

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

    const [cookies, removeCookie] = useCookies([]);
    const [contacts, setContacts] = useState({});
    const [fixedContacts, setFixedContacts] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const getAllContacts = async () => {
            if (!online) {
                handleError("NOT CONNECTED TO INTERNET. Enable WI-FI / Mobile Data.");
                return;
            }

            if (cookies.token && cookies.token !== "undefined") {
                console.log(cookies.token, "cookies.token");
                const data = { userId };
                console.log(data, "data dash");

                setIsLoading(true);
                try {
                    const response = await axios.post(`${url}/contact/all-contacts`, data, { withCredentials: true });
                    const { success, message } = response.data;
                    console.log(message, "message 429");
                    if (success) {
                        // handleSuccess("fetched all contacts");
                        setContacts(message);
                        setFixedContacts(message);
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
                setIsLoading(false);
            }
        };
        getAllContacts();
    }, [userId]);

    // delete item
    const deleteItem = async (username, id) => {
        if (!online) {
            handleError("NOT CONNECTED TO INTERNET. Enable WI-FI / Mobile Data.");
            return;
        }

        Swal.fire({
            title: 'Do you want to delete: ' + username,
            showDenyButton: false, showCancelButton: true,
            confirmButtonText: `Delete`,
            denyButtonText: `Cancel`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.post(`${url}/contact/delete-contact`, { contactId: id }, { withCredentials: true });
                    const { success, message } = response.data;
                    // console.log(message, "message");
                    if (success) {
                        handleSuccess("Deleted successfully");
                        const newContacts = contacts.filter(person => person._id !== id);
                        setContacts(newContacts);
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
            } else if (result.isDenied) {
                handleSuccess('Not deleted')
            }
        });
    };

    // search
    const [searchInput, setSearchInput] = useState(window.localStorage.getItem("search") || "");
    const handleSearch = (event) => {
        const value = event.target.value;
        window.localStorage.setItem("search", value);
        setSearchInput(value);
        searchFunction(value);
    };
    const searchFunction = (value) => {
        console.log(value, "first time");
        setContacts(fixedContacts);
        const newContacts = Object.values(fixedContacts).filter(contact => contact.username.includes(value)
            || contact.email.includes(value)
            || contact.mobile.includes(value));
        setContacts(newContacts);
    };
    useEffect(() => {
        searchFunction(window.localStorage.getItem("search"));
        document.querySelector("#search").value = window.localStorage.getItem("search");
        setSearchInput(window.localStorage.getItem("search"));
    }, []);

    // edit
    const [isEditing, setIsEditing] = useState(false);
    const [editValues, setEditingValues] = useState();
    const editItem = (item) => {
        console.log(item);
        setIsEditing(true);
        setEditingValues(item);
    };

    const displayDetails = (item) => {
        const makeData = `
            <b>UserName:</b> ${item.username}<br /><br />
            <b>Email:</b> ${item.email}<br /><br />
            <b>Mobile:</b> ${item.mobile}
        `;
        handleSuccess(makeData);
    };

    // sort by name
    const [sortName, setSortName] = useState(true);
    const sortByName = () => {
        setSortName(sortName => !sortName);
    };
    useEffect(() => {
        if (sortName) {
            setContacts(Array.from(contacts).sort((a, b) => (a.username > b.username) ? 1 : -1));
        } else {
            setContacts(Array.from(contacts).sort((a, b) => (a.username < b.username) ? 1 : -1));
        }
    }, [sortName]);

    // last modified
    const [lastModified, setLastModified] = useState(true);
    const sortByLastModified = () => {
        setLastModified(lastModified => !lastModified);
        console.log(lastModified);
    };
    useEffect(() => {
        if (lastModified) {
            setContacts(Array.from(contacts).sort((a, b) => (new Date(a.updatedAt) > new Date(b.updatedAt)) ? 1 : -1));
        } else {
            setContacts(Array.from(contacts).sort((a, b) => (new Date(a.updatedAt) < new Date(b.updatedAt)) ? 1 : -1));
        }
    }, [lastModified]);

    // last inserted
    const [lastInserted, setLastInserted] = useState(true);
    const sortByLastInserted = () => {
        setLastInserted(lastInserted => !lastInserted);
    };
    useEffect(() => {
        if (lastInserted) {
            setContacts(Array.from(contacts).sort((a, b) => (a.createdAt > b.createdAt) ? 1 : -1));
        } else {
            setContacts(Array.from(contacts).sort((a, b) => (a.createdAt < b.createdAt) ? 1 : -1));
        }
    }, [lastInserted]);

    return (
        <div className={styles.container}>
            <input type="text" name="search" id="search" placeholder="Search" className={styles.search} onChange={handleSearch} value={searchInput} />

            <div className={styles.filterData}>
                <h1>Filter Data</h1>
                <button onClick={sortByName}>A-Z / Z-A</button>
                <button onClick={sortByLastModified}>Last modified</button>
                <button onClick={sortByLastInserted}>Last Inserted</button>
            </div>

            {contacts.length > 0 ? <>
                <table>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map((item, index) => (
                            <tr key={index}>
                                <td onClick={() => displayDetails(item)}>{item.username}</td>
                                <td onClick={() => displayDetails(item)}>{item.email}</td>
                                <td onClick={() => displayDetails(item)}>{item.mobile}</td>
                                <td>
                                    <button className={styles.edit} onClick={() => editItem(item)}>EDIT</button>
                                    <button className={styles.delete} onClick={() => deleteItem(item.username, item._id)}>DELETE</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </> : <div style={{ position: 'relative' }}>
                <img src='https://placehold.co/600x400?text=No+Data+Found' alt='No Data Found' />
                {isLoading ? <img src={loadingImage} alt="loading image" style={{ position: "absolute", margin: "auto", left: 0, right: 0, top: 0 }} /> : ""}
            </div>}

            {/* edit */}
            {isEditing ? <div className={styles.editingForm}>
                <UpdateUser item={editValues} closeClick={() => setIsEditing(false)} />
            </div> : ""}
        </div>
    )
}

export default Dashboard

const wait = (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
}
