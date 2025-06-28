'use client'

import { useState } from 'react'
import TournamentForm from '@/components/ui/TournamentForm'
import { PlusIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

export default function AdminPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              🏸 管理者ページ
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              バドミントン大会情報の登録・管理
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        {!showForm ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <DocumentTextIcon className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">大会情報管理</h2>
              <p className="text-gray-600 mb-8">
                新しいバドミントン大会の情報を登録できます。<br />
                登録された情報は検索ページに表示されます。
              </p>
              
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <PlusIcon className="w-5 h-5" />
                大会を登録する
              </button>
              
              <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-medium text-yellow-800 mb-2">注意事項</h3>
                <ul className="text-sm text-yellow-700 text-left space-y-1">
                  <li>• 登録前に大会情報の正確性を確認してください</li>
                  <li>• 個人情報は必要最小限に留めてください</li>
                  <li>• 著作権に配慮した情報のみ登録してください</li>
                  <li>• 不適切な内容は削除される場合があります</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <button
                onClick={() => setShowForm(false)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                ← 戻る
              </button>
            </div>
            <TournamentForm onSuccess={() => setShowForm(false)} />
          </div>
        )}
      </main>
    </div>
  )
}