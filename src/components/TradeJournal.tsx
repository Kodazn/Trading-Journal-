import { useEffect, useState } from 'react'
import type { Trade } from '../types/trade'
import { fetchTrades } from '../lib/tradeApi'

interface TradeJournalProps {
  refreshTrigger: number
}

export default function TradeJournal({ refreshTrigger }: TradeJournalProps) {
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

  if (loading) {
    return <div className="text-slate-400">Loading trade journal...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Trade Journal</h2>
        <p className="text-slate-400">All your trades with detailed analysis</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-800">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Date</th>
                <th className="px-4 py-3 text-left font-semibold">Pair</th>
                <th className="px-4 py-3 text-left font-semibold">Position</th>
                <th className="px-4 py-3 text-left font-semibold">Entry</th>
                <th className="px-4 py-3 text-left font-semibold">SL</th>
                <th className="px-4 py-3 text-left font-semibold">TP</th>
                <th className="px-4 py-3 text-left font-semibold">RR</th>
                <th className="px-4 py-3 text-left font-semibold">Session</th>
                <th className="px-4 py-3 text-left font-semibold">Setup</th>
                <th className="px-4 py-3 text-left font-semibold">Result</th>
                <th className="px-4 py-3 text-left font-semibold">P&L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {trades.map((trade) => (
                <tr key={trade.id} className="hover:bg-slate-800 transition">
                  <td className="px-4 py-3">{trade.date}</td>
                  <td className="px-4 py-3 font-semibold">{trade.pair}</td>
                  <td className="px-4 py-3">
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
                  <td className="px-4 py-3">{trade.entry}</td>
                  <td className="px-4 py-3">{trade.stop_loss}</td>
                  <td className="px-4 py-3">{trade.take_profit}</td>
                  <td className="px-4 py-3">{trade.rr ? `${trade.rr}R` : '—'}</td>
                  <td className="px-4 py-3">{trade.session}</td>
                  <td className="px-4 py-3">{trade.setup_type}</td>
                  <td className="px-4 py-3">
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
                  <td className="px-4 py-3 font-semibold">
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

      {trades.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          No trades yet. Add your first trade to get started!
        </div>
      )}
    </div>
  )
}
