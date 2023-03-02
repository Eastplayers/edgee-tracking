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

      <div style={{ width: "90%", maxWidth: 1200, margin: "40px auto" }}>
        <div id="RECOMMENDED_PRODUCT"></div>
      </div>
    </div>
  );
};

export default Home;
