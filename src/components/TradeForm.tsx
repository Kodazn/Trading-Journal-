import { useState } from 'react'
import { insertTrade, uploadTradeScreenshots } from '../lib/tradeApi'

interface TradeFormProps {
  onTradeAdded: () => void
}

export default function TradeForm({ onTradeAdded }: TradeFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    pair: 'EURUSD',
    position: 'BUY' as const,
    entry: '',
    stop_loss: '',
    take_profit: '',
    session: 'LONDON' as const,
    setup_type: 'REVERSAL' as const,
    bias: '',
    confirmation_trigger: '',
    result: 'OPEN' as const,
    pnl: '',
    emotional_notes: '',
    key_lesson: '',
    screenshots: [] as File[],
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (formData.screenshots.length + files.length > 3) {
      setError('Maximum 3 screenshots per trade')
      return
    }

    setFormData((prev) => ({
      ...prev,
      screenshots: [...prev.screenshots, ...files],
    }))

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewUrls((prev) => [...prev, event.target.result as string])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeScreenshot = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== index),
    }))
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      setSubmitting(true)

      if (!formData.bias.trim()) {
        throw new Error('Bias is required')
      }

      // Create trade entry
      const tradeId = Date.now().toString()
      const tradeData = {
        id: tradeId,
        date: formData.date,
        pair: formData.pair,
        position: formData.position,
        entry: parseFloat(formData.entry) || 0,
        stop_loss: parseFloat(formData.stop_loss) || 0,
        take_profit: parseFloat(formData.take_profit) || 0,
        rr: calculateRR(
          formData.entry,
          formData.stop_loss,
          formData.take_profit
        ),
        session: formData.session,
        setup_type: formData.setup_type,
        bias: formData.bias,
        confirmation_trigger: formData.confirmation_trigger,
        result: formData.result,
        pnl: parseFloat(formData.pnl) || 0,
        emotional_notes: formData.emotional_notes,
        key_lesson: formData.key_lesson,
        screenshots: [],
      }

      // Upload screenshots if any
      if (formData.screenshots.length > 0) {
        const uploadedUrls = await uploadTradeScreenshots(
          tradeId,
          formData.screenshots
        )
        tradeData.screenshots = uploadedUrls
      }

      // Insert trade
      await insertTrade(tradeData)

      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        pair: 'EURUSD',
        position: 'BUY',
        entry: '',
        stop_loss: '',
        take_profit: '',
        session: 'LONDON',
        setup_type: 'REVERSAL',
        bias: '',
        confirmation_trigger: '',
        result: 'OPEN',
        pnl: '',
        emotional_notes: '',
        key_lesson: '',
        screenshots: [],
      })
      setPreviewUrls([])

      onTradeAdded()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add trade')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Add New Trade</h2>
        <p className="text-slate-400">Be precise. Be honest. No fluff.</p>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-800 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold mb-4">Trade Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="bg-slate-800 border border-slate-700 text-slate-100 px-3 py-2 rounded focus:outline-none focus:border-purple-500"
            />
            <select
              name="pair"
              value={formData.pair}
              onChange={handleInputChange}
              className="bg-slate-800 border border-slate-700 text-slate-100 px-3 py-2 rounded focus:outline-none focus:border-purple-500"
            >
              {['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'NZDUSD', 'XAUUSD', 'NAS100', 'MGC', 'MNQ'].map(
                (pair) => (
                  <option key={pair} value={pair}>
                    {pair}
                  </option>
                )
              )}
            </select>
            <select
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              className="bg-slate-800 border border-slate-700 text-slate-100 px-3 py-2 rounded focus:outline-none focus:border-purple-500"
            >
              <option value="BUY">BUY</option>
              <option value="SELL">SELL</option>
            </select>
          </div>

          <textarea
            name="bias"
            placeholder="Structural bias (1 sentence)"
            value={formData.bias}
            onChange={handleInputChange}
            className="w-full bg-slate-800 border border-slate-700 text-slate-100 px-3 py-2 rounded focus:outline-none focus:border-purple-500 h-20 resize-none"
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="number"
              step="0.00001"
              name="entry"
              placeholder="Entry"
              value={formData.entry}
              onChange={handleInputChange}
              className="bg-slate-800 border border-slate-700 text-slate-100 px-3 py-2 rounded focus:outline-none focus:border-purple-500"
            />
            <input
              type="number"
              step="0.00001"
              name="stop_loss"
              placeholder="Stop Loss"
              value={formData.stop_loss}
              onChange={handleInputChange}
              className="bg-slate-800 border border-slate-700 text-slate-100 px-3 py-2 rounded focus:outline-none focus:border-purple-500"
            />
            <input
              type="number"
              step="0.00001"
              name="take_profit"
              placeholder="Take Profit"
              value={formData.take_profit}
              onChange={handleInputChange}
              className="bg-slate-800 border border-slate-700 text-slate-100 px-3 py-2 rounded focus:outline-none focus:border-purple-500"
            />
            <div className="bg-slate-800 border border-slate-700 px-3 py-2 rounded flex items-center">
              <span className="text-slate-400 text-sm">
                {calculateRR(
                  formData.entry,
                  formData.stop_loss,
                  formData.take_profit
                )
                  ? `${calculateRR(formData.entry, formData.stop_loss, formData.take_profit)}R`
                  : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Setup & Session */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold mb-4">Setup & Execution</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="setup_type"
              value={formData.setup_type}
              onChange={handleInputChange}
              className="bg-slate-800 border border-slate-700 text-slate-100 px-3 py-2 rounded focus:outline-none focus:border-purple-500"
            >
              <option value="REVERSAL">Reversal</option>
              <option value="CONTINUATION">Continuation</option>
            </select>
            <select
              name="session"
              value={formData.session}
              onChange={handleInputChange}
              className="bg-slate-800 border border-slate-700 text-slate-100 px-3 py-2 rounded focus:outline-none focus:border-purple-500"
            >
              <option value="LONDON">London</option>
              <option value="NEW_YORK">New York</option>
              <option value="LDN/NY OVERLAP">LDN/NY Overlap</option>
              <option value="ASIA">Asia</option>
            </select>
          </div>

          <textarea
            name="confirmation_trigger"
            placeholder="Confirmation trigger"
            value={formData.confirmation_trigger}
            onChange={handleInputChange}
            className="w-full bg-slate-800 border border-slate-700 text-slate-100 px-3 py-2 rounded focus:outline-none focus:border-purple-500 h-20 resize-none"
          />
        </div>

        {/* Result & Analysis */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold mb-4">Result & Analysis</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="result"
              value={formData.result}
              onChange={handleInputChange}
              className="bg-slate-800 border border-slate-700 text-slate-100 px-3 py-2 rounded focus:outline-none focus:border-purple-500"
            >
              <option value="OPEN">Open</option>
              <option value="WIN">Win</option>
              <option value="LOSS">Loss</option>
              <option value="MISSED">Missed</option>
            </select>
            <input
              type="number"
              step="0.01"
              name="pnl"
              placeholder="P&L (£)"
              value={formData.pnl}
              onChange={handleInputChange}
              className="bg-slate-800 border border-slate-700 text-slate-100 px-3 py-2 rounded focus:outline-none focus:border-purple-500"
            />
          </div>

          <textarea
            name="emotional_notes"
            placeholder="Emotional notes"
            value={formData.emotional_notes}
            onChange={handleInputChange}
            className="w-full bg-slate-800 border border-slate-700 text-slate-100 px-3 py-2 rounded focus:outline-none focus:border-purple-500 h-16 resize-none"
          />

          <textarea
            name="key_lesson"
            placeholder="Key lesson"
            value={formData.key_lesson}
            onChange={handleInputChange}
            className="w-full bg-slate-800 border border-slate-700 text-slate-100 px-3 py-2 rounded focus:outline-none focus:border-purple-500 h-16 resize-none"
          />
        </div>

        {/* Screenshots */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold mb-4">Screenshots (max 3)</h3>

          <label className="block">
            <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 transition">
              <div className="text-slate-400">Click to upload screenshots</div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </label>

          {previewUrls.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {previewUrls.map((url, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={url}
                    alt={`Preview ${idx}`}
                    className="w-full h-24 object-cover rounded border border-slate-700"
                  />
                  <button
                    type="button"
                    onClick={() => removeScreenshot(idx)}
                    className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
        >
          {submitting ? 'Saving...' : 'Log Trade'}
        </button>
      </form>
    </div>
  )
}

function calculateRR(entry: string, sl: string, tp: string): number | null {
  const e = parseFloat(entry)
  const s = parseFloat(sl)
  const t = parseFloat(tp)

  if (!e || !s || !t) return null

  const risk = Math.abs(e - s)
  const reward = Math.abs(t - e)

  if (risk === 0) return null
  return parseFloat((reward / risk).toFixed(2))
}
