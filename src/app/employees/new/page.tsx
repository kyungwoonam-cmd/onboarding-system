'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function NewEmployeePage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '', organization: '', phone: '', email: '', join_date: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.from('employees').insert([form])
    if (error) {
      alert('등록 중 오류가 발생했습니다: ' + error.message)
    } else {
      alert('신규입사자가 등록되었습니다!')
      router.push('/dashboard')
    }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%', padding: '12px', fontSize: '15px',
    border: '1px solid #ddd', borderRadius: '8px',
    boxSizing: 'border-box' as const, marginBottom: '16px'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <div style={{ background: 'white', padding: '16px 32px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>←</button>
        <h1 style={{ margin: 0, fontSize: '20px' }}>신규입사자 등록</h1>
      </div>
      <div style={{ maxWidth: '560px', margin: '40px auto', background: 'white', borderRadius: '12px', padding: '40px', border: '1px solid #eee' }}>
        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '6px' }}>이름 *</label>
          <input style={inputStyle} placeholder="홍길동" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />

          <label style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '6px' }}>조직 *</label>
          <input style={inputStyle} placeholder="개발팀" value={form.organization} onChange={e => setForm({ ...form, organization: e.target.value })} required />

          <label style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '6px' }}>전화번호 *</label>
          <input style={inputStyle} placeholder="010-0000-0000" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />

          <label style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '6px' }}>이메일 *</label>
          <input style={inputStyle} type="email" placeholder="hong@company.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />

          <label style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '6px' }}>입사일 *</label>
          <input style={inputStyle} type="date" value={form.join_date} onChange={e => setForm({ ...form, join_date: e.target.value })} required />

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px', fontSize: '16px',
            background: '#4F46E5', color: 'white', border: 'none',
            borderRadius: '8px', cursor: 'pointer', marginTop: '8px'
          }}>
            {loading ? '등록 중...' : '등록하기'}
          </button>
        </form>
      </div>
    </div>
  )
}
