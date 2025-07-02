// Import the generated Supabase types
import { Tables, TablesInsert, TablesUpdate } from './types/supabase';

// Use the database types as the base
export type DatabaseProject = Tables<'projects'>;
export type DatabaseProjectInsert = TablesInsert<'projects'>;
export type DatabaseProjectUpdate = TablesUpdate<'projects'>;

// Extended Project interface that includes both database fields and additional app fields
export interface Project {
  // All database fields from DatabaseProject (except profile_id which we handle separately)
  id: string;
  created_at: string | null;
  description: string;
  end_date: string | null;
  featured: boolean | null;
  github_url: string | null;
  impact: string | null;
  live_url: string | null;
  media_urls: string[] | null;
  role: string;
  start_date: string;
  technologies: string[];
  title: string;
  updated_at: string | null;
  
  // Map database fields to more user-friendly names
  name: string; // Maps to database 'title'
  goals?: string; // Maps to database 'role'
  target_skills: string[]; // Maps to database 'technologies'
  
  // Additional fields for the app (not stored in database)
  pipeline_stage: 'planning' | 'development' | 'testing' | 'verification' | 'completed';
  analysis?: any;
  plan?: string[];
  skill_demonstrations?: ProjectSkill[];
  status: 'active' | 'completed' | 'paused';
  type: string;
  scale?: 'small' | 'medium' | 'large' | 'enterprise';
  projectImpact?: 'low' | 'medium' | 'high' | 'significant'; // Renamed to avoid conflict with db 'impact'
  externalValidations?: Array<{
    type: 'client_testimonial' | 'user_metrics' | 'open_source' | 'award';
    description: string;
    verified: boolean;
  }>;
  liveDemo?: {
    url: string;
    type: 'video_walkthrough' | 'public_presentation' | 'live_deployment';
  };
}

// Helper function to convert database project to app project
export const dbProjectToProject = (dbProject: DatabaseProject): Project => ({
  // Database fields
  id: dbProject.id,
  created_at: dbProject.created_at,
  description: dbProject.description,
  end_date: dbProject.end_date,
  featured: dbProject.featured,
  github_url: dbProject.github_url,
  impact: dbProject.impact,
  live_url: dbProject.live_url,
  media_urls: dbProject.media_urls,
  role: dbProject.role,
  start_date: dbProject.start_date,
  technologies: dbProject.technologies,
  title: dbProject.title,
  updated_at: dbProject.updated_at,
  
  // Map database fields to app fields
  name: dbProject.title,
  goals: dbProject.role,
  target_skills: dbProject.technologies || [],
  projectImpact: (dbProject.impact as 'low' | 'medium' | 'high' | 'significant') || 'medium',
  
  // Default values for app-specific fields
  pipeline_stage: 'planning', // Default to planning stage
  status: 'active',
  type: 'Professional Project', // Default type
  analysis: {},
  plan: [],
  skill_demonstrations: [],
  scale: 'medium'
});

// Helper function to convert app project to database insert
export function projectToDbInsert(project: Partial<Project>, profileId: string): DatabaseProjectInsert {
  return {
    profile_id: profileId,
    title: project.name || 'Untitled Project',
    description: project.description || '',
    role: project.goals || '',
    technologies: project.target_skills || [],
    impact: project.projectImpact || project.impact || null,
    start_date: new Date().toISOString(),
    featured: false,
    github_url: null,
    live_url: null,
    media_urls: null,
    end_date: null
  };
}

export interface ProjectSkill {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'language' | 'certification';
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'master';
  demonstrationMethod: 'code' | 'video' | 'documentation' | 'presentation' | 'live-demo';
  requirements: string;
  aiPrompt?: string;
  status?: 'planned' | 'in-progress' | 'completed' | 'verified';
  evidence_url?: string | null;
  verified?: boolean;
  rating?: number | null;
  verification_feedback?: string;
}

export interface ScopeAnalysis {
  clarity_score: number;
  feasibility_score: number;
  identified_risks: string[];
  suggested_technologies: string[];
  detected_skills: ProjectSkill[];
  skill_mapping: {
    skill: string;
    demonstration_method: string;
    complexity_level: number;
    verification_criteria: string[];
  }[];
}

// ReelPass Scoring System Types
export interface ReelPassScore {
  totalScore: number; // Out of 1000
  level: 'aspiring' | 'emerging' | 'competent' | 'skilled' | 'expert';
  levelName: string;
  components: {
    reelProjects: ReelProjectsScore;
    reelPersona: ReelPersonaScore;
    foundationalKnowledge: FoundationalKnowledgeScore;
    experienceDiversity: ExperienceDiversityScore;
    continuousLearning: ContinuousLearningScore;
  };
  lastUpdated: string;
}

export interface ReelProjectsScore {
  totalScore: number; // Out of 500
  breakdown: {
    skillDemonstration: number; // Out of 300
    projectImpact: number; // Out of 100
    verificationBonus: number; // Out of 100
  };
  details: {
    demonstratedSkills: Array<{
      skillName: string;
      points: number; // Up to 50 per skill
      verified: boolean;
    }>;
    projectScale: 'small' | 'medium' | 'large' | 'enterprise';
    projectImpact: 'low' | 'medium' | 'high' | 'significant';
    externalValidations: number;
    liveDemo: boolean;
  };
}

export interface ReelPersonaScore {
  totalScore: number; // Out of 200
  breakdown: {
    behavioralAssessment: number; // Out of 100
    peerFeedback: number; // Out of 100
  };
  details: {
    personalityTraits: {
      openness: number;
      conscientiousness: number;
      extraversion: number;
      agreeableness: number;
      neuroticism: number;
    };
    workTraits: {
      collaboration: number;
      leadership: number;
      resilience: number;
      proactivity: number;
    };
    feedbackCount: number;
    managerialFeedback: boolean;
  };
}

export interface FoundationalKnowledgeScore {
  totalScore: number; // Out of 150
  breakdown: {
    certifications: number; // Out of 75
    academicDegrees: number; // Out of 75
  };
  details: {
    certifications: Array<{
      name: string;
      points: number;
      verified: boolean;
    }>;
    degrees: Array<{
      level: 'bachelors' | 'masters' | 'phd';
      field: string;
      institution: string;
      points: number;
    }>;
  };
}

export interface ExperienceDiversityScore {
  totalScore: number; // Out of 100
  breakdown: {
    yearsOfExperience: number; // Out of 50
    skillDiversity: number; // Out of 50
  };
  details: {
    totalYears: number;
    skillCategories: string[];
    uniqueSkillCount: number;
  };
}

export interface ContinuousLearningScore {
  totalScore: number; // Out of 50
  breakdown: {
    learningActivity: number; // Out of 25
    platformEngagement: number; // Out of 25
  };
  details: {
    coursesCompleted: number;
    workshopsAttended: number;
    profileCompleteness: number;
    communityParticipation: boolean;
    lastActivityDate: string;
  };
}