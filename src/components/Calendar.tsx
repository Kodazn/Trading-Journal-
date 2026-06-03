import { useEffect, useState, useMemo } from 'react'
import type { Trade } from '../types/trade'
import { fetchTrades } from '../lib/tradeApi'

interface CalendarProps {
  refreshTrigger: number
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function Calendar({ refreshTrigger }: CalendarProps) {
  const [trades, setTrades] = useState<Trade[]>([])
  const [month, setMonth] = useState(new Date().getMonth())
  const [year, setYear] = useState(new Date().getFullYear())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTrades()
  }, [refreshTrigger])

  const loadTrades = async () => {
    try {
      setLoading(true)
      const data = await fetchTrades()
      setTrades(data)
    } catch (error) {
      console.error('Failed to load trades:', error)
    } finally {
      setLoading(false)
    }
  }

  const tradesByDate = useMemo(() => {
    const map: Record<string, Trade[]> = {}
    trades.forEach((trade) => {
      if (!map[trade.date]) {
        map[trade.date] = []
      }
      map[trade.date].push(trade)
    })
    return map
  }, [trades])

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

  const monthPnL = useMemo(() => {
    let pnl = 0
    let wins = 0
    let losses = 0
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const dayTrades = tradesByDate[dateStr] || []
      dayTrades.forEach((trade) => {
        pnl += trade.pnl || 0
        if (trade.result === 'WIN') wins++
        if (trade.result === 'LOSS') losses++
      })
    }
    return { pnl, wins, losses }
  }, [month, year, tradesByDate])

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11)
      setYear((y) => y - 1)
    } else {
      setMonth((m) => m - 1)
    }
  }

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0)
      setYear((y) => y + 1)
    } else {
      setMonth((m) => m + 1)
    }
  }

  if (loading) {
    return <div className="text-slate-400">Loading calendar...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Trading Calendar</h2>
        <p className="text-slate-400">Monthly P&L overview</p>
      </div>

      {/* Month Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="text-xs font-semibold text-slate-400 mb-2">
            Month P&L
          </div>
          <div
            className={`text-2xl font-bold ${
              monthPnL.pnl >= 0 ? 'text-green-400' : 'text-red-400'
            }`}
          >
            £{monthPnL.pnl.toFixed(2)}
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="text-xs font-semibold text-slate-400 mb-2">
            Win / Loss
          </div>
          <div className="text-2xl font-bold">
            <span className="text-green-400">{monthPnL.wins}W</span>
            {' / '}
            <span className="text-red-400">{monthPnL.losses}L</span>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="text-xs font-semibold text-slate-400 mb-2">
            Win Rate
          </div>
          <div className="text-2xl font-bold">
            {monthPnL.wins + monthPnL.losses > 0
              ? Math.round(
                  (monthPnL.wins / (monthPnL.wins + monthPnL.losses)) * 100
                )
              : 0}
            %
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h3 className="text-lg font-semibold">
            {MONTHS[month]} {year}
          </h3>
          <div className="flex gap-4">
            <button
              onClick={handlePrevMonth}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded transition"
            >
              ←
            </button>
            <button
              onClick={handleNextMonth}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded transition"
            >
              →
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {DAYS.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-semibold text-slate-400 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for days before the month starts */}
            {Array.from({ length: startDay }).map((_, i) => (
              <div key={`empty-${i}`} className="h-20 bg-slate-800 rounded" />
            ))}

            {/* Days of the month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const dayTrades = tradesByDate[dateStr] || []
              const dayPnL = dayTrades.reduce((sum, t) => sum + (t.pnl || 0), 0)
              const hasWin = dayTrades.some((t) => t.result === 'WIN')
              const hasLoss = dayTrades.some((t) => t.result === 'LOSS')

              let bgColor = 'bg-slate-800'
              if (dayTrades.length > 0) {
                if (hasWin && !hasLoss) {
                  bgColor = 'bg-green-900/30'
                } else if (hasLoss && !hasWin) {
                  bgColor = 'bg-red-900/30'
                } else {
                  bgColor = 'bg-yellow-900/30'
                }
              }

              return (
                <div
                  key={day}
                  className={`h-20 ${bgColor} rounded p-2 border border-slate-700 flex flex-col justify-between hover:border-slate-600 transition cursor-pointer`}
                >
                  <div className="text-xs font-semibold">{day}</div>
                  {dayTrades.length > 0 && (
                    <div className="text-xs space-y-1">
                      <div
                        className={`${
                          dayPnL >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        £{dayPnL.toFixed(0)}
                      </div>
                      <div className="text-slate-400">
                        {dayTrades.length} trade{dayTrades.length > 1 ? 's' : ''}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
