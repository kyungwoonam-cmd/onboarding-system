import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const today = new Date()
    const { data: employees } = await supabaseAdmin
      .from('employees')
      .select('*')

    if (!employees) return NextResponse.json({ success: true, sent: 0 })

    let sentCount = 0

    for (const employee of employees) {
      const joinDate = new Date(employee.join_date)
      const diffDays = Math.ceil((joinDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays === 14 || diffDays === 7) {
        const type = diffDays === 14 ? '14days' : '7days'

        const { data: alreadySent } = await supabaseAdmin
          .from('email_logs')
          .select('id')
          .eq('employee_id', employee.id)
          .eq('type', type)
          .eq('status', 'sent')
          .limit(1)

        if (alreadySent && alreadySent.length > 0) continue

        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ employeeId: employee.id, type }),
        })

        sentCount++
      }
    }

    return NextResponse.json({ success: true, sent: sentCount })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: '오류가 발생했습니다.' }, { status: 500 })
  }
}