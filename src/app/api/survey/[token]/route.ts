import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/supabase'

export async function GET(_req: NextRequest, { params }: { params: { token: string } }) {
  try {
    const tokens = await sql`
      SELECT survey_tokens.*, employees.* 
      FROM survey_tokens 
      JOIN employees ON survey_tokens.employee_id = employees.id
      WHERE survey_tokens.token = ${params.token}
      LIMIT 1
    `
    if (!tokens || tokens.length === 0) {
      return NextResponse.json({ error: '유효하지 않은 설문 링크입니다.' })
    }
    const data = tokens[0]
    if (data.used) {
      return NextResponse.json({ used: true })
    }
    return NextResponse.json({ employee: { id: data.employee_id, name: data.name, organization: data.organization, email: data.email, phone: data.phone, join_date: data.join_date, created_at: data.created_at } })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: '오류가 발생했습니다.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: { token: string } }) {
  try {
    const { employeeId, answers } = await req.json()
    await sql`
      INSERT INTO survey_responses (employee_id, token, responses)
      VALUES (${employeeId}, ${params.token}, ${JSON.stringify(answers)})
    `
    await sql`UPDATE survey_tokens SET used = true WHERE token = ${params.token}`
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: '오류가 발생했습니다.' }, { status: 500 })
  }
}
