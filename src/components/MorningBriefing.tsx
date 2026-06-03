import { useEffect, useState } from 'react'

interface EconomicEvent {
  name: string
  date: string
  impact: 'high' | 'medium' | 'low'
  forecast: string
  previous: string
}

export default function MorningBriefing() {
  const [events, setEvents] = useState<EconomicEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadEconomicCalendar()
  }, [])

  const loadEconomicCalendar = async () => {
    try {
      setLoading(true)
      setError(null)

      // Using a free economic calendar API
      // This is a placeholder - you can use various free APIs like:
      // - https://api.economicscalendar.com/events (requires free registration)
      // - https://www.forexfactory.com (web scraping)
      // For now, we'll show a placeholder with example data

      const mockEvents: EconomicEvent[] = [
        {
          name: 'US Non-Farm Payrolls',
          date: 'Today 13:30 GMT',
          impact: 'high',
          forecast: '150K',
          previous: '145K',
        },
        {
          name: 'EUR Inflation',
          date: 'Today 10:00 GMT',
          impact: 'high',
          forecast: '2.3%',
          previous: '2.4%',
        },
        {
          name: 'GBP Retail Sales',
          date: 'Today 09:00 GMT',
          impact: 'medium',
          forecast: '+0.5%',
          previous: '-0.3%',
        },
        {
          name: 'USD Consumer Confidence',
          date: 'Tomorrow 15:00 GMT',
          impact: 'medium',
          forecast: '105.2',
          previous: '104.7',
        },
      ]

      setEvents(mockEvents)
    } catch (err) {
      setError('Failed to load economic calendar')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-900/30 text-red-400 border-red-800'
      case 'medium':
        return 'bg-yellow-900/30 text-yellow-400 border-yellow-800'
      case 'low':
        return 'bg-green-900/30 text-green-400 border-green-800'
      default:
        return 'bg-slate-800'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Morning Briefing</h2>
        <p className="text-slate-400">
          Today's economic events & market preparation
        </p>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <div className="text-xs font-semibold text-slate-400 mb-2">
            Primary Pair
          </div>
          <div className="text-2xl font-bold">EURUSD</div>
          <div className="text-slate-400 text-sm mt-2">1.0875</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <div className="text-xs font-semibold text-slate-400 mb-2">
            Gold
          </div>
          <div className="text-2xl font-bold">XAUUSD</div>
          <div className="text-slate-400 text-sm mt-2">2325.50</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <div className="text-xs font-semibold text-slate-400 mb-2">
            Session
          </div>
          <div className="text-2xl font-bold">London</div>
          <div className="text-slate-400 text-sm mt-2">08:00 - 17:00 GMT</div>
        </div>
      </div>

      {/* Economic Calendar */}
      {loading ? (
        <div className="text-slate-400">Loading economic calendar...</div>
      ) : error ? (
        <div className="bg-red-900/20 border border-red-800 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">High Impact Events</h3>
          {events.map((event, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold">{event.name}</h4>
                  <p className="text-sm text-slate-400 mt-1">{event.date}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${getImpactColor(event.impact)}`}
                >
                  {event.impact.toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-slate-400">Forecast</div>
                  <div className="font-semibold text-slate-200">
                    {event.forecast}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Previous</div>
                  <div className="font-semibold text-slate-200">
                    {event.previous}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Reaction</div>
                  <div className="font-semibold text-yellow-400">Watch</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Trading Prep Checklist */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold">Pre-Session Checklist</h3>
        <ul className="space-y-3">
          {[
            'Review yesterday\'s trades and lessons',
            'Check economic calendar for high-impact events',
            'Identify key support/resistance levels',
            'Set daily trading goal',
            'Review trading rules & position sizing',
            'Prepare entry and exit plans',
            'Clear head and manage emotions',
          ].map((item, idx) => (
            <li key={idx} className="flex items-center gap-3 text-sm">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-slate-300">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Session Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold">Trading Sessions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              name: 'Asia',
              time: '22:00 - 07:00 GMT',
              characteristics: 'Quiet, trending',
            },
            {
              name: 'London',
              time: '08:00 - 17:00 GMT',
              characteristics: 'Volatile, breakouts',
            },
            {
              name: 'New York',
              time: '13:00 - 22:00 GMT',
              characteristics: 'Volatile, major moves',
            },
            {
              name: 'Overlap',
              time: '12:00 - 16:00 GMT',
              characteristics: 'Highest liquidity',
            },
          ].map((session) => (
            <div key={session.name} className="bg-slate-800 p-4 rounded">
              <div className="font-semibold mb-2">{session.name}</div>
              <div className="text-xs text-slate-400 mb-1">{session.time}</div>
              <div className="text-sm text-slate-300">{session.characteristics}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
