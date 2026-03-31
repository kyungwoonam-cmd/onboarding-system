import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    await sql`
      INSERT INTO employees (name, organization, phone, email, join_date)
      VALUES (${body.name}, ${body.organization}, ${body.phone}, ${body.email}, ${body.join_date})
    `
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: '오류가 발생했습니다.' }, { status: 500 })
  }
}
