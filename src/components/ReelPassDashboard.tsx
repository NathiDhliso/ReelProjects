import React from 'react';
import { 
  Trophy, 
  Target, 
  Brain, 
  BookOpen, 
  Briefcase, 
  TrendingUp,
  Star,
  Award,
  ChevronRight,
  Info
} from 'lucide-react';
import { ReelPassScore } from '../types';
import './ReelPassDashboard.css';

interface ReelPassDashboardProps {
  score: ReelPassScore;
  onViewDetails?: (component: string) => void;
}

const ReelPassDashboard: React.FC<ReelPassDashboardProps> = ({ score, onViewDetails }) => {
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

  const getProgressPercentage = (current: number, max: number) => {
    return Math.min(100, (current / max) * 100);
  };

  const formatScore = (score: number, max: number) => {
    return `${score}/${max}`;
  };

  return (
    <div className="reelpass-dashboard">
      {/* Header Section */}
      <div className="reelpass-header">
        <div className="score-summary">
          <div className="total-score-section">
            <div className="score-circle" style={{ borderColor: getScoreColor(score.level) }}>
              <div className="score-content">
                <h1 className="score-number">{score.totalScore}</h1>
                <span className="score-max">/ 1000</span>
              </div>
            </div>
            <div className="score-info">
              <h2 className="level-name" style={{ color: getScoreColor(score.level) }}>
                {score.levelName}
              </h2>
              <div className="level-badge" style={{ backgroundColor: getScoreColor(score.level) }}>
                <Trophy size={16} />
                <span>{score.level.toUpperCase()}</span>
              </div>
            </div>
          </div>
          
          <div className="score-breakdown-preview">
            <h3>Score Distribution</h3>
            <div className="mini-chart">
              {/* Mini visualization of score components */}
              <div className="chart-bar" style={{ 
                height: `${getProgressPercentage(score.components.reelProjects.totalScore, 500)}%`,
                backgroundColor: '#3B82F6' 
              }} />
              <div className="chart-bar" style={{ 
                height: `${getProgressPercentage(score.components.reelPersona.totalScore, 200)}%`,
                backgroundColor: '#8B5CF6' 
              }} />
              <div className="chart-bar" style={{ 
                height: `${getProgressPercentage(score.components.foundationalKnowledge.totalScore, 150)}%`,
                backgroundColor: '#F59E0B' 
              }} />
              <div className="chart-bar" style={{ 
                height: `${getProgressPercentage(score.components.experienceDiversity.totalScore, 100)}%`,
                backgroundColor: '#10B981' 
              }} />
              <div className="chart-bar" style={{ 
                height: `${getProgressPercentage(score.components.continuousLearning.totalScore, 50)}%`,
                backgroundColor: '#EC4899' 
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Component Cards */}
      <div className="components-grid">
        {/* ReelProjects Component */}
        <div className="component-card">
          <div className="component-header">
            <div className="component-icon" style={{ backgroundColor: '#3B82F6' }}>
              <Target size={24} />
            </div>
            <div className="component-title">
              <h3>ReelProjects</h3>
              <span className="component-weight">50% of total</span>
            </div>
          </div>
          
          <div className="component-score">
            <span className="score-value">{score.components.reelProjects.totalScore}</span>
            <span className="score-max">/ 500 points</span>
          </div>
          
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${getProgressPercentage(score.components.reelProjects.totalScore, 500)}%`,
                backgroundColor: '#3B82F6'
              }}
            />
          </div>
          
          <div className="component-breakdown">
            <div className="breakdown-item">
              <span>Skill Demonstration</span>
              <span>{formatScore(score.components.reelProjects.breakdown.skillDemonstration, 300)}</span>
            </div>
            <div className="breakdown-item">
              <span>Project Impact</span>
              <span>{formatScore(score.components.reelProjects.breakdown.projectImpact, 100)}</span>
            </div>
            <div className="breakdown-item">
              <span>Verification Bonus</span>
              <span>{formatScore(score.components.reelProjects.breakdown.verificationBonus, 100)}</span>
            </div>
          </div>
          
          <button 
            className="view-details-btn"
            onClick={() => onViewDetails?.('reelProjects')}
          >
            View Details <ChevronRight size={16} />
          </button>
        </div>

        {/* ReelPersona Component */}
        <div className="component-card">
          <div className="component-header">
            <div className="component-icon" style={{ backgroundColor: '#8B5CF6' }}>
              <Brain size={24} />
            </div>
            <div className="component-title">
              <h3>ReelPersona</h3>
              <span className="component-weight">20% of total</span>
            </div>
          </div>
          
          <div className="component-score">
            <span className="score-value">{score.components.reelPersona.totalScore}</span>
            <span className="score-max">/ 200 points</span>
          </div>
          
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${getProgressPercentage(score.components.reelPersona.totalScore, 200)}%`,
                backgroundColor: '#8B5CF6'
              }}
            />
          </div>
          
          <div className="component-breakdown">
            <div className="breakdown-item">
              <span>Behavioral Assessment</span>
              <span>{formatScore(score.components.reelPersona.breakdown.behavioralAssessment, 100)}</span>
            </div>
            <div className="breakdown-item">
              <span>Peer Feedback</span>
              <span>{formatScore(score.components.reelPersona.breakdown.peerFeedback, 100)}</span>
            </div>
          </div>
          
          <div className="component-note">
            <Info size={14} />
            <span>Complete personality assessment to improve score</span>
          </div>
          
          <button 
            className="view-details-btn"
            onClick={() => onViewDetails?.('reelPersona')}
          >
            Take Assessment <ChevronRight size={16} />
          </button>
        </div>

        {/* Foundational Knowledge Component */}
        <div className="component-card">
          <div className="component-header">
            <div className="component-icon" style={{ backgroundColor: '#F59E0B' }}>
              <BookOpen size={24} />
            </div>
            <div className="component-title">
              <h3>Foundational Knowledge</h3>
              <span className="component-weight">15% of total</span>
            </div>
          </div>
          
          <div className="component-score">
            <span className="score-value">{score.components.foundationalKnowledge.totalScore}</span>
            <span className="score-max">/ 150 points</span>
          </div>
          
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${getProgressPercentage(score.components.foundationalKnowledge.totalScore, 150)}%`,
                backgroundColor: '#F59E0B'
              }}
            />
          </div>
          
          <div className="component-breakdown">
            <div className="breakdown-item">
              <span>Certifications</span>
              <span>{formatScore(score.components.foundationalKnowledge.breakdown.certifications, 75)}</span>
            </div>
            <div className="breakdown-item">
              <span>Academic Degrees</span>
              <span>{formatScore(score.components.foundationalKnowledge.breakdown.academicDegrees, 75)}</span>
            </div>
          </div>
          
          <button 
            className="view-details-btn"
            onClick={() => onViewDetails?.('foundationalKnowledge')}
          >
            Add Credentials <ChevronRight size={16} />
          </button>
        </div>

        {/* Experience & Diversity Component */}
        <div className="component-card">
          <div className="component-header">
            <div className="component-icon" style={{ backgroundColor: '#10B981' }}>
              <Briefcase size={24} />
            </div>
            <div className="component-title">
              <h3>Experience & Diversity</h3>
              <span className="component-weight">10% of total</span>
            </div>
          </div>
          
          <div className="component-score">
            <span className="score-value">{score.components.experienceDiversity.totalScore}</span>
            <span className="score-max">/ 100 points</span>
          </div>
          
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${getProgressPercentage(score.components.experienceDiversity.totalScore, 100)}%`,
                backgroundColor: '#10B981'
              }}
            />
          </div>
          
          <div className="component-breakdown">
            <div className="breakdown-item">
              <span>Years of Experience</span>
              <span>{formatScore(score.components.experienceDiversity.breakdown.yearsOfExperience, 50)}</span>
            </div>
            <div className="breakdown-item">
              <span>Skill Diversity</span>
              <span>{formatScore(score.components.experienceDiversity.breakdown.skillDiversity, 50)}</span>
            </div>
          </div>
          
          <div className="skill-categories">
            {score.components.experienceDiversity.details.skillCategories.map((category, index) => (
              <span key={index} className="category-tag">{category}</span>
            ))}
          </div>
          
          <button 
            className="view-details-btn"
            onClick={() => onViewDetails?.('experienceDiversity')}
          >
            Update Experience <ChevronRight size={16} />
          </button>
        </div>

        {/* Continuous Learning Component */}
        <div className="component-card">
          <div className="component-header">
            <div className="component-icon" style={{ backgroundColor: '#EC4899' }}>
              <TrendingUp size={24} />
            </div>
            <div className="component-title">
              <h3>Continuous Learning</h3>
              <span className="component-weight">5% of total</span>
            </div>
          </div>
          
          <div className="component-score">
            <span className="score-value">{score.components.continuousLearning.totalScore}</span>
            <span className="score-max">/ 50 points</span>
          </div>
          
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${getProgressPercentage(score.components.continuousLearning.totalScore, 50)}%`,
                backgroundColor: '#EC4899'
              }}
            />
          </div>
          
          <div className="component-breakdown">
            <div className="breakdown-item">
              <span>Learning Activity</span>
              <span>{formatScore(score.components.continuousLearning.breakdown.learningActivity, 25)}</span>
            </div>
            <div className="breakdown-item">
              <span>Platform Engagement</span>
              <span>{formatScore(score.components.continuousLearning.breakdown.platformEngagement, 25)}</span>
            </div>
          </div>
          
          <button 
            className="view-details-btn"
            onClick={() => onViewDetails?.('continuousLearning')}
          >
            Track Learning <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Score Improvement Tips */}
      <div className="improvement-section">
        <h3>
          <Award size={20} />
          Quick Ways to Improve Your Score
        </h3>
        <div className="tips-grid">
          {score.totalScore < 200 && (
            <div className="tip-card">
              <Star size={16} />
              <span>Complete your first project with verified skills to earn up to 300 points!</span>
            </div>
          )}
          {score.components.reelPersona.totalScore < 50 && (
            <div className="tip-card">
              <Star size={16} />
              <span>Take the personality assessment to unlock up to 100 points</span>
            </div>
          )}
          {score.components.foundationalKnowledge.details.certifications.length < 3 && (
            <div className="tip-card">
              <Star size={16} />
              <span>Add relevant certifications for 10 points each</span>
            </div>
          )}
          {!score.components.reelProjects.details.liveDemo && (
            <div className="tip-card">
              <Star size={16} />
              <span>Add a live demo to your project for 50 bonus points</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReelPassDashboard; 