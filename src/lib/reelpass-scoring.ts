import { 
  Project, 
  ProjectSkill, 
  ReelPassScore, 
  ReelProjectsScore,
  ReelPersonaScore,
  FoundationalKnowledgeScore,
  ExperienceDiversityScore,
  ContinuousLearningScore
} from '../types';

// Score level thresholds
const SCORE_LEVELS = {
  aspiring: { min: 0, max: 199, name: 'Aspiring Professional' },
  emerging: { min: 200, max: 399, name: 'Emerging Professional' },
  competent: { min: 400, max: 599, name: 'Competent Professional' },
  skilled: { min: 600, max: 799, name: 'Skilled Professional' },
  expert: { min: 800, max: 1000, name: 'Expert Professional' }
};

// Calculate ReelProjects Score (up to 500 points)
export function calculateReelProjectsScore(projects: Project[]): ReelProjectsScore {
  let skillDemonstration = 0;
  let projectImpact = 0;
  let verificationBonus = 0;
  
  const demonstratedSkills: Array<{skillName: string; points: number; verified: boolean}> = [];
  let highestScale: 'small' | 'medium' | 'large' | 'enterprise' = 'small';
  let highestImpact: 'low' | 'medium' | 'high' | 'significant' = 'low';
  let totalExternalValidations = 0;
  let hasLiveDemo = false;

  // Process each project
  projects.forEach(project => {
    // Skill Demonstration Points (up to 300)
    if (project.skill_demonstrations) {
      project.skill_demonstrations.forEach((skill: ProjectSkill) => {
        // Only count verified skills
        if (skill.verified && skill.rating) {
          const skillPoints = Math.min(50, skill.rating * 10); // Max 50 points per skill
          
          // Check if skill already counted (avoid duplicates)
          const existingSkill = demonstratedSkills.find(s => s.skillName === skill.name);
          if (!existingSkill) {
            demonstratedSkills.push({
              skillName: skill.name,
              points: skillPoints,
              verified: true
            });
          }
        }
      });
    }

    // Update highest scale and impact
    if (project.scale) {
      const scaleOrder = ['small', 'medium', 'large', 'enterprise'];
      if (scaleOrder.indexOf(project.scale) > scaleOrder.indexOf(highestScale)) {
        highestScale = project.scale;
      }
    }
    
    if (project.impact) {
      const impactOrder = ['low', 'medium', 'high', 'significant'];
      if (impactOrder.indexOf(project.impact) > impactOrder.indexOf(highestImpact)) {
        highestImpact = project.impact;
      }
    }

    // Count external validations
    if (project.externalValidations) {
      totalExternalValidations += project.externalValidations.filter(v => v.verified).length;
    }

    // Check for live demo
    if (project.liveDemo) {
      hasLiveDemo = true;
    }
  });

  // Calculate skill demonstration score (cap at 6 skills, max 300 points)
  const topSkills = demonstratedSkills
    .sort((a, b) => b.points - a.points)
    .slice(0, 6);
  
  skillDemonstration = topSkills.reduce((sum, skill) => sum + skill.points, 0);

  // Calculate project impact & complexity score (up to 100 points)
  const scalePoints = {
    small: 10,
    medium: 20,
    large: 30,
    enterprise: 40
  };
  
  const impactPoints = {
    low: 10,
    medium: 20,
    high: 30,
    significant: 40
  };

  projectImpact = (scalePoints[highestScale] || 0) + (impactPoints[highestImpact] || 0);

  // Calculate verification bonus (up to 100 points)
  verificationBonus += Math.min(50, totalExternalValidations * 25); // 25 points per validation, max 50
  if (hasLiveDemo) {
    verificationBonus += 50; // 50 points for live demo
  }

  const totalScore = Math.min(500, skillDemonstration + projectImpact + verificationBonus);

  return {
    totalScore,
    breakdown: {
      skillDemonstration,
      projectImpact,
      verificationBonus
    },
    details: {
      demonstratedSkills: topSkills,
      projectScale: highestScale,
      projectImpact: highestImpact,
      externalValidations: totalExternalValidations,
      liveDemo: hasLiveDemo
    }
  };
}

// Calculate ReelPersona Score (up to 200 points)
export function calculateReelPersonaScore(personaData?: any): ReelPersonaScore {
  // Default/placeholder implementation - would need actual persona data
  const behavioralAssessment = personaData?.behavioralScore || 0;
  const peerFeedback = personaData?.feedbackScore || 0;

  return {
    totalScore: behavioralAssessment + peerFeedback,
    breakdown: {
      behavioralAssessment,
      peerFeedback
    },
    details: {
      personalityTraits: {
        openness: personaData?.traits?.openness || 0,
        conscientiousness: personaData?.traits?.conscientiousness || 0,
        extraversion: personaData?.traits?.extraversion || 0,
        agreeableness: personaData?.traits?.agreeableness || 0,
        neuroticism: personaData?.traits?.neuroticism || 0
      },
      workTraits: {
        collaboration: personaData?.workTraits?.collaboration || 0,
        leadership: personaData?.workTraits?.leadership || 0,
        resilience: personaData?.workTraits?.resilience || 0,
        proactivity: personaData?.workTraits?.proactivity || 0
      },
      feedbackCount: personaData?.feedbackCount || 0,
      managerialFeedback: personaData?.hasManagerialFeedback || false
    }
  };
}

