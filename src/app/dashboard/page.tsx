const fetchData = async () => {
  try {
    const res = await fetch('/api/dashboard-data', { cache: 'no-store' }) // ✅ 이것만 추가
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
