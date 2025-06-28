export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              プライバシーポリシー
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="prose prose-gray max-w-none">
            <h2>1. 基本方針</h2>
            <p>
              バドミントン大会検索サービス（以下「当サービス」）では、ユーザーの個人情報保護を重要視し、
              個人情報保護法その他関連法令を遵守して適切に取り扱います。
            </p>

            <h2>2. 収集する情報</h2>
            <h3>2.1 自動的に収集される情報</h3>
            <ul>
              <li>IPアドレス</li>
              <li>ブラウザの種類とバージョン</li>
              <li>アクセス日時</li>
              <li>参照元URL</li>
            </ul>

            <h3>2.2 ユーザーが提供する情報</h3>
            <ul>
              <li>大会登録時の各種情報（大会名、開催地、連絡先等）</li>
              <li>お問い合わせ内容</li>
            </ul>

            <h2>3. 情報の利用目的</h2>
            <ul>
              <li>サービスの提供・維持・改善</li>
              <li>不正利用の防止</li>
              <li>統計データの作成（個人を特定できない形式）</li>
              <li>お問い合わせへの対応</li>
            </ul>

            <h2>4. 情報の共有・提供</h2>
            <p>
              当サービスは、以下の場合を除き、収集した個人情報を第三者に提供しません：
            </p>
            <ul>
              <li>ユーザーの同意がある場合</li>
              <li>法令に基づく場合</li>
              <li>人の生命、身体または財産の保護のために必要な場合</li>
            </ul>

            <h2>5. セキュリティ</h2>
            <p>
              当サービスは、個人情報の漏洩、改ざん、不正アクセス等を防ぐため、
              適切な技術的・組織的安全管理措置を講じています。
            </p>

            <h2>6. データの保存期間</h2>
            <ul>
              <li>大会情報：大会終了後3年間</li>
              <li>アクセスログ：6ヶ月間</li>
              <li>お問い合わせ：対応完了後1年間</li>
            </ul>

            <h2>7. ユーザーの権利</h2>
            <p>ユーザーは以下の権利を有します：</p>
            <ul>
              <li>個人情報の開示請求</li>
              <li>個人情報の訂正・削除請求</li>
              <li>個人情報の利用停止請求</li>
            </ul>

            <h2>8. Cookie等の使用</h2>
            <p>
              当サービスでは、サービス向上のためにCookieを使用する場合があります。
              ブラウザの設定により無効にすることが可能です。
            </p>

            <h2>9. 外部サービス</h2>
            <p>
              当サービスは以下の外部サービスを利用しています：
            </p>
            <ul>
              <li>Vercel（ホスティング）</li>
              <li>その他必要に応じて利用するクラウドサービス</li>
            </ul>

            <h2>10. プライバシーポリシーの変更</h2>
            <p>
              当プライバシーポリシーは、法令の変更やサービス内容の変更に伴い、
              予告なく変更される場合があります。
            </p>

            <h2>11. お問い合わせ</h2>
            <p>
              個人情報の取扱いに関するお問い合わせは、当サービス内のお問い合わせフォームよりご連絡ください。
            </p>

            <div className="mt-8 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                制定日：2024年12月28日<br />
                最終更新：2024年12月28日
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}