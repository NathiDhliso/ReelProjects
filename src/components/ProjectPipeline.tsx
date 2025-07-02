import React, { useState } from 'react';
import { 
  ChevronRight, 
  Clock, 
  Code, 
  CheckCircle, 
  Star,
  Briefcase,
  Calendar,
  GitBranch,
  Target,
  Award
} from 'lucide-react';
import { Project } from '../types';
import './ProjectPipeline.css';

interface ProjectPipelineProps {
  projects: Project[];
  onProjectMove: (projectId: string, newStage: string) => void;
  onProjectClick: (project: Project) => void;
}

interface PipelineStage {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
}

const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 'planning',
    name: 'Planning',
    icon: Target,
    color: '#6B7280',
    description: 'Define project scope and requirements'
  },
  {
    id: 'development',
    name: 'Development',
    icon: Code,
    color: '#3B82F6',
    description: 'Build and implement features'
  },
  {
    id: 'testing',
    name: 'Testing',
    icon: GitBranch,
    color: '#F59E0B',
    description: 'Test functionality and fix bugs'
  },
  {
    id: 'verification',
    name: 'Verification',
    icon: CheckCircle,
    color: '#8B5CF6',
    description: 'AI skill verification and review'
  },
  {
    id: 'completed',
    name: 'Completed',
    icon: Award,
    color: '#10B981',
    description: 'Project delivered and verified'
  }
];

const ProjectPipeline: React.FC<ProjectPipelineProps> = ({ 
  projects, 
  onProjectMove, 
  onProjectClick 
}) => {
  const [draggedProject, setDraggedProject] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);

  // Group projects by stage
  const projectsByStage = PIPELINE_STAGES.reduce((acc, stage) => {
    acc[stage.id] = projects.filter(project => {
      // Map project status to pipeline stages
      if (project.status === 'active') {
        // Check if project has verified skills
        const hasVerifiedSkills = project.skill_demonstrations?.some(s => s.verified);
        if (hasVerifiedSkills) return stage.id === 'verification';
        
        // Check if project has any evidence
        const hasEvidence = project.skill_demonstrations?.some(s => s.evidence_url);
        if (hasEvidence) return stage.id === 'testing';
        
        // Check if project has skills defined
        if (project.skill_demonstrations?.length > 0) return stage.id === 'development';
        
        return stage.id === 'planning';
      }
      
      if (project.status === 'completed') return stage.id === 'completed';
      
      // Default to planning
      return stage.id === 'planning';
    });
    return acc;
  }, {} as Record<string, Project[]>);

  const handleDragStart = (e: React.DragEvent, projectId: string) => {
    setDraggedProject(projectId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStage(stageId);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    if (draggedProject) {
      onProjectMove(draggedProject, stageId);
    }
    setDraggedProject(null);
    setDragOverStage(null);
  };

  const getProjectProgress = (project: Project): number => {
    if (!project.skill_demonstrations || project.skill_demonstrations.length === 0) return 0;
    
    const verifiedSkills = project.skill_demonstrations.filter(s => s.verified).length;
    const totalSkills = project.skill_demonstrations.length;
    
    return Math.round((verifiedSkills / totalSkills) * 100);
  };

  const getProjectDaysInStage = (project: Project): number => {
    const createdDate = new Date(project.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="project-pipeline">
      <div className="pipeline-header">
        <h2>Project Pipeline</h2>
        <p>Track your projects through professional development stages</p>
      </div>

      <div className="pipeline-container">
        {PIPELINE_STAGES.map((stage, index) => {
          const StageIcon = stage.icon;
          const projectsInStage = projectsByStage[stage.id] || [];
          
          return (
            <div
              key={stage.id}
              className={`pipeline-stage ${dragOverStage === stage.id ? 'drag-over' : ''}`}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div className="stage-header" style={{ borderColor: stage.color }}>
                <div className="stage-icon" style={{ backgroundColor: stage.color }}>
                  <StageIcon size={20} />
                </div>
                <div className="stage-info">
                  <h3>{stage.name}</h3>
                  <p>{stage.description}</p>
                </div>
                <div className="stage-count">
                  {projectsInStage.length}
                </div>
              </div>

              <div className="stage-projects">
                {projectsInStage.map(project => {
                  const progress = getProjectProgress(project);
                  const daysInStage = getProjectDaysInStage(project);
                  
                  return (
                    <div
                      key={project.id}
                      className="project-card"
                      draggable
                      onDragStart={(e) => handleDragStart(e, project.id)}
                      onClick={() => onProjectClick(project)}
                    >
                      <div className="project-card-header">
                        <h4>{project.name}</h4>
                        <div className="project-type-badge">
                          {project.type}
                        </div>
                      </div>

                      <p className="project-description">
                        {project.description.substring(0, 100)}...
                      </p>

                      <div className="project-meta">
                        <div className="meta-item">
                          <Briefcase size={12} />
                          <span>{project.target_skills.length} skills</span>
                        </div>
                        <div className="meta-item">
                          <Calendar size={12} />
                          <span>{daysInStage}d</span>
                        </div>
                      </div>

                      {project.skill_demonstrations && project.skill_demonstrations.length > 0 && (
                        <div className="project-progress">
                          <div className="progress-info">
                            <span>Progress</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{ 
                                width: `${progress}%`,
                                backgroundColor: stage.color
                              }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="project-badges">
                        {project.scale === 'enterprise' && (
                          <div className="badge enterprise">Enterprise</div>
                        )}
                        {project.impact === 'significant' && (
                          <div className="badge impact">High Impact</div>
                        )}
                        {progress === 100 && (
                          <div className="badge verified">
                            <CheckCircle size={12} />
                            Verified
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {projectsInStage.length === 0 && (
                  <div className="empty-stage">
                    <p>Drop projects here</p>
                  </div>
                )}
              </div>

              {index < PIPELINE_STAGES.length - 1 && (
                <div className="stage-arrow">
                  <ChevronRight size={24} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="pipeline-legend">
        <h3>Pipeline Stages Guide</h3>
        <div className="legend-items">
          {PIPELINE_STAGES.map(stage => {
            const StageIcon = stage.icon;
            return (
              <div key={stage.id} className="legend-item">
                <div className="legend-icon" style={{ backgroundColor: stage.color }}>
                  <StageIcon size={16} />
                </div>
                <div className="legend-text">
                  <strong>{stage.name}:</strong> {stage.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProjectPipeline; 