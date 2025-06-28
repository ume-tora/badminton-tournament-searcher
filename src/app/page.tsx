'use client'

import { useState, useEffect } from 'react'
import TournamentCard from '@/components/ui/TournamentCard'
import SearchFilters from '@/components/ui/SearchFilters'
import Pagination from '@/components/ui/Pagination'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { MagnifyingGlassIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface Tournament {
  id: number
  name: string
  description?: string
  startDate: string
  endDate?: string
  prefecture: string
  city?: string
  venue?: string
  category: string
  level?: string
  entryFee?: number
  maxEntries?: number
  deadline?: string
  contactInfo?: string
  sourceUrl: string
}

interface SearchFilters {
  prefecture: string
  city: string
  category: string
  startDate: string
  endDate: string
  keyword: string
}

export default function Home() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<SearchFilters>({
    prefecture: '',
    city: '',
    category: '',
    startDate: '',
    endDate: '',
    keyword: ''
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  })

  const searchTournaments = async (page = 1) => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([, value]) => value !== '')
        )
      })

      const response = await fetch(`/api/tournaments?${params}`)
      
      if (!response.ok) {
        throw new Error('検索中にエラーが発生しました')
      }
      
      const data = await response.json()
      
      setTournaments(data.tournaments)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Search error:', error)
      setError(error instanceof Error ? error.message : '検索中にエラーが発生しました')
      setTournaments([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    searchTournaments(1)
  }

  const handlePageChange = (newPage: number) => {
    searchTournaments(newPage)
  }

  useEffect(() => {
    searchTournaments()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              🏸 バドミントン大会検索
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              全国のバドミントン大会情報を簡単に検索できます
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        {/* 検索フィルター */}
        <div className="mb-8">
          <SearchFilters 
            filters={filters}
            onFiltersChange={setFilters}
            onSearch={handleSearch}
            loading={loading}
          />
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-800">エラーが発生しました</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* 検索結果ヘッダー */}
        {!loading && !error && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">
                {pagination.total > 0 ? (
                  <>
                    <span className="font-semibold text-gray-900">{pagination.total}</span>
                    件の大会が見つかりました
                  </>
                ) : (
                  '検索結果: 0件'
                )}
              </span>
            </div>
            {pagination.total > 0 && (
              <div className="text-sm text-gray-500">
                {pagination.limit}件ずつ表示
              </div>
            )}
          </div>
        )}

        {/* ローディング表示 */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <LoadingSpinner size="lg" className="mb-4" />
            <p className="text-gray-600">検索中...</p>
          </div>
        )}

        {/* 検索結果 */}
        {!loading && !error && tournaments.length > 0 && (
          <div className="grid gap-6 sm:gap-8 mb-8">
            {tournaments.map(tournament => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        )}

        {/* 検索結果なし */}
        {!loading && !error && tournaments.length === 0 && (
          <div className="text-center py-16">
            <div className="mb-4">
              <MagnifyingGlassIcon className="w-16 h-16 text-gray-300 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              検索条件に一致する大会が見つかりませんでした
            </h3>
            <p className="text-gray-600 mb-6">
              検索条件を変更して再度お試しください
            </p>
            <button
              onClick={() => {
                setFilters({
                  prefecture: '',
                  city: '',
                  category: '',
                  startDate: '',
                  endDate: '',
                  keyword: ''
                })
                searchTournaments(1)
              }}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              すべての大会を表示
            </button>
          </div>
        )}

        {/* ページネーション */}
        {!loading && !error && pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            className="mt-8"
          />
        )}
      </main>
    </div>
  )
}