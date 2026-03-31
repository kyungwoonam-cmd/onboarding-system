import { NextResponse } from 'next/server'
import sql from '@/lib/supabase'

export async function GET() {
  try {
    const employees = await sql`SELECT * FROM employees ORDER BY join_date ASC`
    const emailLogs = await sql`SELECT * FROM email_logs`
    const surveyResponses = await sql`SELECT * FROM survey_responses`
    return NextResponse.json({ employees, emailLogs, surveyResponses })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: '오류가 발생했습니다.' }, { status: 500 })
  }
}
