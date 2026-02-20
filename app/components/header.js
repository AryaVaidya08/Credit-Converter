import styles from "./header.module.css";
import Image from "next/image";

export default function Header() {
  return (
    <div className={styles.headerbox}>
        <h1 className={styles.headertitle}>AP Credit Converter</h1> 
    </div>
  );
}
