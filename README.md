# @metyatech/docusaurus-microsoft-auth

A Microsoft Entra ID (Azure AD) authentication integration for Docusaurus v3 sites, built on MSAL.

## Setup

```bash
git clone https://github.com/<your-account>/docusaurus-microsoft-auth.git
cd docusaurus-microsoft-auth
npm install
npm run build
```

Build outputs (JS + types) are generated under `dist/`.

## Features

- Uses official `@azure/msal-browser` / `@azure/msal-react`
- Provides an `AuthGuard` component to protect routes
- Provides a navbar item UI for account/sign-in
- Written in TypeScript and ships type definitions

## Installation

For local development, add it to your site's `package.json` using a file path.

```jsonc
{
  "dependencies": {
    "@metyatech/docusaurus-microsoft-auth": "file:../docusaurus-microsoft-auth"
  }
}
```

From npm registry (after publishing):

```bash
npm install @metyatech/docusaurus-microsoft-auth
```

## Docusaurus Integration

Register the plugin and set required `customFields` in `docusaurus.config.ts`.

```ts
// docusaurus.config.ts
import type {Config} from '@docusaurus/types';

const config: Config = {
  // ...snip...
  customFields: {
    auth: {
      tenantId: process.env.DOCUSAURUS_MICROSOFT_TENANT_ID ?? 'common',
      clientId:
        process.env.DOCUSAURUS_MICROSOFT_CLIENT_ID ??
        '00000000-0000-0000-0000-000000000000',
      redirectPath: '/auth/callback',
      protectedRoutes: ['/docs/protected'],
    },
  },
  plugins: ['@metyatech/docusaurus-microsoft-auth'],
};

export default config;
```

To add an account menu to the navbar, define a `custom-auth-account` navbar item.

```ts
// docusaurus.config.ts
const config: Config = {
  themeConfig: {
    navbar: {
      items: [{type: 'custom-auth-account', position: 'right'}],
    },
  },
};
```

## Client API

Main exports include:

- `AuthGuard`: component to protect authenticated content
- `useAccount`: hook to get the current account
- `msalClient`: shared MSAL browser client instance
- `resolveAuthConfig`: helper to build config from Docusaurus `customFields`

```tsx
import {AuthGuard, useAccount} from '@metyatech/docusaurus-microsoft-auth';

export default function ProtectedDocs() {
  const account = useAccount();
  return (
    <AuthGuard fallback={<div>Please sign in.</div>}>
      <div>Welcome, {account?.name}</div>
    </AuthGuard>
  );
}
```

## Environment Variables/Settings

| Name                                    | Default                                | Description                                  |
| --------------------------------------- | -------------------------------------- | -------------------------------------------- |
| `DOCUSAURUS_MICROSOFT_TENANT_ID`        | `common`                               | Entra tenant ID (`common` for multi-tenant). |
| `DOCUSAURUS_MICROSOFT_CLIENT_ID`        | `00000000-0000-0000-0000-000000000000` | Azure AD application (client) ID.            |
| `DOCUSAURUS_MICROSOFT_REDIRECT_PATH`    | `/auth/callback`                       | Redirect path.                               |
| `DOCUSAURUS_MICROSOFT_PROTECTED_ROUTES` | empty                                  | Comma-separated protected routes.            |

## Development Commands

- `npm run build`: build

## AGENTS.md

This project uses `agent-rules` and `agent-rules-tools` as git submodules.
After cloning, initialize submodules:

```bash
git submodule update --init --recursive
```

Update `agent-ruleset.json` as needed and regenerate:

```bash
node agent-rules-tools/tools/compose-agents.cjs
```

## Release/Deploy

```bash
npm publish
```

## License

MIT
