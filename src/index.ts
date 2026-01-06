import path from 'path';
import type { Plugin } from '@docusaurus/types';

export type { AuthEnvironment, AuthConfig, EnabledAuthConfig, DisabledAuthConfig } from './client/authConfig';
export {
  resolveAuthConfig,
  buildMsalConfiguration,
  DEFAULT_SCOPES,
} from './client/authConfig';
export { getMsalInstance, createLoginRequest, createLogoutRequest } from './client/msalClient';
export {
  AuthAccountProvider,
  useAuthAccountContext,
  type AuthAccountContextValue,
} from './client/AuthAccountContext';

export default function microsoftAuthPlugin(): Plugin<void> {
  const dirname = __dirname;
  return {
    name: '@metyatech/docusaurus-microsoft-auth',
    getThemePath() {
      return path.resolve(dirname, 'theme');
    },
    getTypeScriptThemePath() {
      return path.resolve(dirname, '../src/theme');
    },
  };
}
