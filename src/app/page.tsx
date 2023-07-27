import Image from "next/image";
import { redirect } from "next/navigation";
import styles from "./page.module.css";

export default function Home() {
  redirect("/products");
  return <main className={styles.main}>Home</main>;
}
