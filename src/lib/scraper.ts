import axios from 'axios'
import * as cheerio from 'cheerio'
import { prisma } from './prisma'

interface TournamentData {
  name: string
  description?: string
  startDate: Date
  endDate?: Date
  prefecture: string
  city?: string
  venue?: string
  category: string
  level?: string
  entryFee?: number
  maxEntries?: number
  deadline?: Date
  contactInfo?: string
  sourceUrl: string
}

export class TournamentScraper {
  private delay = 1000 // 1秒間隔

  private async wait(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, this.delay))
  }

  private async logScraping(source: string, url: string, status: string, message?: string) {
    await prisma.scrapingLog.create({
      data: { source, url, status, message }
    })
  }

  async scrapeMintonJp(): Promise<void> {
    const baseUrl = 'https://minton.jp'
    
    try {
      const response = await axios.get(`${baseUrl}/tournament`, {
        headers: {
          'User-Agent': 'BadmintonTournamentSearch/1.0 (Educational Purpose)'
        }
      })

      const $ = cheerio.load(response.data)
      const tournaments: TournamentData[] = []

      $('.tournament-item').each((_, element) => {
        const $el = $(element)
        
        const name = $el.find('.tournament-name').text().trim()
        const dateText = $el.find('.tournament-date').text().trim()
        const prefectureText = $el.find('.tournament-location').text().trim()
        
        if (name && dateText) {
          const startDate = this.parseDate(dateText)
          if (startDate) {
            tournaments.push({
              name,
              startDate,
              prefecture: this.extractPrefecture(prefectureText),
              category: '一般',
              sourceUrl: `${baseUrl}/tournament`
            })
          }
        }
      })

      for (const tournament of tournaments) {
        await this.saveTournament(tournament)
        await this.wait()
      }

      await this.logScraping('minton.jp', baseUrl, 'success', `${tournaments.length} tournaments scraped`)
    } catch (error) {
      await this.logScraping('minton.jp', baseUrl, 'error', error instanceof Error ? error.message : 'Unknown error')
      throw error
    }
  }

  private parseDate(dateText: string): Date | null {
    const matches = dateText.match(/(\d{4})[年-](\d{1,2})[月-](\d{1,2})/)
    if (matches) {
      const [, year, month, day] = matches
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    }
    return null
  }

  private extractPrefecture(locationText: string): string {
    const prefectures = [
      '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
      '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
      '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
      '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
      '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
      '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
      '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
    ]
    
    for (const pref of prefectures) {
      if (locationText.includes(pref)) {
        return pref
      }
    }
    return 'その他'
  }

  private async saveTournament(data: TournamentData): Promise<void> {
    const existing = await prisma.tournament.findFirst({
      where: {
        name: data.name,
        startDate: data.startDate,
        prefecture: data.prefecture
      }
    })

    if (!existing) {
      await prisma.tournament.create({ data })
    }
  }
}