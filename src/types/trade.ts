export interface Trade {
  id: string
  date: string
  pair: string
  position: 'BUY' | 'SELL'
  entry: number
  stop_loss: number
  take_profit: number
  rr: number | null
  result: 'OPEN' | 'WIN' | 'LOSS' | 'MISSED'
  pnl: number
  session: 'LONDON' | 'NEW_YORK' | 'LDN/NY OVERLAP' | 'ASIA'
  setup_type: 'REVERSAL' | 'CONTINUATION'
  bias: string
  confirmation_trigger: string
  emotional_notes: string
  key_lesson: string
  screenshots: string[]
  entry_time?: string
  exit_time?: string
  ai_journal_entry?: string
  created_at?: string
}
