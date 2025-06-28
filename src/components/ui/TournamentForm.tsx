'use client'

import { useState } from 'react'
import { tournamentSchema } from '@/lib/validation'
import { ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

interface TournamentFormProps {
  onSuccess?: () => void
}

export default function TournamentForm({ onSuccess }: TournamentFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    prefecture: '',
    city: '',
    venue: '',
    category: '',
    level: '',
    entryFee: '',
    maxEntries: '',
    deadline: '',
    contactInfo: '',
    sourceUrl: ''
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    setSuccess(false)

    try {
      const processedData = {
        ...formData,
        entryFee: formData.entryFee ? parseInt(formData.entryFee) : undefined,
        maxEntries: formData.maxEntries ? parseInt(formData.maxEntries) : undefined,
        endDate: formData.endDate || undefined,
        deadline: formData.deadline || undefined,
        sourceUrl: formData.sourceUrl || undefined
      }

      const validated = tournamentSchema.parse(processedData)

      const response = await fetch('/api/tournaments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(validated)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '大会の登録に失敗しました')
      }

      setSuccess(true)
      setFormData({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        prefecture: '',
        city: '',
        venue: '',
        category: '',
        level: '',
        entryFee: '',
        maxEntries: '',
        deadline: '',
        contactInfo: '',
        sourceUrl: ''
      })
      onSuccess?.()
    } catch (error) {
      if (error instanceof Error && error.message.includes('ZodError')) {
        const zodError = JSON.parse(error.message)
        const fieldErrors: Record<string, string> = {}
        zodError.issues?.forEach((issue: any) => {
          if (issue.path?.[0]) {
            fieldErrors[issue.path[0]] = issue.message
          }
        })
        setErrors(fieldErrors)
      } else {
        setErrors({ general: error instanceof Error ? error.message : '予期しないエラーが発生しました' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">大会情報を登録</h2>
      
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircleIcon className="w-5 h-5 text-green-500" />
            <p className="text-green-800 font-medium">大会情報が正常に登録されました</p>
          </div>
        </div>
      )}

      {errors.general && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
            <p className="text-red-800">{errors.general}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              大会名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">説明</label>
            <textarea
              rows={3}
              className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              開催日 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.startDate ? 'border-red-300' : 'border-gray-300'
              }`}
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
            {errors.startDate && <p className="text-red-600 text-sm mt-1">{errors.startDate}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">終了日</label>
            <input
              type="date"
              className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.endDate ? 'border-red-300' : 'border-gray-300'
              }`}
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
            {errors.endDate && <p className="text-red-600 text-sm mt-1">{errors.endDate}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              都道府県 <span className="text-red-500">*</span>
            </label>
            <select
              required
              className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
                errors.prefecture ? 'border-red-300' : 'border-gray-300'
              }`}
              value={formData.prefecture}
              onChange={(e) => setFormData({ ...formData, prefecture: e.target.value })}
            >
              <option value="">選択してください</option>
              {prefectures.map(pref => (
                <option key={pref} value={pref}>{pref}</option>
              ))}
            </select>
            {errors.prefecture && <p className="text-red-600 text-sm mt-1">{errors.prefecture}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">市区町村</label>
            <input
              type="text"
              className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.city ? 'border-red-300' : 'border-gray-300'
              }`}
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
            {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">会場</label>
            <input
              type="text"
              className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.venue ? 'border-red-300' : 'border-gray-300'
              }`}
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
            />
            {errors.venue && <p className="text-red-600 text-sm mt-1">{errors.venue}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              カテゴリー <span className="text-red-500">*</span>
            </label>
            <select
              required
              className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
                errors.category ? 'border-red-300' : 'border-gray-300'
              }`}
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">選択してください</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">レベル</label>
            <input
              type="text"
              placeholder="例: 県大会、全国大会"
              className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.level ? 'border-red-300' : 'border-gray-300'
              }`}
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
            />
            {errors.level && <p className="text-red-600 text-sm mt-1">{errors.level}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">参加費（円）</label>
            <input
              type="number"
              min="0"
              className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.entryFee ? 'border-red-300' : 'border-gray-300'
              }`}
              value={formData.entryFee}
              onChange={(e) => setFormData({ ...formData, entryFee: e.target.value })}
            />
            {errors.entryFee && <p className="text-red-600 text-sm mt-1">{errors.entryFee}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">定員</label>
            <input
              type="number"
              min="1"
              className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.maxEntries ? 'border-red-300' : 'border-gray-300'
              }`}
              value={formData.maxEntries}
              onChange={(e) => setFormData({ ...formData, maxEntries: e.target.value })}
            />
            {errors.maxEntries && <p className="text-red-600 text-sm mt-1">{errors.maxEntries}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">申込締切</label>
            <input
              type="date"
              className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.deadline ? 'border-red-300' : 'border-gray-300'
              }`}
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            />
            {errors.deadline && <p className="text-red-600 text-sm mt-1">{errors.deadline}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">参考URL</label>
            <input
              type="url"
              placeholder="https://example.com"
              className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.sourceUrl ? 'border-red-300' : 'border-gray-300'
              }`}
              value={formData.sourceUrl}
              onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
            />
            {errors.sourceUrl && <p className="text-red-600 text-sm mt-1">{errors.sourceUrl}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">問い合わせ先</label>
            <textarea
              rows={2}
              className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.contactInfo ? 'border-red-300' : 'border-gray-300'
              }`}
              value={formData.contactInfo}
              onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
            />
            {errors.contactInfo && <p className="text-red-600 text-sm mt-1">{errors.contactInfo}</p>}
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? '登録中...' : '大会を登録'}
          </button>
        </div>
      </form>
    </div>
  )
}