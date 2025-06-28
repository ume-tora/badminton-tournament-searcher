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