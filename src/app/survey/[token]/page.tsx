'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Employee } from '@/lib/types'

const DEFAULT_QUESTIONS = [
  '입사 전 준비 과정에서 불편한 점이 있었나요?',
  '회사에 대해 더 알고 싶은 정보가 있나요?',
  '온보딩 과정에서 개선되었으면 하는 점이 있나요?',
  '현재 가장 걱정되거나 궁금한 점은 무엇인가요?',
  '기타 하고 싶은 말씀이 있으시면 자유롭게 작성해주세요.',
]

export default function SurveyPage() {
  const { token } = useParams()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchEmployee()
  }, [token])

  const fetchEmployee = async () => {
    const { data } = await supabase
      .from('survey_tokens')
      .select('*, employees(*)')
      .eq('token', token)
      .single()

    if (!data) {
      setError('유효하지 않은 설문 링크입니다.')
    } else if (data.used) {
      setSubmitted(true)
    } else {
      setEmployee(data.employees)
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!employee) return

    const { error: err1 } = await supabase.from('survey_responses').insert([{
      employee_id: employee.id,
      token: token,
      responses: answers,
      submitted_at: new Date().toISOString(),
    }])

    if (err1) {
      alert('제출 중 오류가 발생했습니다.')
      return
    }

    await supabase.from('survey_tokens').update({ used: true }).eq('token', token)
    setSubmitted(true)
  }

  if (loading) return <div style={{ padding: '48px', textAlign: 'center' }}>로딩 중...</div>

  if (error) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: '#666' }}>
        <p style={{ fontSize: '48px', margin: '0 0 16px' }}>⚠️</p>
        <p>{error}</p>
      </div>
    </div>
  )

  if (submitted) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
      <div style={{ background: 'white', borderRadius: '12px', padding: '48px', textAlign: 'center', maxWidth: '400px' }}>
        <p style={{ fontSize: '48px', margin: '0 0 16px' }}>✅</p>
        <h2 style={{ margin: '0 0 8px' }}>설문이 완료되었습니다!</h2>
        <p style={{ color: '#666' }}>소중한 의견 감사합니다. 입사일에 뵙겠습니다!</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '40px 16px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div style={{ background: '#4F46E5', borderRadius: '12px 12px 0 0', padding: '32px', color: 'white' }}>
          <h1 style={{ margin: '0 0 8px', fontSize: '24px' }}>입사 전 설문</h1>
          <p style={{ margin: 0, opacity: 0.85 }}>{employee?.name}님, 반갑습니다! 짧은 설문에 참여해주세요.</p>
        </div>
        <div style={{ background: 'white', borderRadius: '0 0 12px 12px', padding: '32px', border: '1px solid #eee', borderTop: 'none' }}>
          <form onSubmit={handleSubmit}>
            {DEFAULT_QUESTIONS.map((q, i) => (
              <div key={i} style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', fontWeight: 500, marginBottom: '8px', color: '#333' }}>
                  {i + 1}. {q}
                </label>
                <textarea
                  rows={3}
                  value={answers[q] || ''}
                  onChange={e => setAnswers({ ...answers, [q]: e.target.value })}
                  placeholder="자유롭게 작성해주세요"
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box', fontSize: '15px', resize: 'vertical' }}
                />
              </div>
            ))}
            <button type="submit" style={{
              width: '100%', padding: '14px', fontSize: '16px',
              background: '#4F46E5', color: 'white', border: 'none',
              borderRadius: '8px', cursor: 'pointer', marginTop: '8px'
            }}>
              설문 제출하기
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}