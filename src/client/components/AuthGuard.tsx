import React from 'react';
import type { AccountInfo, EventMessage } from '@azure/msal-browser';
import { EventType, InteractionStatus } from '@azure/msal-browser';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';

import type { EnabledAuthConfig } from '../authConfig';
import { createLoginRequest, createLogoutRequest } from '../msalClient';
import LoadingScreen from './LoadingScreen';
import LoginScreen from './LoginScreen';
import { AuthAccountProvider } from '../AuthAccountContext';

export type AuthGuardProps = {
  children: React.ReactNode;
  config: EnabledAuthConfig;
};

const extractTenantLabel = (authority: string): string | undefined => {
  try {
    const url = new URL(authority);
    const segments = url.pathname
      .split('/')
      .map((segment) => segment.trim())
      .filter(Boolean);
    return segments[segments.length - 1];
  } catch {
    const fallback = authority
      .split('/')
      .map((segment) => segment.trim())
      .filter(Boolean);
    return fallback[fallback.length - 1];
  }
};

const AuthGuard: React.FC<AuthGuardProps> = ({ children, config }) => {
  const { instance, accounts, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [interactionError, setInteractionError] = React.useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = React.useState(false);

  const loginRequest = React.useMemo(() => createLoginRequest(config), [config]);
  const logoutRequest = React.useMemo(() => createLogoutRequest(config), [config]);

  React.useEffect(() => {
    if (accounts.length > 0) {
      const activeAccount = instance.getActiveAccount();
      if (!activeAccount) {
        instance.setActiveAccount(accounts[0]);
      }
    }
  }, [accounts, instance]);

  React.useEffect(() => {
    const callbackId = instance.addEventCallback((event: EventMessage) => {
      if (
        event.eventType === EventType.LOGIN_SUCCESS ||
        event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS
      ) {
        const account = (event.payload as { account?: AccountInfo } | undefined)?.account;
        if (account) {
          instance.setActiveAccount(account);
        }
        setInteractionError(null);
        setIsSigningIn(false);
      }

      if (
        event.eventType === EventType.LOGIN_FAILURE ||
        event.eventType === EventType.ACQUIRE_TOKEN_FAILURE
      ) {
        const error = event.error;
        const message =
          error &&
          typeof error === 'object' &&
          'message' in error &&
          typeof (error as { message?: unknown }).message === 'string'
            ? (error as { message: string }).message
            : error
              ? String(error)
              : 'サインインに失敗しました。';
        setInteractionError(message);
        setIsSigningIn(false);
      }

      if (event.eventType === EventType.LOGOUT_SUCCESS) {
        setInteractionError(null);
      }
    });

    return () => {
      if (callbackId) {
        instance.removeEventCallback(callbackId);
      }
    };
  }, [instance]);

  React.useEffect(() => {
    if (inProgress === InteractionStatus.None) {
      setIsSigningIn(false);
    }
  }, [inProgress]);

  const handleSignIn = React.useCallback(() => {
    setInteractionError(null);
    setIsSigningIn(true);
    instance.loginRedirect(loginRequest).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      setInteractionError(message);
      setIsSigningIn(false);
    });
  }, [instance, loginRequest]);

  const handleSignOut = React.useCallback(() => {
    setInteractionError(null);
    instance.logoutRedirect(logoutRequest).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      setInteractionError(message);
    });
  }, [instance, logoutRequest]);

  const activeAccount = React.useMemo(() => {
    const account = instance.getActiveAccount();
    if (account) {
      return account;
    }
    return accounts[0];
  }, [accounts, instance]);

  const providerValue = React.useMemo(
    () => (activeAccount ? { account: activeAccount, signOut: handleSignOut } : null),
    [activeAccount, handleSignOut],
  );

  const tenantLabel = React.useMemo(() => extractTenantLabel(config.authority), [config.authority]);

  const isLoading =
    inProgress === InteractionStatus.Startup || inProgress === InteractionStatus.HandleRedirect;
  if (isLoading) {
    return <LoadingScreen message="サインインを確認しています…" />;
  }

  if (!isAuthenticated || !activeAccount || !providerValue) {
    return (
      <LoginScreen
        onSignIn={handleSignIn}
        isSigningIn={isSigningIn}
        error={interactionError}
        tenantHint={tenantLabel ? `テナント ID: ${tenantLabel}` : undefined}
      />
    );
  }

  return <AuthAccountProvider value={providerValue}>{children}</AuthAccountProvider>;
};

export default AuthGuard;
