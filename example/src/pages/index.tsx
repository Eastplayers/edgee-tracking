import { useRouter } from "next/router";
import { FC } from "react";

const Home: FC = () => {
  const router = useRouter();

  return <button onClick={() => router.push("/about")}>Click me</button>;
};

export default Home;
