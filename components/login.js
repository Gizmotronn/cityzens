import { useMetamask } from "@thirdweb-dev/react";
import styles from "../styles/Login.module.css"

const Login = () => {
    const connectWithMetamask = useMetamask();
    return(
        <div className={styles.container}>
            <button className={styles.button} onClick={() => connectWithMetamask("injected")}>Sign in using Metamask</button>
        </div>
    );
};

export default Login;