import Link from "next/link";
import styles from "./Hero.module.css";

const Hero = () => {
  return (
    <section className={styles.hero} id="hero">
      <div className={styles.media}>hero görseli · 2400×1040</div>

      <div className={styles.inner}>
        <span className={styles.eyebrow}>Sezon Sonu · 2 Eylül&apos;e kadar</span>

        <h1 className={styles.title}>
          Yolda kalma.
          <br />
          Ekipmanını tamamla.
        </h1>

        <p className={styles.sub}>
          Kask, koruma, parça ve aksesuarda 70&apos;ten fazla markada %50&apos;ye
          varan indirim.
        </p>

        <div className={styles.actions}>
          <Link href="/kampanyalar" className={styles.primary}>
            İndirimleri Gör
          </Link>
          <Link href="/motoruna-gore" className={styles.ghost}>
            Motoruna göre ara
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
