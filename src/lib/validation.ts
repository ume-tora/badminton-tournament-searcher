import { z } from 'zod'

export const tournamentSchema = z.object({
  name: z.string()
    .min(1, '大会名は必須です')
    .max(200, '大会名は200文字以内で入力してください')
    .refine(val => !/<script|javascript:|data:/i.test(val), 'invalid characters detected'),
  
  description: z.string()
    .max(1000, '説明は1000文字以内で入力してください')
    .optional()
    .refine(val => !val || !/<script|javascript:|data:/i.test(val), 'invalid characters detected'),
  
  startDate: z.string()
    .refine(val => !isNaN(Date.parse(val)), '有効な日付を入力してください')
    .refine(val => new Date(val) >= new Date(), '開催日は今日以降の日付を入力してください'),
  
  endDate: z.string()
    .optional()
    .refine(val => !val || !isNaN(Date.parse(val)), '有効な日付を入力してください'),
  
  prefecture: z.string()
    .min(1, '都道府県は必須です')
    .max(10, '都道府県名が正しくありません'),
  
  city: z.string()
    .max(50, '市区町村名は50文字以内で入力してください')
    .optional()
    .refine(val => !val || !/<script|javascript:|data:/i.test(val), 'invalid characters detected'),
  
  venue: z.string()
    .max(200, '会場名は200文字以内で入力してください')
    .optional()
    .refine(val => !val || !/<script|javascript:|data:/i.test(val), 'invalid characters detected'),
  
  category: z.enum(['一般', '学生', '高校生', '中学生', '小学生', 'シニア', '実業団'], {
    errorMap: () => ({ message: '有効なカテゴリーを選択してください' })
  }),
  
  level: z.string()
    .max(50, 'レベルは50文字以内で入力してください')
    .optional()
    .refine(val => !val || !/<script|javascript:|data:/i.test(val), 'invalid characters detected'),
  
  entryFee: z.number()
    .min(0, '参加費は0円以上で入力してください')
    .max(100000, '参加費は100,000円以下で入力してください')
    .optional(),
  
  maxEntries: z.number()
    .min(1, '定員は1名以上で入力してください')
    .max(10000, '定員は10,000名以下で入力してください')
    .optional(),
  
  deadline: z.string()
    .optional()
    .refine(val => !val || !isNaN(Date.parse(val)), '有効な日付を入力してください'),
  
  contactInfo: z.string()
    .max(500, '問い合わせ先は500文字以内で入力してください')
    .optional()
    .refine(val => !val || !/<script|javascript:|data:/i.test(val), 'invalid characters detected'),
  
  sourceUrl: z.string()
    .url('有効なURLを入力してください')
    .optional()
    .or(z.literal(''))
}).refine(data => {
  if (data.endDate && data.startDate) {
    return new Date(data.endDate) >= new Date(data.startDate)
  }
  return true
}, {
  message: '終了日は開始日以降の日付を入力してください',
  path: ['endDate']
}).refine(data => {
  if (data.deadline && data.startDate) {
    return new Date(data.deadline) <= new Date(data.startDate)
  }
  return true
}, {
  message: '申込締切は開催日以前の日付を入力してください',
  path: ['deadline']
})

export const searchSchema = z.object({
  prefecture: z.string().optional(),
  city: z.string().optional(),
  category: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  keyword: z.string()
    .max(100, 'キーワードは100文字以内で入力してください')
    .optional()
    .refine(val => !val || !/<script|javascript:|data:/i.test(val), 'invalid characters detected'),
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 20)
})

export function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

export function escapeInput(input: string): string {
  return input.trim().substring(0, 1000)
}