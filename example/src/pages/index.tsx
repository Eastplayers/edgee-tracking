import { useRouter } from "next/router";
import { FC } from "react";
import EdgeeTracking from "../../../lib";
import styles from "../styles/Home.module.css";

const Home: FC = () => {
  const router = useRouter();

  return (
    <div>
      <button className={styles.button} onClick={() => router.push("/about")}>
        Click me
      </button>
      <button
        className={styles.button}
        onClick={() => {
          EdgeeTracking.logEvent("ABANDONED_CART_CREATE");
        }}
      >
        Click to send cart event
      </button>
    </div>
  );
};

export default Home;
