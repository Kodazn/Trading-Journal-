import { useEffect, useState } from 'react'
import type { Trade } from '../types/trade'
import { fetchTrades } from '../lib/tradeApi'

interface DashboardProps {
  refreshTrigger: number
}

export default function Dashboard({ refreshTrigger }: DashboardProps) {
  const [trades, setTrades] = useState<Trade[]>([])
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

  const closedTrades = trades.filter(
    (t) => t.result === 'WIN' || t.result === 'LOSS'
  )
  const wins = trades.filter((t) => t.result === 'WIN').length
  const losses = trades.filter((t) => t.result === 'LOSS').length
  const winRate = closedTrades.length
    ? Math.round((wins / closedTrades.length) * 100)
    : 0
  const totalPnL = trades.reduce((sum, t) => sum + (t.pnl || 0), 0)
  const avgRR =
    closedTrades.length > 0
      ? (
          closedTrades.reduce((sum, t) => sum + (t.rr || 0), 0) /
          closedTrades.length
        ).toFixed(2)
      : '—'

  if (loading) {
    return <div className="text-slate-400">Loading dashboard...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Performance Overview</h2>
        <p className="text-slate-400">Your trading stats at a glance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard label="Total Trades" value={trades.length.toString()} />
        <KPICard
          label="Win Rate"
          value={`${winRate}%`}
          accent={winRate >= 50 ? 'text-green-400' : 'text-red-400'}
        />
        <KPICard
          label="Net P&L"
          value={`£${totalPnL.toFixed(2)}`}
          accent={totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}
        />
        <KPICard label="Wins/Losses" value={`${wins}W / ${losses}L`} />
        <KPICard label="Avg RR" value={`${avgRR}R`} />
      </div>

      {/* Performance Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-slate-400 mb-4">
          Performance Bar
        </h3>
        <div className="flex h-8 bg-slate-950 rounded gap-1 overflow-hidden">
          {trades.map((trade, idx) => (
            <div
              key={idx}
              className="flex-1 bg-slate-800"
              style={{
                backgroundColor:
                  trade.result === 'WIN'
                    ? '#22c55e'
                    : trade.result === 'LOSS'
                      ? '#ef4444'
                      : '#eab308',
              }}
            />
          ))}
        </div>
      </div>

      {/* Recent Trades */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-lg font-semibold">Recent Trades</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold">Pair</th>
                <th className="px-6 py-3 text-left text-xs font-semibold">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold">Entry</th>
                <th className="px-6 py-3 text-left text-xs font-semibold">RR</th>
                <th className="px-6 py-3 text-left text-xs font-semibold">Result</th>
                <th className="px-6 py-3 text-left text-xs font-semibold">P&L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {trades.slice(0, 10).map((trade) => (
                <tr key={trade.id} className="hover:bg-slate-800 transition">
                  <td className="px-6 py-3 text-sm">{trade.date}</td>
                  <td className="px-6 py-3 text-sm font-semibold">{trade.pair}</td>
                  <td className="px-6 py-3 text-sm">
                    <span
                      className={
                        trade.position === 'BUY'
                          ? 'text-green-400'
                          : 'text-red-400'
                      }
                    >
                      {trade.position}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm">{trade.entry}</td>
                  <td className="px-6 py-3 text-sm">
                    {trade.rr ? `${trade.rr}R` : '—'}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    <span
                      className={
                        trade.result === 'WIN'
                          ? 'text-green-400'
                          : trade.result === 'LOSS'
                            ? 'text-red-400'
                            : 'text-yellow-400'
                      }
                    >
                      {trade.result}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm font-semibold">
                    <span
                      className={
                        trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                      }
                    >
                      £{trade.pnl.toFixed(2)}
                    </span>
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

interface KPICardProps {
  label: string
  value: string
  accent?: string
}

function KPICard({ label, value, accent = 'text-slate-100' }: KPICardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
      <div className="text-xs font-semibold text-slate-400 mb-2">{label}</div>
      <div className={`text-2xl font-bold ${accent}`}>{value}</div>
    </div>
  )
}
