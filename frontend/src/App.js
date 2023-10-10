import { Route, Routes, Navigate } from "react-router-dom";
import styles from "./styles.module.scss";

import { Suspense, lazy } from "react";
import loadingGIF from "./assets/images/loading-gif.gif";

const Home = lazy(() => wait(0).then(() => import("./pages/home")));
const Login = lazy(() => wait(500).then(() => import("./pages/login")));
const Register = lazy(() => wait(500).then(() => import("./pages/register")));

function App() {
    return (
        <div className={styles.container}>
            <Suspense fallback={<img alt="loading" src={loadingGIF} className={styles.fallback} />}>
                <Routes>
                    <Route path="/" element={<Navigate to="/home" />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </Suspense>
        </div>
    );
}

export default App;

const wait = (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
}
