import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import './AtomChart.css';

const AtomChart = ({ data, title = "Historique des 7 derniers jours" }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-empty">
        <p>Aucune donnée historique disponible</p>
      </div>
    );
  }

  // Formater les données pour Recharts
  const chartData = data.map(item => ({
    date: new Date(item.timestamp).toLocaleDateString('fr-FR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit'
    }),
    signal: parseFloat(item.signal_value),
    prix: parseFloat(item.share_price)
  }));

  // Tooltip personnalisé
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-date">{payload[0].payload.date}</p>
          <p className="tooltip-signal">
            Signal: <span>{payload[0].value.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}</span>
          </p>
          <p className="tooltip-price">
            Prix: <span>{payload[1].value.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="atom-chart">
      <h3 className="chart-title">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis 
            dataKey="date" 
            stroke="var(--text-muted)"
            style={{ fontSize: '0.8rem' }}
          />
          <YAxis 
            yAxisId="left"
            stroke="var(--accent-blue)"
            style={{ fontSize: '0.8rem' }}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right"
            stroke="var(--accent-purple)"
            style={{ fontSize: '0.8rem' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="signal"
            stroke="var(--accent-blue)"
            strokeWidth={2}
            dot={{ fill: 'var(--accent-blue)', r: 3 }}
            activeDot={{ r: 5 }}
            name="Signal Value"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="prix"
            stroke="var(--accent-purple)"
            strokeWidth={2}
            dot={{ fill: 'var(--accent-purple)', r: 3 }}
            activeDot={{ r: 5 }}
            name="Share Price"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AtomChart;


