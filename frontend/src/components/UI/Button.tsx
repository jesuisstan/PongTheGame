import styles from './Button.module.css';
import '../Login/Login.css'
export default function Button(props: any) {
  return (
    // <a href="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-ec9dfb5d27c80f0d9f7ea2166bdb00de00a4bfe3c6d4359bfc022fd9b161bace&redirect_uri=http%3A%2F%2Flocalhost%3A5173&response_type=code">
      <button
        className="{styles.button} props.style"
      >
        42 Connect
      </button>
    // </a>
  );
}
