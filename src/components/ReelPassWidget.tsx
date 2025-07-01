import React from 'react';
import { Trophy, TrendingUp } from 'lucide-react';
import { ReelPassScore } from '../types';
import './ReelPassWidget.css';

interface ReelPassWidgetProps {
  score?: ReelPassScore;
  onClick?: () => void;
}

const ReelPassWidget: React.FC<ReelPassWidgetProps> = ({ score, onClick }) => {
  const getScoreColor = (level: string) => {
    switch (level) {
      case 'expert': return '#10B981';
      case 'skilled': return '#3B82F6';
      case 'competent': return '#8B5CF6';
      case 'emerging': return '#F59E0B';
      case 'aspiring': return '#6B7280';
      default: return '#6B7280';
    }
  };

  if (!score) {
    return (
      <div className="reelpass-widget" onClick={onClick}>
        <div className="widget-header">
          <Trophy size={20} />
          <span>ReelPass Score</span>
        </div>
        <div className="widget-content">
          <div className="score-placeholder">
            <span className="placeholder-text">Calculate your score</span>
          </div>
          <TrendingUp size={16} className="trend-icon" />
        </div>
      </div>
    );
  }

  return (
    <div className="reelpass-widget" onClick={onClick}>
      <div className="widget-header">
        <Trophy size={20} style={{ color: getScoreColor(score.level) }} />
        <span>ReelPass Score</span>
      </div>
      <div className="widget-content">
        <div className="score-display">
          <span className="score-value" style={{ color: getScoreColor(score.level) }}>
            {score.totalScore}
          </span>
          <span className="score-max">/ 1000</span>
        </div>
        <div className="level-info">
          <span className="level-label">{score.level.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
};

export default ReelPassWidget; 