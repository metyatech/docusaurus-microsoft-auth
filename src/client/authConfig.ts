import type { Configuration } from '@azure/msal-browser';

export type AuthEnvironment = {
  DOCUSAURUS_MICROSOFT_CLIENT_ID?: string;
  DOCUSAURUS_MICROSOFT_TENANT_ID?: string;
  DOCUSAURUS_MICROSOFT_AUTHORITY_HOST?: string;
  DOCUSAURUS_MICROSOFT_REDIRECT_URI?: string;
  DOCUSAURUS_MICROSOFT_POST_LOGOUT_REDIRECT_URI?: string;
  DOCUSAURUS_MICROSOFT_SCOPES?: string;
};

export type DisabledAuthConfig = {
  enabled: false;
  error: string;
  scopes: string[];
};

export type EnabledAuthConfig = {
  enabled: true;
  clientId: string;
  authority: string;
  redirectUri?: string;
  postLogoutRedirectUri?: string;
  scopes: string[];
};

export type AuthConfig = EnabledAuthConfig | DisabledAuthConfig;

export const DEFAULT_SCOPES = ['User.Read'];

const coerceEnv = (value: string | undefined): string | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const parseScopes = (value?: string): string[] => {
  if (!value) {
    return DEFAULT_SCOPES;
  }
  const scopes = value
    .split(',')
    .map((scope) => scope.trim())
    .filter(Boolean);

  return scopes.length > 0 ? scopes : DEFAULT_SCOPES;
};

const extract = (env: AuthEnvironment, key: keyof AuthEnvironment): string | undefined =>
  coerceEnv(env[key]);

export const resolveAuthConfig = (env: AuthEnvironment): AuthConfig => {
  const clientId = extract(env, 'DOCUSAURUS_MICROSOFT_CLIENT_ID');
  const tenantId = extract(env, 'DOCUSAURUS_MICROSOFT_TENANT_ID');
  const authorityHost =
    extract(env, 'DOCUSAURUS_MICROSOFT_AUTHORITY_HOST') ?? 'https://login.microsoftonline.com';
  const redirectUri = extract(env, 'DOCUSAURUS_MICROSOFT_REDIRECT_URI');
  const postLogoutRedirectUri =
    extract(env, 'DOCUSAURUS_MICROSOFT_POST_LOGOUT_REDIRECT_URI') ?? redirectUri;
  const scopes = parseScopes(extract(env, 'DOCUSAURUS_MICROSOFT_SCOPES'));

  if (!clientId) {
    return {
      enabled: false,
      error: 'DOCUSAURUS_MICROSOFT_CLIENT_ID 環境変数が設定されていません。',
      scopes,
    } satisfies DisabledAuthConfig;
  }

  if (!tenantId) {
    return {
      enabled: false,
      error: 'DOCUSAURUS_MICROSOFT_TENANT_ID 環境変数が設定されていません。',
      scopes,
    } satisfies DisabledAuthConfig;
  }

  const normalizedAuthorityHost = authorityHost.endsWith('/')
    ? authorityHost.slice(0, -1)
    : authorityHost;

  const authority = `${normalizedAuthorityHost}/${tenantId}`;

  return {
    enabled: true,
    clientId,
    authority,
    redirectUri,
    postLogoutRedirectUri,
    scopes,
  } satisfies EnabledAuthConfig;
};

export const buildMsalConfiguration = (config: EnabledAuthConfig): Configuration => ({
  auth: {
    clientId: config.clientId,
    authority: config.authority,
    redirectUri: config.redirectUri,
    postLogoutRedirectUri: config.postLogoutRedirectUri,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
});
