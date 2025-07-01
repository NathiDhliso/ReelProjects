export interface Project {
  id: string;
  name: string;
  description: string;
  goals?: string;
  target_skills: string[];
  analysis: any;
  plan: string[];
  skill_demonstrations: any[];
  status: string;
  created_at: string;
  type: string;
  scale?: 'small' | 'medium' | 'large' | 'enterprise';
  impact?: 'low' | 'medium' | 'high' | 'significant';
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