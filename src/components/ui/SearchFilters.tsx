'use client'

import { useState } from 'react'
import { ChevronDownIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface SearchFilters {
  prefecture: string
  city: string
  category: string
  startDate: string
  endDate: string
  keyword: string
}

interface SearchFiltersProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  onSearch: () => void
  loading: boolean
}

export default function SearchFilters({ filters, onFiltersChange, onSearch, loading }: SearchFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const prefectures = [
    '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
    '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
    '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
    '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
    '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
    '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
    '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
  ]

  const categories = ['一般', '学生', '高校生', '中学生', '小学生', 'シニア', '実業団']

  const hasActiveFilters = Object.values(filters).some(value => value !== '')

  const clearFilters = () => {
    onFiltersChange({
      prefecture: '',
      city: '',
      category: '',
      startDate: '',
      endDate: '',
      keyword: ''
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* モバイル用ヘッダー */}
      <div className="md:hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-700">検索フィルター</span>
            {hasActiveFilters && (
              <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                設定中
              </span>
            )}
          </div>
          <ChevronDownIcon 
            className={`w-5 h-5 text-gray-400 transform transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`} 
          />
        </button>
      </div>

      {/* フィルター内容 */}
      <div className={`${isExpanded ? 'block' : 'hidden'} md:block p-6`}>
        {/* キーワード検索（最上部に配置） */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            キーワード検索
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="大会名、会場名、説明文で検索..."
            value={filters.keyword}
            onChange={(e) => onFiltersChange({ ...filters, keyword: e.target.value })}
          />
        </div>

        {/* その他のフィルター */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              都道府県
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
              value={filters.prefecture}
              onChange={(e) => onFiltersChange({ ...filters, prefecture: e.target.value })}
            >
              <option value="">すべて</option>
              {prefectures.map(pref => (
                <option key={pref} value={pref}>{pref}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              市区町村
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="例: 横浜市"
              value={filters.city}
              onChange={(e) => onFiltersChange({ ...filters, city: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              カテゴリー
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
              value={filters.category}
              onChange={(e) => onFiltersChange({ ...filters, category: e.target.value })}
            >
              <option value="">すべて</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              開催日（開始）
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={filters.startDate}
              onChange={(e) => onFiltersChange({ ...filters, startDate: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              開催日（終了）
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={filters.endDate}
              onChange={(e) => onFiltersChange({ ...filters, endDate: e.target.value })}
            />
          </div>
        </div>

        {/* ボタン群 */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onSearch}
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                検索中...
              </>
            ) : (
              '検索'
            )}
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="sm:flex-none bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium flex items-center justify-center gap-2"
            >
              <XMarkIcon className="w-4 h-4" />
              クリア
            </button>
          )}
        </div>
      </div>
    </div>
  )
}