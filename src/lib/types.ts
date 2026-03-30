export interface Employee {
  id: string
  name: string
  organization: string
  phone: string
  email: string
  join_date: string
  created_at: string
}

export interface EmailLog {
  id: string
  employee_id: string
  template_id: string
  sent_at: string
  type: '14days' | '7days' | 'manual'
  status: 'sent' | 'failed'
}

export interface SurveyResponse {
  id: string
  employee_id: string
  token: string
  responses: Record<string, string>
  submitted_at: string
}

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  type: '14days' | '7days' | 'manual'
  created_at: string
}

export interface SurveyTemplate {
  id: string
  name: string
  questions: SurveyQuestion[]
  created_at: string
}

export interface SurveyQuestion {
  id: string
  question: string
  type: 'text' | 'radio' | 'checkbox'
  options?: string[]
}