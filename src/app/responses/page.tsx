'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Employee, SurveyResponse } from '@/lib/types'

export default function ResponsesPage() {
  const router = useRouter()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [responses, setResponses] = useState<SurveyResponse[]>([])
  const [selected, setSelected] = useState<SurveyResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (localStorage.getItem('admin_auth') !== 'true') {
      router.push('/')
      return
    }
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/responses-data')
      const data = await res.json()
      setEmployees(data.employees || [])
      setResponses(data.responses || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const getEmployee = (id: string) => employees.find(e => e.id === id)

  if (loading) return <div style={{ padding: '48px', textAlign: 'center' }}>로딩 중...</div>

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <div style={{ background: 'white', padding: '16px 32px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>←</button>
        <h1 style={{ margin: 0, fontSize: '20px' }}>설문 응답 목록</h1>
      </div>

      <div style={{ padding: '32px', maxWidth: '900px', margin: '0 auto' }}>
        {responses.length === 0 && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '48px', textAlign: 'center', color: '#999', border: '1px solid #eee' }}>
            아직 설문 응답이 없습니다.
          </div>
        )}
        {responses.map(res => {
          const emp = getEmployee(res.employee_id)
          return (
            <div key={res.id} style={{ background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '12px', border: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontWeight: 500, fontSize: '16px' }}>{emp?.name || '알 수 없음'}</span>
                <span style={{ marginLeft: '8px', color: '#666', fontSize: '14px' }}>{emp?.organization}</span>
                <p style={{ margin: '4px 0 0', color: '#999', fontSize: '13px' }}>
                  응답일시: {new Date(res.submitted_at).toLocaleString('ko-KR')}
                </p>
              </div>
              <button onClick={() => setSelected(res)} style={{ padding: '6px 14px', background: '#4F46E5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                응답 보기
              </button>
            </div>
          )
        })}
      </div>

      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0 }}>{getEmployee(selected.employee_id)?.name}님의 응답</h2>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            {Object.entries(selected.responses).map(([question, answer]) => (
              <div key={question} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f0f0f0' }}>
                <p style={{ margin: '0 0 8px', fontWeight: 500, color: '#333' }}>{question}</p>
                <p style={{ margin: 0, color: '#666' }}>{answer as string}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
