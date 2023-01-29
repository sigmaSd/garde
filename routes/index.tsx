import { Head } from "$fresh/runtime.ts";
import App from "../islands/App.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>Work</title>
      </Head>
      <div style="text-align: center;">
        <App />
      </div>
    </>
  );
}
