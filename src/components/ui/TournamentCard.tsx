import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { CalendarIcon, MapPinIcon, UsersIcon, CurrencyYenIcon, ClockIcon } from '@heroicons/react/24/outline'

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

interface TournamentCardProps {
  tournament: Tournament
}

export default function TournamentCard({ tournament }: TournamentCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case '一般':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case '学生':
        return 'bg-green-100 text-green-800 border-green-200'
      case '高校生':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case '中学生':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'シニア':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case '実業団':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const isDeadlineSoon = tournament.deadline && 
    new Date(tournament.deadline) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group">
      {/* ヘッダー */}
      <div className="p-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 leading-tight">
            {tournament.name}
          </h2>
          <div className="flex flex-wrap gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(tournament.category)}`}>
              {tournament.category}
            </span>
            {tournament.level && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
                {tournament.level}
              </span>
            )}
          </div>
        </div>

        {tournament.description && (
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            {tournament.description}
          </p>
        )}
      </div>

      {/* 詳細情報 */}
      <div className="px-6 pb-6">
        <div className="grid gap-3">
          {/* 開催日 */}
          <div className="flex items-start gap-3">
            <CalendarIcon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-sm font-medium text-gray-700">開催日</span>
              <div className="text-sm text-gray-600">
                {format(new Date(tournament.startDate), 'yyyy年M月d日(E)', { locale: ja })}
                {tournament.endDate && tournament.endDate !== tournament.startDate && (
                  <span> - {format(new Date(tournament.endDate), 'M月d日(E)', { locale: ja })}</span>
                )}
              </div>
            </div>
          </div>

          {/* 開催場所 */}
          <div className="flex items-start gap-3">
            <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-sm font-medium text-gray-700">開催場所</span>
              <div className="text-sm text-gray-600">
                {tournament.prefecture}
                {tournament.city && ` ${tournament.city}`}
                {tournament.venue && (
                  <div className="text-xs text-gray-500 mt-1">{tournament.venue}</div>
                )}
              </div>
            </div>
          </div>

          {/* 参加費・定員 */}
          <div className="flex flex-wrap gap-6">
            {tournament.entryFee && (
              <div className="flex items-center gap-2">
                <CurrencyYenIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <span className="text-sm font-medium text-gray-700">参加費</span>
                  <div className="text-sm text-gray-600">{tournament.entryFee.toLocaleString()}円</div>
                </div>
              </div>
            )}
            
            {tournament.maxEntries && (
              <div className="flex items-center gap-2">
                <UsersIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <span className="text-sm font-medium text-gray-700">定員</span>
                  <div className="text-sm text-gray-600">{tournament.maxEntries}名</div>
                </div>
              </div>
            )}
          </div>

          {/* 申込締切 */}
          {tournament.deadline && (
            <div className="flex items-start gap-3">
              <ClockIcon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isDeadlineSoon ? 'text-red-500' : 'text-gray-400'}`} />
              <div>
                <span className="text-sm font-medium text-gray-700">申込締切</span>
                <div className={`text-sm ${isDeadlineSoon ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                  {format(new Date(tournament.deadline), 'yyyy年M月d日(E)', { locale: ja })}
                  {isDeadlineSoon && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                      締切間近
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 問い合わせ先 */}
        {tournament.contactInfo && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
            <span className="text-sm font-medium text-gray-700">問い合わせ</span>
            <div className="text-sm text-gray-600 mt-1">{tournament.contactInfo}</div>
          </div>
        )}
      </div>
    </div>
  )
}