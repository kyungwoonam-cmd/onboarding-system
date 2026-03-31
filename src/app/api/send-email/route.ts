import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/supabase'
import { resend } from '@/lib/resend'
import { randomUUID } from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { employeeId, type } = await req.json()

    const employees = await sql`SELECT * FROM employees WHERE id = ${employeeId} LIMIT 1`
    const employee = employees[0]
    if (!employee) {
      return NextResponse.json({ error: '입사자를 찾을 수 없습니다.' }, { status: 404 })
    }

    const templates = await sql`SELECT * FROM email_templates WHERE type = ${type} LIMIT 1`

    const token = randomUUID()
    await sql`INSERT INTO survey_tokens (token, employee_id, used) VALUES (${token}, ${employeeId}, false)`

    const surveyLink = `${process.env.NEXT_PUBLIC_BASE_URL}/survey/${token}`

    let subject = `[온보딩] ${employee.name}님, 입사를 환영합니다!`
    let html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>${employee.name}님, 안녕하세요!</h2>
        <p>입사일(${employee.join_date})이 다가오고 있습니다.</p>
        <p>아래 링크를 통해 입사 전 설문에 참여해주세요.</p>
        <a href="${surveyLink}" style="display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">
          설문 참여하기
        </a>
        <p style="color: #666; font-size: 14px;">궁금한 점이 있으시면 언제든지 연락주세요.</p>
      </div>
    `

    if (templates && templates.length > 0) {
      const tmpl = templates[0]
      subject = tmpl.subject
      html = tmpl.body
        .replace(/{{name}}/g, employee.name)
        .replace(/{{join_date}}/g, employee.join_date)
        .replace(/{{survey_link}}/g, surveyLink)
    }

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: employee.email,
      subject,
      html,
    })

    await sql`INSERT INTO email_logs (employee_id, template_id, type, status, sent_at) VALUES (${employeeId}, ${templates?.[0]?.id || null}, ${type}, 'sent', NOW())`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: '메일 발송 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
