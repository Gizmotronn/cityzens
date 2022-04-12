import Login from "../components/login";

export default function Home() {
  const { address } = useWeb3();
  if (!address) {
    return <Login />;
  }
  return (
    <div className={styles.container}>
      <h2>You are signed in as {address}</h2>
    </div>

  )
}