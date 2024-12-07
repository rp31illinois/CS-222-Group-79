import Head from "next/head";
import CalendarApp from "./CalendarApp";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Calendar</title>
      </Head>
      <main>
        <CalendarApp />
      </main>
    </div>
  );
}
