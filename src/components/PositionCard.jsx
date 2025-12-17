import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './PositionCard.css';

const PositionCard = ({ position }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const formatNumber = (num) => {
    // Convertir en nombre si c'est une string
    const value = typeof num === 'string' ? parseFloat(num) : num;
    
    if (!value || value === 0 || isNaN(value)) return '0';
    if (value < 0.01) return value.toFixed(6);
    if (value < 1) return value.toFixed(4);
    if (value < 1000) return value.toFixed(2);
    if (value < 1000000) return `${(value / 1000).toFixed(2)}K`;
    return `${(value / 1000000).toFixed(2)}M`;
  };

  const formatPercent = (percent) => {
    // Convertir en nombre si c'est une string
    const value = typeof percent === 'string' ? parseFloat(percent) : percent;
    
    if (value === null || value === undefined || isNaN(value)) return 'N/A';
    const formatted = Math.abs(value).toFixed(2);
    const sign = value >= 0 ? '+' : '-';
    return `${sign}${formatted}%`;
  };

  const getChangeClass = (percent) => {
    // Convertir en nombre si c'est une string
    const value = typeof percent === 'string' ? parseFloat(percent) : percent;
    
    if (value === null || value === undefined || isNaN(value)) return 'neutral';
    if (value > 0) return 'positive';
    if (value < 0) return 'negative';
    return 'neutral';
  };

  const handleClick = () => {
    if (position.entity_type === 'atom' && position.term_id) {
      // Naviguer vers la page de détail de l'atom
      navigate(`/atom/${position.term_id}`);
    }
  };

  const renderLabel = () => {
    if (position.entity_type === 'atom') {
      return (
        <div className="position-label-content">
          {position.image && (
            <img 
              src={position.image} 
              alt={position.label} 
              className="position-image"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          )}
          {position.emoji && <span className="position-emoji">{position.emoji}</span>}
          <span className="position-name">{position.label || position.description || t('position.unnamed')}</span>
        </div>
      );
    } else {
      // Triple
      return (
        <div className="position-label-content triple">
          <div className="triple-part">
            {position.subject_image && (
              <img 
                src={position.subject_image} 
                alt={position.subject_label} 
                className="position-image-small"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
            <span className="triple-text">{position.subject_label}</span>
          </div>
          <span className="triple-separator">—</span>
          <div className="triple-part">
            <span className="triple-text predicate">{position.predicate_label}</span>
          </div>
          <span className="triple-separator">—</span>
          <div className="triple-part">
            {position.object_image && (
              <img 
                src={position.object_image} 
                alt={position.object_label} 
                className="position-image-small"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
            <span className="triple-text">{position.object_label}</span>
          </div>
        </div>
      );
    }
  };

  return (
    <div 
      className={`position-card ${position.entity_type === 'atom' ? 'clickable' : ''}`}
      onClick={position.entity_type === 'atom' ? handleClick : undefined}
    >
      <div className="position-header">
        <div className="position-type-badge">
          {position.entity_type === 'atom' ? `⚛️ ${t('position.typeAtom')}` : `🔗 ${t('position.typeTriple')}`}
        </div>
        <div className="position-label">
          {renderLabel()}
        </div>
      </div>

      <div className="position-metrics">
        <div className="position-metric">
          <span className="metric-label">{t('position.shares')}</span>
          <span className="metric-value">{formatNumber(position.shares)}</span>
        </div>

        <div className="position-metric">
          <span className="metric-label">{t('position.currentPrice')}</span>
          <span className="metric-value">{formatNumber(position.current_share_price)} TRUST</span>
        </div>

        {position.entry_price && (
          <div className="position-metric">
            <span className="metric-label">{t('position.entryPrice')}</span>
            <span className="metric-value">{formatNumber(position.entry_price)} TRUST</span>
          </div>
        )}

        <div className="position-metric highlight">
          <span className="metric-label">{t('position.estimatedValue')}</span>
          <span className="metric-value large">{formatNumber(position.value)} TRUST</span>
        </div>

        {position.total_cost && (
          <div className="position-metric">
            <span className="metric-label">{t('position.totalCost')}</span>
            <span className="metric-value">{formatNumber(position.total_cost)} TRUST</span>
          </div>
        )}
      </div>

      <div className="position-performance">
        {/* P&L Personnel - PRIORITAIRE */}
        {position.pnl_percent !== undefined && position.pnl_percent !== null && (
          <div className={`performance-badge pnl-badge ${getChangeClass(position.pnl_percent)}`}>
            <span className="performance-label">{t('position.pnl')}:</span>
            <span className="performance-value">
              {formatPercent(position.pnl_percent)}
              {position.pnl_amount && (
                <span className="pnl-amount">
                  {' '}({position.pnl_amount > 0 ? '+' : ''}{formatNumber(position.pnl_amount)} TRUST)
                </span>
              )}
            </span>
          </div>
        )}

        {/* Croissance globale de l'atom */}
        {(position.growth_24h_percent !== undefined || position.growth_7d_percent !== undefined) && (
          <>
            {position.growth_24h_percent !== undefined && (
              <div className={`performance-badge ${getChangeClass(position.growth_24h_percent)}`}>
                <span className="performance-label">{t('position.growth24h')}:</span>
                <span className="performance-value">{formatPercent(position.growth_24h_percent)}</span>
              </div>
            )}

            {position.growth_7d_percent !== undefined && (
              <div className={`performance-badge ${getChangeClass(position.growth_7d_percent)}`}>
                <span className="performance-label">{t('position.growth7d')}:</span>
                <span className="performance-value">{formatPercent(position.growth_7d_percent)}</span>
              </div>
            )}
          </>
        )}
      </div>

      <div className="position-disclaimer">
        {t('position.disclaimer')}{' '}
        <a href="https://portal.intuition.systems" target="_blank" rel="noopener noreferrer">
          {t('position.officialPortal')}
        </a>.
      </div>
    </div>
  );
};

export default PositionCard;
