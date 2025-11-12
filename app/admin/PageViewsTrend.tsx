'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ChartData {
  day: string
  views: number
  orders: number
  revenue: number
}

interface PageViewsTrendProps {
  data: ChartData[]
}

export default function PageViewsTrend({ data }: PageViewsTrendProps) {
  return (
    <div className="main-chart-card">
      <div className="chart-header">
        <h3>Page Views Trend</h3>
        <div className="chart-actions">
          <button className="time-filter active">Week</button>
          <button className="time-filter">Month</button>
          <button className="time-filter">Year</button>
        </div>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart 
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          >
            <defs>
              <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f5ff" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00f5ff" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9d4edd" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#9d4edd" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff6b6b" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ff6b6b" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis 
              dataKey="day" 
              stroke="#888" 
              fontSize={12}
              tick={{ fill: '#888' }}
            />
            <YAxis 
              stroke="#888" 
              fontSize={12}
              tick={{ fill: '#888' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(20, 20, 20, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#fff',
                backdropFilter: 'blur(10px)',
                fontSize: '12px',
                padding: '8px 12px'
              }}
              formatter={(value: number, name: string) => {
                const formattedValue = name === 'revenue' ? `$${value}` : value
                const color = name === 'views' ? '#00f5ff' : name === 'orders' ? '#9d4edd' : '#ff6b6b'
                return [
                  <span key={name} style={{ color }}>
                    {formattedValue}
                  </span>,
                  name.charAt(0).toUpperCase() + name.slice(1)
                ]
              }}
              labelFormatter={(label) => `Day: ${label}`}
            />
            <Area 
              type="monotone" 
              dataKey="views" 
              stroke="#00f5ff" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#viewsGradient)" 
              dot={{ fill: '#00f5ff', strokeWidth: 2, r: 3 }}
            />
            <Area 
              type="monotone" 
              dataKey="orders" 
              stroke="#9d4edd" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#ordersGradient)" 
              dot={{ fill: '#9d4edd', strokeWidth: 2, r: 3 }}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#ff6b6b" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#revenueGradient)" 
              dot={{ fill: '#ff6b6b', strokeWidth: 2, r: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <style jsx>{`
        .main-chart-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 24px;
          backdrop-filter: blur(10px);
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .chart-header h3 {
          color: #fff;
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0;
        }

        .chart-actions {
          display: flex;
          gap: 8px;
        }

        .time-filter {
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #888;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .time-filter.active {
          background: rgba(0, 245, 255, 0.1);
          color: #00f5ff;
          border-color: rgba(0, 245, 255, 0.3);
        }

        .time-filter:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .chart-container {
          flex: 1;
          min-height: 0;
        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .main-chart-card {
            padding: 16px;
            border-radius: 12px;
          }

          .chart-header {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
            margin-bottom: 16px;
          }

          .chart-header h3 {
            font-size: 1.1rem;
            text-align: center;
          }

          .chart-actions {
            justify-content: center;
          }

          .time-filter {
            padding: 8px 16px;
            font-size: 0.85rem;
            flex: 1;
            max-width: 80px;
          }

          /* Adjust chart for mobile */
          :global(.recharts-cartesian-grid-horizontal line),
          :global(.recharts-cartesian-grid-vertical line) {
            stroke: #444;
          }

          :global(.recharts-area) {
            stroke-width: 1.5px !important;
          }

          :global(.recharts-dot) {
            r: 2 !important;
          }

          :global(.recharts-tooltip-wrapper) {
            font-size: 11px !important;
          }
        }

        @media (max-width: 480px) {
          .main-chart-card {
            padding: 12px;
          }

          .chart-header h3 {
            font-size: 1rem;
          }

          .time-filter {
            padding: 6px 12px;
            font-size: 0.8rem;
            max-width: 70px;
          }

          :global(.recharts-x-axis .recharts-cartesian-axis-tick),
          :global(.recharts-y-axis .recharts-cartesian-axis-tick) {
            font-size: 10px !important;
          }
        }

        /* Very small screens */
        @media (max-width: 360px) {
          .main-chart-card {
            padding: 8px;
          }

          .chart-actions {
            gap: 4px;
          }

          .time-filter {
            padding: 4px 8px;
            font-size: 0.75rem;
            max-width: 60px;
          }
        }

        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
          .time-filter {
            padding: 10px 16px;
            min-height: 40px;
          }

          :global(.recharts-tooltip-wrapper) {
            font-size: 14px !important;
          }
        }

        /* High DPI screens */
        @media (min-resolution: 192dpi) {
          :global(.recharts-area) {
            stroke-width: 1.5px !important;
          }
        }

        /* Reduced motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .time-filter {
            transition: none;
          }
        }
      `}</style>
    </div>
  )
}