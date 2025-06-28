import { NextResponse } from 'next/server'
import { TournamentScraper } from '@/lib/scraper'

export async function POST() {
  try {
    const scraper = new TournamentScraper()
    await scraper.scrapeMintonJp()
    
    return NextResponse.json({ 
      message: 'Scraping completed successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Scraping error:', error)
    return NextResponse.json(
      { error: 'Scraping failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}