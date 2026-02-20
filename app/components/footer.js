import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={styles.schools}>2,365 schools supported</span>
      <span className={styles.divider}>·</span>
      <span className={styles.credit}>Made by Arya Vaidya</span>
    </footer>
  );
}
