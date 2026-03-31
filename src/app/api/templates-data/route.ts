import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/supabase'

export async function GET() {
  try {
    const emailTemplates = await sql`SELECT * FROM email_templates ORDER BY type`
    return NextResponse.json({ emailTemplates })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: '오류가 발생했습니다.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    await sql`INSERT INTO email_templates (name, subject, body, type) VALUES (${body.name}, ${body.subject}, ${body.body}, ${body.type})`
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: '오류가 발생했습니다.' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    await sql`UPDATE email_templates SET name=${body.name}, subject=${body.subject}, body=${body.body}, type=${body.type} WHERE id=${body.id}`
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: '오류가 발생했습니다.' }, { status: 500 })
  }
}
