import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const searchSchema = z.object({
  prefecture: z.string().optional(),
  city: z.string().optional(),
  category: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  keyword: z.string().optional(),
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 20)
})

export async function GET(request: NextRequest) {
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
          contactInfo: "日本バドミントン協会",
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
          contactInfo: "関東学生バドミントン連盟",
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
    const where: Record<string, any> = {}

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
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const tournament = await prisma.tournament.create({
      data: {
        name: body.name,
        description: body.description,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        prefecture: body.prefecture,
        city: body.city,
        venue: body.venue,
        category: body.category,
        level: body.level,
        entryFee: body.entryFee,
        maxEntries: body.maxEntries,
        deadline: body.deadline ? new Date(body.deadline) : null,
        contactInfo: body.contactInfo,
        sourceUrl: body.sourceUrl
      }
    })

    return NextResponse.json(tournament, { status: 201 })
  } catch (error) {
    console.error('Create tournament error:', error)
    return NextResponse.json(
      { error: 'Failed to create tournament' },
      { status: 500 }
    )
  }
}