import styles from './UI.module.css';

const Footer: React.FC = () => {
  return (
    <div className={styles.footerBasic}>
      <footer>
        <p className={styles.copyright}>
          PongTheGame © 2023 | École 42 ft_trancendence project |{' '}
          <a
            href="https://github.com/benjaminbrassart/transcendence"
            className={styles.footerLink}
          >
            @github
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Footer;
