import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const testTournaments = [
  {
    name: '第45回全日本バドミントン選手権大会',
    description: '全国から強豪選手が集結する最高峰の大会です。',
    startDate: new Date('2024-12-15'),
    endDate: new Date('2024-12-17'),
    prefecture: '東京都',
    city: '調布市',
    venue: '武蔵野の森総合スポーツプラザ',
    category: '一般',
    level: '全国大会',
    entryFee: 5000,
    maxEntries: 256,
    deadline: new Date('2024-11-30'),
    contactInfo: '日本バドミントン協会 03-1234-5678',
    sourceUrl: 'https://www.badminton.or.jp/tournament/test'
  },
  {
    name: '神奈川県バドミントン選手権大会',
    description: '神奈川県内最大規模のバドミントン大会です。',
    startDate: new Date('2024-11-20'),
    endDate: new Date('2024-11-21'),
    prefecture: '神奈川県',
    city: '横浜市',
    venue: '横浜文化体育館',
    category: '一般',
    level: '県大会',
    entryFee: 3000,
    maxEntries: 128,
    deadline: new Date('2024-11-10'),
    contactInfo: '神奈川県バドミントン協会',
    sourceUrl: 'https://kanagawa-badminton.jp/tournament/test'
  },
  {
    name: '関東学生バドミントン選手権大会',
    description: '関東地区の大学生による熱戦が繰り広げられます。',
    startDate: new Date('2024-10-25'),
    endDate: new Date('2024-10-27'),
    prefecture: '埼玉県',
    city: 'さいたま市',
    venue: 'さいたまスーパーアリーナ',
    category: '学生',
    level: '地区大会',
    entryFee: 2000,
    maxEntries: 200,
    deadline: new Date('2024-10-15'),
    contactInfo: '関東学生バドミントン連盟',
    sourceUrl: 'https://kanto-student-badminton.jp/tournament/test'
  },
  {
    name: '大阪府シニアバドミントン大会',
    description: '40歳以上の方が対象のシニア大会です。',
    startDate: new Date('2024-12-01'),
    endDate: new Date('2024-12-01'),
    prefecture: '大阪府',
    city: '大阪市',
    venue: '大阪府立体育会館',
    category: 'シニア',
    level: '府大会',
    entryFee: 2500,
    maxEntries: 64,
    deadline: new Date('2024-11-20'),
    contactInfo: '大阪府バドミントン協会',
    sourceUrl: 'https://osaka-badminton.jp/tournament/test'
  },
  {
    name: '千葉県高等学校バドミントン新人大会',
    description: '千葉県内の高校生による新人戦です。',
    startDate: new Date('2024-11-08'),
    endDate: new Date('2024-11-09'),
    prefecture: '千葉県',
    city: '千葉市',
    venue: '千葉ポートアリーナ',
    category: '高校生',
    level: '県大会',
    entryFee: 1500,
    maxEntries: 180,
    deadline: new Date('2024-10-25'),
    contactInfo: '千葉県高等学校体育連盟バドミントン部',
    sourceUrl: 'https://chiba-highschool-badminton.jp/tournament/test'
  },
  {
    name: '北海道バドミントン選手権大会',
    description: '雪国北海道の熱いバドミントン大会です。',
    startDate: new Date('2024-11-30'),
    endDate: new Date('2024-12-01'),
    prefecture: '北海道',
    city: '札幌市',
    venue: '北海きたえーる',
    category: '一般',
    level: '道大会',
    entryFee: 3500,
    maxEntries: 120,
    deadline: new Date('2024-11-15'),
    contactInfo: '北海道バドミントン協会',
    sourceUrl: 'https://hokkaido-badminton.jp/tournament/test'
  },
  {
    name: '福岡県実業団バドミントン選手権大会',
    description: '九州地区の実業団チームが参加する大会です。',
    startDate: new Date('2024-12-08'),
    endDate: new Date('2024-12-08'),
    prefecture: '福岡県',
    city: '福岡市',
    venue: '福岡市民体育館',
    category: '実業団',
    level: '県大会',
    entryFee: 4000,
    maxEntries: 32,
    deadline: new Date('2024-11-25'),
    contactInfo: '福岡県実業団バドミントン連盟',
    sourceUrl: 'https://fukuoka-jitsugyodan-badminton.jp/tournament/test'
  },
  {
    name: '愛知県中学生バドミントン選手権大会',
    description: '愛知県内の中学生が参加する選手権大会です。',
    startDate: new Date('2024-11-16'),
    endDate: new Date('2024-11-17'),
    prefecture: '愛知県',
    city: '名古屋市',
    venue: '名古屋市総合体育館',
    category: '中学生',
    level: '県大会',
    entryFee: 1000,
    maxEntries: 150,
    deadline: new Date('2024-11-05'),
    contactInfo: '愛知県中学校体育連盟バドミントン部',
    sourceUrl: 'https://aichi-junior-badminton.jp/tournament/test'
  }
]

async function main() {
  console.log('テストデータを作成中...')
  
  for (const tournament of testTournaments) {
    await prisma.tournament.create({
      data: tournament
    })
    console.log(`✓ ${tournament.name} を作成しました`)
  }
  
  console.log('テストデータの作成が完了しました！')
  
  // 作成されたデータの確認
  const count = await prisma.tournament.count()
  console.log(`\n合計 ${count} 件の大会データが登録されています。`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })