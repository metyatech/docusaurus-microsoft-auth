import React from 'react';
import type { AccountInfo } from '@azure/msal-browser';

export type AuthAccountContextValue = {
  account: AccountInfo;
  signOut: () => void;
};

const AuthAccountContext = React.createContext<AuthAccountContextValue | undefined>(undefined);

export const AuthAccountProvider: React.FC<{
  value: AuthAccountContextValue;
  children: React.ReactNode;
}> = ({ value, children }) => (
  <AuthAccountContext.Provider value={value}>{children}</AuthAccountContext.Provider>
);

export const useAuthAccountContext = (): AuthAccountContextValue | undefined =>
  React.useContext(AuthAccountContext);
