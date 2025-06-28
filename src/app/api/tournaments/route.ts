import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { searchSchema, tournamentSchema, sanitizeHtml } from '@/lib/validation'

// Rate limiting (简易版本)
const rateLimit = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const limit = rateLimit.get(ip)
  
  if (!limit || now > limit.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + 60000 }) // 1分間に60リクエスト
    return true
  }
  
  if (limit.count >= 60) {
    return false
  }
  
  limit.count++
  return true
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return 'unknown'
}

export async function GET(request: NextRequest) {
  const clientIP = getClientIP(request)
  
  if (!checkRateLimit(clientIP)) {
    return NextResponse.json(
      { error: 'レート制限に達しました。しばらく時間をおいてから再試行してください。' },
      { status: 429 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const params = Object.fromEntries(searchParams.entries())
    
    const validated = searchSchema.parse(params)
    const { prefecture, city, category, startDate, endDate, keyword, page, limit } = validated

    const skip = (page - 1) * limit

    // For production demo, return mock data if no database is available
    if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
      const mockTournaments = [
        {
          id: 1,
          name: "第45回全日本バドミントン選手権大会",
          description: "全国から強豪選手が集まる最高峰の大会です。",
          startDate: new Date("2024-12-15"),
          endDate: new Date("2024-12-17"),
          prefecture: "東京都",
          city: "渋谷区",
          venue: "国立代々木競技場",
          category: "一般",
          level: "全国大会",
          entryFee: 5000,
          maxEntries: 256,
          deadline: new Date("2024-11-30"),
          contactInfo: "日本バドミントン協会（デモデータ）",
          sourceUrl: "https://example.com/tournament1",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          name: "関東学生バドミントン選手権",
          description: "関東地区の大学生による熱戦が繰り広げられます。",
          startDate: new Date("2024-11-20"),
          endDate: new Date("2024-11-22"),
          prefecture: "神奈川県",
          city: "横浜市",
          venue: "横浜アリーナ",
          category: "学生",
          level: "地区大会",
          entryFee: 3000,
          maxEntries: 128,
          deadline: new Date("2024-11-10"),
          contactInfo: "関東学生バドミントン連盟（デモデータ）",
          sourceUrl: "https://example.com/tournament2",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]

      const filteredTournaments = mockTournaments.filter(tournament => {
        if (prefecture && tournament.prefecture !== prefecture) return false
        if (city && !tournament.city?.includes(city)) return false
        if (category && tournament.category !== category) return false
        if (keyword && !tournament.name.includes(keyword)) return false
        return true
      })

      const total = filteredTournaments.length
      const paginatedTournaments = filteredTournaments.slice(skip, skip + limit)

      return NextResponse.json({
        tournaments: paginatedTournaments,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = {
      status: 'published' // Only show published tournaments
    }

    if (prefecture) {
      where.prefecture = prefecture
    }

    if (city) {
      where.city = {
        contains: city
      }
    }

    if (category) {
      where.category = category
    }

    if (startDate) {
      where.startDate = {
        gte: new Date(startDate)
      }
    }

    if (endDate) {
      where.startDate = {
        ...where.startDate,
        lte: new Date(endDate)
      }
    }

    if (keyword) {
      where.OR = [
        { name: { contains: keyword } },
        { description: { contains: keyword } },
        { venue: { contains: keyword } }
      ]
    }

    const [tournaments, total] = await Promise.all([
      prisma.tournament.findMany({
        where,
        orderBy: { startDate: 'asc' },
        skip,
        take: limit
      }),
      prisma.tournament.count({ where })
    ])

    return NextResponse.json({
      tournaments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: '検索処理でエラーが発生しました' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request)
  
  if (!checkRateLimit(clientIP)) {
    return NextResponse.json(
      { error: 'レート制限に達しました。しばらく時間をおいてから再試行してください。' },
      { status: 429 }
    )
  }

  try {
    const body = await request.json()
    
    // Validate input data
    const validated = tournamentSchema.parse(body)
    
    // Sanitize text inputs
    const sanitizedData = {
      ...validated,
      name: sanitizeHtml(validated.name),
      description: validated.description ? sanitizeHtml(validated.description) : undefined,
      city: validated.city ? sanitizeHtml(validated.city) : undefined,
      venue: validated.venue ? sanitizeHtml(validated.venue) : undefined,
      level: validated.level ? sanitizeHtml(validated.level) : undefined,
      contactInfo: validated.contactInfo ? sanitizeHtml(validated.contactInfo) : undefined,
      startDate: new Date(validated.startDate),
      endDate: validated.endDate ? new Date(validated.endDate) : undefined,
      deadline: validated.deadline ? new Date(validated.deadline) : undefined
    }

    // For production demo, just return success without saving to database
    if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
      return NextResponse.json({ 
        message: '大会情報が正常に登録されました（デモモード）',
        id: Math.floor(Math.random() * 1000) + 1000
      }, { status: 201 })
    }

    const tournament = await prisma.tournament.create({
      data: sanitizedData
    })

    // Log the action (audit trail)
    await prisma.auditLog.create({
      data: {
        action: 'create',
        entity: 'tournament',
        entityId: tournament.id,
        details: `Tournament "${tournament.name}" created`,
        ipAddress: clientIP,
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    return NextResponse.json(tournament, { status: 201 })
  } catch (error) {
    console.error('Create tournament error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: '入力データが正しくありません', details: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: '大会登録でエラーが発生しました' },
      { status: 500 }
    )
  }
}