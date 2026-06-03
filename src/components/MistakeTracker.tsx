import { useEffect, useState, useMemo } from 'react'
import type { Trade } from '../types/trade'
import { fetchTrades } from '../lib/tradeApi'

interface MistakeTrackerProps {
  refreshTrigger: number
}

interface Mistake {
  name: string
  count: number
  examples: Trade[]
}

export default function MistakeTracker({ refreshTrigger }: MistakeTrackerProps) {
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

  const mistakes: Mistake[] = useMemo(() => {
    const mistakes: Record<string, Mistake> = {}

    // Early entries (entries with confirmation but price moved significantly)
    const earlyEntries = trades.filter((t) =>
      t.emotional_notes?.toLowerCase().includes('early')
    )
    if (earlyEntries.length > 0) {
      mistakes['Early Entries'] = {
        name: 'Early Entries',
        count: earlyEntries.length,
        examples: earlyEntries.slice(0, 3),
      }
    }

    // Over-sizing (larger than usual risk)
    const losses = trades.filter((t) => t.result === 'LOSS')
    const largeRisks = losses.filter((t) => {
      const risk = Math.abs(Number(t.entry) - Number(t.stop_loss))
      return risk > 0.01 // Arbitrary threshold
    })
    if (largeRisks.length > 0) {
      mistakes['Oversizing'] = {
        name: 'Oversizing',
        count: largeRisks.length,
        examples: largeRisks.slice(0, 3),
      }
    }

    // Emotional trading
    const emotionalTrades = trades.filter((t) =>
      t.emotional_notes?.toLowerCase().includes('greedy') ||
      t.emotional_notes?.toLowerCase().includes('scared') ||
      t.emotional_notes?.toLowerCase().includes('emotional')
    )
    if (emotionalTrades.length > 0) {
      mistakes['Emotional Bias'] = {
        name: 'Emotional Bias',
        count: emotionalTrades.length,
        examples: emotionalTrades.slice(0, 3),
      }
    }

    // Missing confirmations
    const noConfirmation = trades.filter(
      (t) => !t.confirmation_trigger || t.confirmation_trigger.trim() === ''
    )
    if (noConfirmation.length > 0) {
      mistakes['Missing Confirmation'] = {
        name: 'Missing Confirmation',
        count: noConfirmation.length,
        examples: noConfirmation.slice(0, 3),
      }
    }

    return Object.values(mistakes)
  }, [trades])

  if (loading) {
    return <div className="text-slate-400">Loading mistake tracker...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Mistake Tracker</h2>
        <p className="text-slate-400">Identify your patterns and weaknesses</p>
      </div>

      {mistakes.length === 0 ? (
        <div className="text-center py-12 text-slate-400 bg-slate-900 border border-slate-800 rounded-lg">
          <p>No patterns detected. Keep trading and logging your trades.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {mistakes.map((mistake) => (
            <div
              key={mistake.name}
              className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{mistake.name}</h3>
                <span className="bg-red-900/30 text-red-400 px-3 py-1 rounded-full text-sm font-semibold">
                  {mistake.count}x detected
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-slate-400">Recent examples:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {mistake.examples.map((trade) => (
                    <div
                      key={trade.id}
                      className="bg-slate-800 p-3 rounded text-sm space-y-1"
                    >
                      <div className="font-semibold">{trade.pair}</div>
                      <div className="text-slate-400">{trade.date}</div>
                      <div
                        className={
                          trade.result === 'WIN'
                            ? 'text-green-400'
                            : 'text-red-400'
                        }
                      >
                        {trade.result} - £{trade.pnl.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded p-3 text-sm text-slate-300">
                <p className="font-semibold mb-1">Action Items:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  {mistake.name === 'Early Entries' && (
                    <>
                      <li>Wait for full confirmation candles</li>
                      <li>Set minimum number of confirmations required</li>
                      <li>Use alerts instead of immediate entry</li>
                    </>
                  )}
                  {mistake.name === 'Oversizing' && (
                    <>
                      <li>Reduce position size by 50%</li>
                      <li>Set fixed stop losses before entry</li>
                      <li>Review risk management plan</li>
                    </>
                  )}
                  {mistake.name === 'Emotional Bias' && (
                    <>
                      <li>Take a break after 3 trades</li>
                      <li>Use trading checklist before entry</li>
                      <li>Practice breathing exercises</li>
                    </>
                  )}
                  {mistake.name === 'Missing Confirmation' && (
                    <>
                      <li>Always document confirmation trigger</li>
                      <li>Create confirmation checklist</li>
                      <li>Review price action theory</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* General Stats */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold">General Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-xs text-slate-400 font-semibold mb-1">
              Loss Rate
            </div>
            <div className="text-2xl font-bold text-red-400">
              {trades.filter((t) => t.result === 'LOSS').length}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold mb-1">
              Avg Loss
            </div>
            <div className="text-2xl font-bold text-red-400">
              £
              {trades
                .filter((t) => t.result === 'LOSS' && t.pnl < 0)
                .reduce((sum, t) => sum + t.pnl, 0)
                .toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold mb-1">
              Biggest Loss
            </div>
            <div className="text-2xl font-bold text-red-400">
              £
              {Math.min(
                ...(trades
                  .filter((t) => t.result === 'LOSS')
                  .map((t) => t.pnl) || [0])
              ).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