// Calculate Foundational Knowledge Score (up to 150 points)
export function calculateFoundationalKnowledgeScore(credentials?: any): FoundationalKnowledgeScore {
  let certificationScore = 0;
  let degreeScore = 0;
  
  const certifications: Array<{name: string; points: number; verified: boolean}> = [];
  const degrees: Array<{level: 'bachelors' | 'masters' | 'phd'; field: string; institution: string; points: number}> = [];

  if (credentials?.certifications) {
    credentials.certifications.forEach((cert: any) => {
      const points = 10; // 10 points per certification
      certificationScore += points;
      certifications.push({
        name: cert.name,
        points,
        verified: cert.verified || false
      });
    });
  }

  if (credentials?.degrees) {
    credentials.degrees.forEach((degree: any) => {
      let points = 0;
      switch (degree.level) {
        case 'bachelors':
          points = 25;
          break;
        case 'masters':
          points = 35;
          break;
        case 'phd':
          points = 40;
          break;
      }
      
      // Bonus for reputable institutions
      if (degree.isReputable) {
        points += 10;
      }
      
      degreeScore += points;
      degrees.push({
        level: degree.level,
        field: degree.field,
        institution: degree.institution,
        points
      });
    });
  }

  // Cap scores at maximums
  certificationScore = Math.min(75, certificationScore);
  degreeScore = Math.min(75, degreeScore);

  return {
    totalScore: certificationScore + degreeScore,
    breakdown: {
      certifications: certificationScore,
      academicDegrees: degreeScore
    },
    details: {
      certifications,
      degrees
    }
  };
}

// Calculate Experience & Diversity Score (up to 100 points)
export function calculateExperienceDiversityScore(experience?: any, projects?: Project[]): ExperienceDiversityScore {
  let yearsScore = 0;
  let diversityScore = 0;
  
  const totalYears = experience?.years || 0;
  const skillCategories: string[] = [];
  
  // Years of experience (5 points per year, max 50)
  yearsScore = Math.min(50, totalYears * 5);
  
  // Collect unique skill categories from projects
  if (projects) {
    projects.forEach(project => {
      if (project.skill_demonstrations) {
        project.skill_demonstrations.forEach((skill: ProjectSkill) => {
          if (!skillCategories.includes(skill.category)) {
            skillCategories.push(skill.category);
          }
        });
      }
    });
  }
  
  // Diversity score (10 points per category, max 50)
  diversityScore = Math.min(50, skillCategories.length * 10);

  return {
    totalScore: yearsScore + diversityScore,
    breakdown: {
      yearsOfExperience: yearsScore,
      skillDiversity: diversityScore
    },
    details: {
      totalYears,
      skillCategories,
      uniqueSkillCount: skillCategories.length
    }
  };
}

// Calculate Continuous Learning Score (up to 50 points)
export function calculateContinuousLearningScore(learningData?: any): ContinuousLearningScore {
  let learningActivity = 0;
  let platformEngagement = 0;
  
  if (learningData) {
    // Learning activity (5 points per course, 10 per workshop)
    learningActivity += Math.min(15, (learningData.coursesCompleted || 0) * 5);
    learningActivity += Math.min(10, (learningData.workshopsAttended || 0) * 10);
    
    // Platform engagement
    if (learningData.profileComplete) platformEngagement += 5;
    if (learningData.verificationSteps > 2) platformEngagement += 5;
    if (learningData.communityParticipation) platformEngagement += 5;
    if (learningData.regularUpdates) platformEngagement += 5;
    if (learningData.portfolioUpdates) platformEngagement += 5;
  }

  return {
    totalScore: learningActivity + platformEngagement,
    breakdown: {
      learningActivity,
      platformEngagement
    },
    details: {
      coursesCompleted: learningData?.coursesCompleted || 0,
      workshopsAttended: learningData?.workshopsAttended || 0,
      profileCompleteness: learningData?.profileCompleteness || 0,
      communityParticipation: learningData?.communityParticipation || false,
      lastActivityDate: learningData?.lastActivityDate || new Date().toISOString()
    }
  };
}

// Calculate overall ReelPass Score
export function calculateReelPassScore(
  projects: Project[],
  personaData?: any,
  credentials?: any,
  experience?: any,
  learningData?: any
): ReelPassScore {
  // Calculate all component scores
  const reelProjects = calculateReelProjectsScore(projects);
  const reelPersona = calculateReelPersonaScore(personaData);
  const foundationalKnowledge = calculateFoundationalKnowledgeScore(credentials);
  const experienceDiversity = calculateExperienceDiversityScore(experience, projects);
  const continuousLearning = calculateContinuousLearningScore(learningData);

  // Calculate total score
  const totalScore = 
    reelProjects.totalScore +
    reelPersona.totalScore +
    foundationalKnowledge.totalScore +
    experienceDiversity.totalScore +
    continuousLearning.totalScore;

  // Determine level
  let level: 'aspiring' | 'emerging' | 'competent' | 'skilled' | 'expert' = 'aspiring';
  let levelName = SCORE_LEVELS.aspiring.name;
  
  for (const [key, config] of Object.entries(SCORE_LEVELS)) {
    if (totalScore >= config.min && totalScore <= config.max) {
      level = key as any;
      levelName = config.name;
      break;
    }
  }

  return {
    totalScore,
    level,
    levelName,
    components: {
      reelProjects,
      reelPersona,
      foundationalKnowledge,
      experienceDiversity,
      continuousLearning
    },
    lastUpdated: new Date().toISOString()
  };
} 