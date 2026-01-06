# @metyatech/docusaurus-microsoft-auth

Docusaurus v3 向けの Microsoft アカウント認証プラグインです。Microsoft Entra ID (旧 Azure AD) を利用して、MSAL (Microsoft Authentication Library) をベースにサイト全体へサインイン UI とガード機能を提供します。

```bash
git clone https://github.com/<your-account>/docusaurus-microsoft-auth.git
cd docusaurus-microsoft-auth
npm install
npm run build
```

ビルドすると `dist/` に ESM 出力と型定義が生成されます。npm で配布する際は `npm publish` を実行してください。

## 特長

- Microsoft 公式の `@azure/msal-browser` / `@azure/msal-react` を採用
- サインイン状態に応じてコンテンツを切り替えられる `AuthGuard` を提供
- Navbar に埋め込み可能なアカウント表示/サインイン UI を内包
- TypeScript で実装され、型定義付きで配布

## インストール

ローカルワークスペースで利用する場合は、`package.json` に依存関係を追加してください。

```jsonc
{
	"dependencies": {
		"@metyatech/docusaurus-microsoft-auth": "workspace:*"
	}
}
```

リポジトリ外から npm registry 経由でインストールする場合は、公開後に利用できるようになります。

```bash
npm install @metyatech/docusaurus-microsoft-auth
```

## Docusaurus への組み込み

`docusaurus.config.ts` にプラグインを登録し、必要な customFields を設定します。

```ts
// docusaurus.config.ts
import type {Config} from '@docusaurus/types';

const config: Config = {
	// ...省略...
	customFields: {
		auth: {
			tenantId: process.env.DOCUSUARUS_MICROSOFT_TENANT_ID ?? 'common',
			clientId: process.env.DOCUSAURUS_MICROSOFT_CLIENT_ID ?? '00000000-0000-0000-0000-000000000000',
			redirectPath: '/auth/callback',
			protectedRoutes: ['/docs/protected'],
		},
	},
	plugins: [
		'@metyatech/docusaurus-microsoft-auth',
	],
};

export default config;
```

Navbar にアカウントメニューを追加するには、`custom-auth-account` タイプの navbar item を定義します。

```ts
// docusaurus.config.ts
const config: Config = {
	themeConfig: {
		navbar: {
			items: [
				{type: 'custom-auth-account', position: 'right'},
			],
		},
	},
};
```

## クライアント API

主要なエクスポートは以下の通りです。

- `AuthGuard`: サインイン必須ページを保護するコンポーネント。
- `useAccount`: 現在のアカウント情報を取得するフック。
- `msalClient`: 共有の MSAL ブラウザクライアントインスタンス。
- `resolveAuthConfig`: Docusaurus customFields からプラグイン用設定を生成するヘルパー。

```tsx
import {AuthGuard, useAccount} from '@metyatech/docusaurus-microsoft-auth';

export default function ProtectedDocs() {
	const account = useAccount();
	return (
		<AuthGuard fallback={<div>サインインしてください</div>}>
			<div>ようこそ {account?.name} さん</div>
		</AuthGuard>
	);
}
```

## 環境変数

以下の値をビルド時に渡すことで、Microsoft Entra ID のテナントとアプリケーションを変更できます。

| 変数名 | デフォルト | 説明 |
| --- | --- | --- |
| `DOCUSAURUS_MICROSOFT_TENANT_ID` | `common` | テナント ID。マルチテナントであれば `common` を利用。 |
| `DOCUSAURUS_MICROSOFT_CLIENT_ID` | `00000000-0000-0000-0000-000000000000` | Azure AD アプリケーション (クライアント) ID。 |
| `DOCUSAURUS_MICROSOFT_REDIRECT_PATH` | `/auth/callback` | 認証リダイレクト先のパス。 |
| `DOCUSAURUS_MICROSOFT_PROTECTED_ROUTES` | 空配列 | `,` 区切りで保護ルートを指定。 |

## ビルド

リポジトリ内で開発する場合は、以下のコマンドでトランスパイルします。

```bash
npm run build
```

## ライセンス

MIT

