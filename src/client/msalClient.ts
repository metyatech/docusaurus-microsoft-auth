import {
  PublicClientApplication,
  type EndSessionRequest,
  type IPublicClientApplication,
  type RedirectRequest,
} from '@azure/msal-browser';

import type { EnabledAuthConfig } from './authConfig';
import { buildMsalConfiguration } from './authConfig';

let msalInstance: IPublicClientApplication | null = null;

const canUseDOM = typeof window !== 'undefined' && typeof window.document !== 'undefined';

export const getMsalInstance = (config: EnabledAuthConfig): IPublicClientApplication => {
  if (!canUseDOM) {
    throw new Error('MSAL クライアントはブラウザ環境でのみ初期化できます。');
  }

  if (!msalInstance) {
    const effectiveConfig: EnabledAuthConfig = {
      ...config,
      redirectUri: config.redirectUri ?? window.location.origin,
      postLogoutRedirectUri: config.postLogoutRedirectUri ?? window.location.origin,
    };

    msalInstance = new PublicClientApplication(buildMsalConfiguration(effectiveConfig));
  }

  return msalInstance;
};

export const createLoginRequest = (config: EnabledAuthConfig): RedirectRequest => ({
  scopes: config.scopes,
  prompt: 'select_account',
});

export const createLogoutRequest = (config: EnabledAuthConfig): EndSessionRequest => ({
  postLogoutRedirectUri:
    config.postLogoutRedirectUri ?? config.redirectUri ?? window.location.origin,
});
