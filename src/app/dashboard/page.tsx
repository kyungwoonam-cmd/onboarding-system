'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Employee, EmailLog, SurveyResponse } from '@/lib/types'

export default function DashboardPage() {
  const router = useRouter()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([])
  const [surveyResponses, setSurveyResponses] = useState<SurveyResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth')
    if (auth !== 'true') {
      router.push('/')
      return
    }
    setAuthed(true)
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/dashboard-data')
      const data = await res.json()
      setEmployees(data.employees || [])
      setEmailLogs(data.emailLogs || [])
      setSurveyResponses(data.surveyResponses || [])
    } catch (e) {
      console.error('fetchData error:', e)
    } finally {
      setLoading(false)
    }
  }

  const getEmailStatus = (employeeId: string, type: string) => {
    return emailLogs.some(l => l.employee_id === employeeId && l.type === type && l.status === 'sent')
  }

  const getSurveyStatus = (employeeId: string) => {
    return surveyResponses.some(s => s.employee_id === employeeId)
  }

  const getDday = (joinDate: string) => {
    const diff = Math.ceil((new Date(joinDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    if (diff > 0) return `D-${diff}`
    if (diff === 0) return 'D-Day'
    return `D+${Math.abs(diff)}`
  }

  const handleManualSend = async (employee: Employee) => {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId: employee.id, type: 'manual' }),
    })
    if (res.ok) {
      alert(`${employee.name}님께 메일을 발송했습니다.`)
      fetchData()
    } else {
      alert('메일 발송에 실패했습니다.')
    }
  }

  if (!authed || loading) return <div style={{ padding: '48px', textAlign: 'center' }}>로딩 중...</div>

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <div style={{ background: 'white', padding: '16px 32px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '20px' }}>온보딩 관리자</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => router.push('/employees/new')} style={{ padding: '8px 16px', background: '#4F46E5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            + 신규입사자 등록
          </button>
          <button onClick={() => router.push('/templates')} style={{ padding: '8px 16px', background: 'white', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' }}>
            템플릿 관리
          </button>
          <button onClick={() => router.push('/responses')} style={{ padding: '8px 16px', background: 'white', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' }}>
            설문 응답
          </button>
          <button onClick={() => { localStorage.removeItem('admin_auth'); router.push('/') }} style={{ padding: '8px 16px', background: 'white', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' }}>
            로그아웃
          </button>
        </div>
      </div>

      <div style={{ padding: '32px' }}>
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #eee' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9f9f9' }}>
                {['이름', '조직', '입사일', 'D-Day', '연락처', '14일 전 메일', '7일 전 메일', '설문 응답', '즉시 발송'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#666', fontWeight: 500, borderBottom: '1px solid #eee' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 && (
                <tr><td colSpan={9} style={{ padding: '48px', textAlign: 'center', color: '#999' }}>등록된 입사자가 없습니다.</td></tr>
              )}
              {employees.map(emp => (
                <tr key={emp.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 500 }}>{emp.name}</td>
                  <td style={{ padding: '12px 16px', color: '#666' }}>{emp.organization}</td>
                  <td style={{ padding: '12px 16px', color: '#666' }}>{emp.join_date}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '2px 8px', background: '#EEF2FF', color: '#4F46E5', borderRadius: '99px', fontSize: '13px' }}>
                      {getDday(emp.join_date)}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#666', fontSize: '13px' }}>{emp.phone}<br />{emp.email}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ color: getEmailStatus(emp.id, '14days') ? '#16a34a' : '#999' }}>
                      {getEmailStatus(emp.id, '14days') ? '✓ 발송완료' : '대기중'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ color: getEmailStatus(emp.id, '7days') ? '#16a34a' : '#999' }}>
                      {getEmailStatus(emp.id, '7days') ? '✓ 발송완료' : '대기중'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ color: getSurveyStatus(emp.id) ? '#16a34a' : '#999' }}>
                      {getSurveyStatus(emp.id) ? '✓ 응답완료' : '미응답'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button onClick={() => handleManualSend(emp)} style={{ padding: '6px 12px', background: '#4F46E5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                      메일 발송
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
