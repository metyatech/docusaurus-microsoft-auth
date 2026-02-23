import React from 'react';
import clsx from 'clsx';

import { useAuthAccountContext } from '../../../client/AuthAccountContext';
import styles from './styles.module.css';

const CustomAuthAccount: React.FC = () => {
  const context = useAuthAccountContext();

  if (!context) {
    return null;
  }

  const { account, signOut } = context;
  const displayName = account.name ?? account.username;

  return (
    <div className={clsx('navbar__item', styles.container)}>
      <span className={styles.name} title={displayName}>
        {displayName}
      </span>
      <button type="button" className={styles.button} onClick={signOut}>
        サインアウト
      </button>
    </div>
  );
};

export default CustomAuthAccount;
