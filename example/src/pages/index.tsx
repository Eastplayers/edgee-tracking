import { message } from "antd";
import { useRouter } from "next/router";
import { FC, useEffect } from "react";
import EdgeeTracking from "../../../lib";
import styles from "../styles/Home.module.css";

const Home: FC = () => {
  const router = useRouter();

  useEffect(() => {
    EdgeeTracking.renderRecommendedProducts();
  }, []);

  return (
    <div>
      <button className={styles.button} onClick={() => router.push("/about")}>
        Click to navigate to About
      </button>
      <button
        className={styles.button}
        onClick={() => {
          EdgeeTracking.logEvent("ABANDONED_CART_CREATE");
          message.success("Event has been sent");
        }}
      >
        Click to send ABANDONED_CART_CREATE event
      </button>

      <button
        className={styles.button}
        onClick={() => {
          EdgeeTracking.logEvent("SHOW_DEMO_POPUP");
          message.success("Event has been sent");
        }}
      >
        Click to send SHOW_DEMO_POPUP event
      </button>

      <div id="product"></div>
    </div>
  );
};

export default Home;
