'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface RevenueData {
  week: string
  revenue: number
  profit: number
}

interface RevenueOverviewProps {
  data: RevenueData[]
}

export default function RevenueOverview({ data }: RevenueOverviewProps) {
  return (
    <div className="side-chart-card">
      <div className="chart-header">
        <h3>Revenue Overview</h3>
        <div className="chart-badge">Monthly</div>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart 
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          >
            <defs>
              <linearGradient id="barGradient1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f5ff" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#00f5ff" stopOpacity={0.3}/>
              </linearGradient>
              <linearGradient id="barGradient2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9d4edd" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#9d4edd" stopOpacity={0.3}/>
              </linearGradient>
              <linearGradient id="barGradient3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff6b6b" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ff6b6b" stopOpacity={0.3}/>
              </linearGradient>
              <linearGradient id="barGradient4" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ecdc4" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#4ecdc4" stopOpacity={0.3}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis 
              dataKey="week" 
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
              formatter={(value: number) => [
                <span key="value" style={{ color: '#00f5ff' }}>
                  ${value}
                </span>,
                'Revenue'
              ]}
              labelFormatter={(label) => `Week: ${label}`}
            />
            <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#barGradient${(index % 4) + 1})`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <style jsx>{`
        .side-chart-card {
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

        .chart-badge {
          padding: 4px 12px;
          background: rgba(255, 190, 11, 0.1);
          color: #ffbe0b;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          border: 1px solid rgba(255, 190, 11, 0.3);
        }

        .chart-container {
          flex: 1;
          min-height: 0;
        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .side-chart-card {
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

          .chart-badge {
            align-self: center;
            font-size: 0.75rem;
            padding: 3px 10px;
          }

          /* Adjust chart for mobile */
          :global(.recharts-cartesian-grid-horizontal line),
          :global(.recharts-cartesian-grid-vertical line) {
            stroke: #444;
          }

          :global(.recharts-bar-rectangle) {
            stroke-width: 1px;
          }

          :global(.recharts-tooltip-wrapper) {
            font-size: 11px !important;
          }
        }

        @media (max-width: 480px) {
          .side-chart-card {
            padding: 12px;
          }

          .chart-header h3 {
            font-size: 1rem;
          }

          .chart-badge {
            font-size: 0.7rem;
            padding: 2px 8px;
          }

          :global(.recharts-x-axis .recharts-cartesian-axis-tick),
          :global(.recharts-y-axis .recharts-cartesian-axis-tick) {
            font-size: 10px !important;
          }
        }

        /* Very small screens */
        @media (max-width: 360px) {
          .side-chart-card {
            padding: 8px;
          }

          .chart-header {
            gap: 8px;
          }

          .chart-badge {
            font-size: 0.65rem;
            padding: 2px 6px;
          }
        }

        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
          :global(.recharts-tooltip-wrapper) {
            font-size: 14px !important;
          }
        }

        /* High DPI screens */
        @media (min-resolution: 192dpi) {
          :global(.recharts-bar-rectangle) {
            stroke-width: 0.5px !important;
          }
        }

        /* Reduced motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          /* No animations to reduce */
        }
      `}</style>
    </div>
  )
}