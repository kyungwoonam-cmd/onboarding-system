'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { EmailTemplate } from '@/lib/types'

export default function TemplatesPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'email' | 'survey'>('email')
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([])
  const [editing, setEditing] = useState<EmailTemplate | null>(null)
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
      const res = await fetch('/api/templates-data')
      const data = await res.json()
      setEmailTemplates(data.emailTemplates || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const saveEmailTemplate = async () => {
    if (!editing) return
    await fetch('/api/templates-data', {
      method: editing.id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    })
    alert('저장되었습니다!')
    setEditing(null)
    fetchData()
  }

  const typeLabel = (type: string) => {
    if (type === '14days') return '14일 전'
    if (type === '7days') return '7일 전'
    return '즉시 발송'
  }

  if (loading) return <div style={{ padding: '48px', textAlign: 'center' }}>로딩 중...</div>

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <div style={{ background: 'white', padding: '16px 32px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>←</button>
        <h1 style={{ margin: 0, fontSize: '20px' }}>템플릿 관리</h1>
      </div>

      <div style={{ padding: '32px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {(['email', 'survey'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '8px 20px', borderRadius: '8px', cursor: 'pointer',
              background: tab === t ? '#4F46E5' : 'white',
              color: tab === t ? 'white' : '#666',
              border: tab === t ? 'none' : '1px solid #ddd'
            }}>
              {t === 'email' ? '메일 템플릿' : '설문 템플릿'}
            </button>
          ))}
        </div>

        {tab === 'email' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
              <button onClick={() => setEditing({ id: '', name: '', subject: '', body: '', type: '14days', created_at: '' })}
                style={{ padding: '8px 16px', background: '#4F46E5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                + 새 템플릿
              </button>
            </div>
            {emailTemplates.map(tmpl => (
              <div key={tmpl.id} style={{ background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '12px', border: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ padding: '2px 8px', background: '#EEF2FF', color: '#4F46E5', borderRadius: '99px', fontSize: '12px', marginRight: '8px' }}>{typeLabel(tmpl.type)}</span>
                  <span style={{ fontWeight: 500 }}>{tmpl.name}</span>
                  <p style={{ margin: '4px 0 0', color: '#666', fontSize: '14px' }}>{tmpl.subject}</p>
                </div>
                <button onClick={() => setEditing(tmpl)} style={{ padding: '6px 14px', background: 'white', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' }}>편집</button>
              </div>
            ))}
          </div>
        )}

        {tab === 'survey' && (
          <div>
            <p style={{ color: '#666' }}>설문 템플릿은 현재 기본 템플릿이 사용됩니다. 추후 편집 기능이 추가될 예정입니다.</p>
          </div>
        )}
      </div>

      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
            <h2 style={{ margin: '0 0 24px' }}>메일 템플릿 편집</h2>
            <label style={{ fontSize: '14px', color: '#666' }}>템플릿 이름</label>
            <input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box', margin: '6px 0 16px' }} />
            <label style={{ fontSize: '14px', color: '#666' }}>발송 시기</label>
            <select value={editing.type} onChange={e => setEditing({ ...editing, type: e.target.value as EmailTemplate['type'] })}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box', margin: '6px 0 16px' }}>
              <option value="14days">14일 전</option>
              <option value="7days">7일 전</option>
              <option value="manual">즉시 발송</option>
            </select>
            <label style={{ fontSize: '14px', color: '#666' }}>메일 제목</label>
            <input value={editing.subject} onChange={e => setEditing({ ...editing, subject: e.target.value })}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box', margin: '6px 0 16px' }} />
            <label style={{ fontSize: '14px', color: '#666' }}>메일 본문</label>
            <textarea value={editing.body} onChange={e => setEditing({ ...editing, body: e.target.value })} rows={10}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box', margin: '6px 0 16px', fontFamily: 'monospace' }} />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setEditing(null)} style={{ padding: '10px 20px', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', background: 'white' }}>취소</button>
              <button onClick={saveEmailTemplate} style={{ padding: '10px 20px', background: '#4F46E5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
