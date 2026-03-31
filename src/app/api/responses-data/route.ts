import { NextResponse } from 'next/server'
import sql from '@/lib/supabase'

export async function GET() {
  try {
    const employees = await sql`SELECT * FROM employees`
    const responses = await sql`SELECT * FROM survey_responses ORDER BY created_at DESC`
    return NextResponse.json({ employees, responses })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: '오류가 발생했습니다.' }, { status: 500 })
  }
}
