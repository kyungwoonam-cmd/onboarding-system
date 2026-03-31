'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      localStorage.setItem('admin_auth', 'true')
      router.push('/dashboard')
    } else {
      setError('비밀번호가 올바르지 않습니다.')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#f5f5f5'
    }}>
      <div style={{
        background: 'white', padding: '48px', borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px'
      }}>
        <h1 style={{ margin: '0 0 8px', fontSize: '24px' }}>온보딩 관리자</h1>
        <p style={{ margin: '0 0 32px', color: '#666' }}>관리자 비밀번호를 입력하세요</p>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              width: '100%', padding: '12px', fontSize: '16px',
              border: '1px solid #ddd', borderRadius: '8px',
              boxSizing: 'border-box', marginBottom: '12px'
            }}
          />
          {error && <p style={{ color: 'red', margin: '0 0 12px', fontSize: '14px' }}>{error}</p>}
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '12px', fontSize: '16px',
            background: '#4F46E5', color: 'white', border: 'none',
            borderRadius: '8px', cursor: 'pointer'
          }}>
            {loading ? '확인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  )
}
