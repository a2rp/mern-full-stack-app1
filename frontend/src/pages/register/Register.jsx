import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./styles.module.scss";
import Header from '../../components/header/Header';
import Swal from 'sweetalert2'
import { useCookies } from "react-cookie";
import useNetwork from "../../hooks/useNetwork";

const Register = () => {
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

    // name email phone inputs
    const [nameEmailPhoneIputs, setNameEmailPhoneInputs] = useState({
        name: "",
        email: "",
        phone: ""
    });
    const handleOnChange = (event) => {
        const { name, value } = event.target;
        setNameEmailPhoneInputs({
            ...nameEmailPhoneIputs,
            [name]: value,
        });
    };
    const validNameEmailPhoneInputs = () => {
        // console.log(nameEmailPhoneIputs);
        // name
        if (nameEmailPhoneIputs.name.trim().length === 0 || !nameEmailPhoneIputs.name.match("^[a-zA-Z]*$")) {
            handleError("Invalid Name [only alphabets allowed]");
            return false;
        }

        // email
        if (nameEmailPhoneIputs.email.trim().length === 0 || !nameEmailPhoneIputs.email.match(/^(?=[^@]*[A-Za-z])([a-zA-Z0-9])(([a-zA-Z0-9])*([\._-])?([a-zA-Z0-9]))*@(([a-zA-Z0-9\-])+(\.))+([a-zA-Z]{2,4})+$/i)) {
            handleError("Invalid Email [only alphanumeric allowed]");
            return false;
        }

        // only numbers
        if (nameEmailPhoneIputs.phone.trim().length === 0 || !nameEmailPhoneIputs.phone.match(/^[0-9]*$/)) {
            handleError("Invalid Phone Number [only numbers allowed]");
            return false;
        }

        return true;
    };
    // name email phone inputs

    // gender
    const [gender, setGender] = useState("male");
    function onGenderChange(event) {
        setGender(event.target.value);
        // console.log(event.target.value);
    }

    // hear about this
    const [hearAboutThis, setHearAboutThis] = useState({
        linkedin: false,
        friends: false,
        job_portal: false,
        others: false,
    });

    // city
    const [city, setCity] = useState("mumbai");
    const handleCityChange = (event) => {
        setCity(event.target.value);
    };

    // state
    const [state, setState] = useState("Maharashtra");
    const handleStateChange = (event) => {
    };
    useEffect(() => {
        if (city === "mumbai") {
            setState(state => "maharashtra");
        } else if (city === "pune") {
            setState(state => "maharashtra");
        } else if (city === "ahmedabad") {
            setState(state => "gujarat");
        }
    }, [city]);

    const [password, setPassword] = useState("");
    const handlePasswordChange = (event) => {
        setPassword(event.currentTarget.value);
    };

    const [confirmPassword, setConfirmPassword] = useState("");
    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.currentTarget.value);
    };

    const validatePassword = (value) => {
        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/)) {
            handleError('Password Error: Minimum eight and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character');
            return false;
        }

        if (password !== confirmPassword) {
            handleError('Passwords do not match');
            return false;
        }

        return true;
    };

    // submit form
    const navigate = useNavigate(null);
    const [isLoading, setIsLoading] = useState("");
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!online) {
            handleError("NOT CONNECTED TO INTERNET. Enable WI-FI / Mobile Data.");
            return;
        }

        const inputs = {
            ...nameEmailPhoneIputs,
            gender,
            hear_about_this: hearAboutThis,
            city,
            state,
            password,
            confirm_password: confirmPassword
        };
        console.log(inputs, "form inputs");
        // return;

        if (!validNameEmailPhoneInputs()) return;
        if (!validatePassword()) return;

        try {
            setIsLoading(true);
            const response = await axios.post(`${url}/user/register`, inputs, { withCredentials: true });
            const { success, message } = response.data;
            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate("/login");
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
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.contentContainer}>
                <h2 className={styles.heading}>Register</h2>
                <form onSubmit={handleSubmit}>
                    {/* name */}
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={nameEmailPhoneIputs.name}
                        placeholder="Enter your name"
                        onChange={handleOnChange}
                    />

                    {/* email */}
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        name="email"
                        value={nameEmailPhoneIputs.email}
                        placeholder="Enter your email"
                        onChange={handleOnChange}
                    />

                    {/* phone number */}
                    <label htmlFor="phone">Phone Number</label>
                    <input
                        type="text"
                        name="phone"
                        value={nameEmailPhoneIputs.phone}
                        placeholder="Enter your phone number"
                        onChange={handleOnChange}
                    />

                    {/* gender */}
                    <label htmlFor="phone">Gender</label>
                    <div className={styles.genderContainer}>
                        <div>
                            <input
                                type="radio"
                                value="male"
                                name="gender"
                                checked={gender === "male"}
                                onChange={onGenderChange} /> Male
                        </div>
                        <div>
                            <input
                                type="radio"
                                value="female"
                                name="gender"
                                checked={gender === "female"}
                                onChange={onGenderChange} /> Female
                        </div>
                        <div>
                            <input
                                type="radio"
                                value="others"
                                name="gender"
                                checked={gender === "others"}
                                onChange={onGenderChange} /> Others
                        </div>
                    </div>

                    <label htmlFor="hear_about_this">How did you hear about this ???</label>
                    <div className={styles.hearAboutThisContainer}>
                        <div>
                            <input type="checkbox" name="linkedin" value="linkedin" defaultChecked={hearAboutThis.linkedin} onChange={() => setHearAboutThis({
                                ...hearAboutThis, linkedin: !hearAboutThis.linkedin
                            })} /> LinkedIn
                        </div>
                        <div>
                            <input type="checkbox" name="friends" value="friends" defaultChecked={hearAboutThis.friends} onChange={() => setHearAboutThis({
                                ...hearAboutThis, friends: !hearAboutThis.friends
                            })} /> Friends
                        </div>
                        <div>
                            <input type="checkbox" name="job_portal" value="job_portal" defaultChecked={hearAboutThis.job_portal} onChange={() => setHearAboutThis({
                                ...hearAboutThis, job_portal: !hearAboutThis.job_portal
                            })} /> Job Portal
                        </div>
                        <div>
                            <input type="checkbox" name="others" value="others" defaultChecked={hearAboutThis.others} onChange={() => setHearAboutThis({
                                ...hearAboutThis, others: !hearAboutThis.others
                            })} /> Others
                        </div>
                    </div>

                    <label htmlFor="city">City</label>
                    <select name="city" className={styles.city} onChange={handleCityChange}>
                        <option value="mumbai">Mumbai</option>
                        <option value="pune">Pune</option>
                        <option value="ahmedabad">Ahmedabad</option>
                    </select>

                    <label htmlFor="state">State</label>
                    <select name="state" className={styles.state} onChange={handleStateChange} value={state}>
                        <option>Auto Suggested State: select city above</option>
                        <option value="gujarat" disabled>Gujarat</option>
                        <option value="maharashtra" disabled>Maharashtra</option>
                        <option value="karnataka" disabled>Karnataka</option>
                    </select>

                    {/* password */}
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        placeholder="Enter your password"
                        onChange={handlePasswordChange}
                    />

                    {/* confirm password */}
                    <label htmlFor="confirm_password">Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        placeholder="Enter your password again"
                        onChange={handleConfirmPasswordChange}
                    />

                    <button type="submit" disabled={isLoading}>Save</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
