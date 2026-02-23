import React from 'react';

import styles from './LoginScreen.module.css';

export type LoginScreenProps = {
  onSignIn: () => void;
  isSigningIn: boolean;
  error?: string | null;
  tenantHint?: string;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ onSignIn, isSigningIn, error, tenantHint }) => (
  <div className={styles.container}>
    <div className={styles.card}>
      <div className={styles.logo}>
        <img src="/img/logo.svg" alt="JavaScript 演習" width={64} height={64} />
      </div>
      <h1 className={styles.title}>JavaScript 演習</h1>
      <p className={styles.subtitle}>
        Microsoft Teams アカウントでサインインして、このサイトの教材にアクセスしてください。
      </p>
      <button className={styles.button} onClick={onSignIn} disabled={isSigningIn} type="button">
        <span className={styles.buttonIcon} aria-hidden>
          🔐
        </span>
        {isSigningIn ? 'サインインを準備しています…' : 'Microsoft でサインイン'}
      </button>
      {tenantHint ? (
        <p className={styles.helper}>
          組織: <strong>{tenantHint}</strong>
        </p>
      ) : null}
      {error ? <div className={styles.error}>{error}</div> : null}
      <p className={styles.footer}>Microsoft Teams / Microsoft 365 アカウントをご用意ください。</p>
    </div>
  </div>
);

export default LoginScreen;
