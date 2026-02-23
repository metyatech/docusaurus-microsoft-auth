import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type { Props } from '@theme/Root';
import type { IPublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';

import type {
  AuthConfig,
  AuthEnvironment,
  DisabledAuthConfig,
  EnabledAuthConfig,
} from '../../client/authConfig';
import { resolveAuthConfig } from '../../client/authConfig';
import { getMsalInstance } from '../../client/msalClient';
import AuthGuard from '../../client/components/AuthGuard';
import LoadingScreen from '../../client/components/LoadingScreen';

const ConfigurationErrorScreen: React.FC<{ config: AuthConfig; message?: string | null }> = ({
  config,
  message,
}) => {
  const displayMessage = (() => {
    if (config.enabled) {
      return message ?? '認証の初期化に失敗しました。';
    }
    return (config as DisabledAuthConfig).error;
  })();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'var(--ifm-background-color)',
        color: 'var(--ifm-font-color-base)',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          maxWidth: '560px',
          width: '100%',
          background:
            'color-mix(in srgb, var(--ifm-card-background-color, #ffffff) 88%, rgba(255, 255, 255, 0.7))',
          borderRadius: '1.25rem',
          padding: '2.5rem 2rem',
          boxShadow: '0 18px 40px rgba(15, 23, 42, 0.16)',
        }}
      >
        <h1 style={{ fontSize: '1.65rem', marginBottom: '1.25rem', fontWeight: 700 }}>
          認証設定が必要です
        </h1>
        <p style={{ lineHeight: 1.7, marginBottom: '1.5rem' }}>{displayMessage}</p>
        <p style={{ lineHeight: 1.7, marginBottom: '1.5rem' }}>
          Azure ポータルでアプリ登録を作成し、以下の環境変数を設定してください。
        </p>
        <pre
          style={{
            textAlign: 'left',
            background: 'rgba(15, 23, 42, 0.08)',
            padding: '1rem 1.25rem',
            borderRadius: '0.85rem',
            fontSize: '0.9rem',
            lineHeight: 1.5,
            overflowX: 'auto',
          }}
        >{`DOCUSAURUS_MICROSOFT_CLIENT_ID=<アプリケーション (クライアント) ID>
DOCUSAURUS_MICROSOFT_TENANT_ID=<ディレクトリ (テナント) ID>
DOCUSAURUS_MICROSOFT_REDIRECT_URI=<https://example.com/javascript-course-docs/>`}</pre>
        <p style={{ marginTop: '1.5rem', lineHeight: 1.6 }}>
          ローカル開発時は <code>.env</code>{' '}
          ファイルを作成し、ビルド／デプロイ環境でも同じ変数を設定してください。
        </p>
      </div>
    </div>
  );
};

const getRuntimeEnv = (): AuthEnvironment => {
  if (typeof window === 'undefined') {
    return {};
  }

  const runtime = (window as typeof window & { __DOCUSAURUS_RUNTIME_ENV__?: AuthEnvironment })
    .__DOCUSAURUS_RUNTIME_ENV__;
  return runtime ?? {};
};

const ClientAuthRoot: React.FC<Props> = ({ children }) => {
  const { siteConfig } = useDocusaurusContext();

  const configEnv = React.useMemo<AuthEnvironment>(() => {
    const authFields = siteConfig.customFields?.auth;
    if (authFields && typeof authFields === 'object') {
      return authFields as AuthEnvironment;
    }
    return {};
  }, [siteConfig]);

  const mergedEnv = React.useMemo<AuthEnvironment>(
    () => ({
      ...configEnv,
      ...getRuntimeEnv(),
    }),
    [configEnv],
  );

  const authConfig = React.useMemo<AuthConfig>(() => resolveAuthConfig(mergedEnv), [mergedEnv]);
  const [msalClient, setMsalClient] = React.useState<IPublicClientApplication | null>(null);
  const [initializationError, setInitializationError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!authConfig.enabled) {
      setInitializationError((authConfig as DisabledAuthConfig).error);
      return;
    }

    try {
      const instance = getMsalInstance(authConfig as EnabledAuthConfig);
      const bootstrap = async () => {
        try {
          await instance.initialize();
          const result = await instance.handleRedirectPromise();
          if (result?.account) {
            instance.setActiveAccount(result.account);
          }
          if (!instance.getActiveAccount()) {
            const existingAccounts = instance.getAllAccounts();
            if (existingAccounts.length > 0) {
              instance.setActiveAccount(existingAccounts[0]);
            }
          }
          setMsalClient(instance);
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : String(error);
          setInitializationError(message);
        }
      };

      void bootstrap();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      setInitializationError(message);
    }
  }, [authConfig]);

  if (initializationError) {
    return <ConfigurationErrorScreen config={authConfig} message={initializationError} />;
  }

  if (!authConfig.enabled) {
    return <ConfigurationErrorScreen config={authConfig} />;
  }

  if (!msalClient) {
    return <LoadingScreen message="サインインを準備しています…" />;
  }

  return (
    <MsalProvider instance={msalClient}>
      <AuthGuard config={authConfig as EnabledAuthConfig}>{children}</AuthGuard>
    </MsalProvider>
  );
};

const Root: React.FC<Props> = (props) => (
  <BrowserOnly fallback={<LoadingScreen message="サインインを準備しています…" />}>
    {() => <ClientAuthRoot {...props} />}
  </BrowserOnly>
);

export default Root;
