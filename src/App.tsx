import React, { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { useAuthStore, initializeSupabase } from './lib/auth'
import { initializeAWS } from './lib/aws'
import { AppWrapper } from './components/AppWrapper'
import CreateProjectForm from './components/CreateProjectForm'
import ProjectDetailView from './components/ProjectDetailView'
import { getSupabaseClient } from './lib/auth'
import { LogOut } from 'lucide-react'
import './App.css'
import { Plus, Search, Folder, Target, Brain, Award, Lightbulb, Trophy, List, GitBranch, Calendar } from 'lucide-react'
import { Project, ReelPassScore, dbProjectToProject, projectToDbInsert } from './types'
import { calculateReelPassScore } from './lib/reelpass-scoring'
import ReelPassWidget from './components/ReelPassWidget'
import ReelPassDashboard from './components/ReelPassDashboard'
import ProjectPipeline from './components/ProjectPipeline'

function ProjectListView({ projects, onAddProject, onProjectMove, isLoading, reelPassScore, onViewReelPass }: { 
  projects: Project[], 
  onAddProject: (project: Project) => void,
  onProjectMove: (projectId: string, newStage: string) => void,
  isLoading: boolean,
  reelPassScore?: ReelPassScore,
  onViewReelPass: () => void
}) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'pipeline'>('list');

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || project.type === filterType;
    return matchesSearch && matchesType;
  });

  const getProjectTypeColor = (type: string) => {
    switch (type) {
      case 'AI-Powered Multi-Skill Showcase': return 'bg-gradient-to-r from-purple-500 to-blue-500';
      case 'Professional Project': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'Personal Project': return 'bg-gradient-to-r from-green-500 to-teal-500';
      case 'Academic Project': return 'bg-gradient-to-r from-orange-500 to-yellow-500';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  const addProject = (project: Project) => {
    onAddProject(project);
    setShowCreateForm(false);
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
  };

  const handleProjectClick = (project: Project) => {
    navigate(`/project/${project.id}`, { state: { project } });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="projects-container">
      <div className="projects-header">
        <div className="header-content">
          <h1 className="projects-title">
            <Folder className="title-icon" />
            ReelProjects Portfolio
          </h1>
          <p className="projects-subtitle">
            Build AI-powered projects that showcase your skills with automatic verification
          </p>
        </div>
        
        {/* ReelPass Score Widget */}
        <ReelPassWidget score={reelPassScore} onClick={onViewReelPass} />

        <div className="header-actions">
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value="AI-Powered Multi-Skill Showcase">AI Showcases</option>
            <option value="Professional Project">Professional</option>
            <option value="Personal Project">Personal</option>
            <option value="Academic Project">Academic</option>
          </select>

          {/* View Mode Toggle */}
          <div className="view-mode-toggle">
            <button
              className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <List size={20} />
            </button>
            <button
              className={`view-mode-btn ${viewMode === 'pipeline' ? 'active' : ''}`}
              onClick={() => setViewMode('pipeline')}
              title="Pipeline View"
            >
              <GitBranch size={20} />
            </button>
          </div>
          
          <button 
            className="btn-new-project"
            onClick={() => onAddProject({} as Project)}
          >
            <Plus size={20} />
            Create AI Project
          </button>
        </div>
      </div>

      {viewMode === 'pipeline' ? (
        <ProjectPipeline 
          projects={filteredProjects}
          onProjectMove={onProjectMove}
          onProjectClick={handleProjectClick}
        />
      ) : (
        <div className="projects-grid">
          {!showCreateForm ? (
            <div className="create-project-card">
              <button 
                onClick={() => setShowCreateForm(true)}
                className="create-project-button"
              >
                <Plus size={24} />
                <span>Create New AI-Powered Project</span>
              </button>
            </div>
          ) : (
            <CreateProjectForm 
              onProjectCreated={addProject} 
              onClose={handleCloseForm}
            />
          )}
          
          {filteredProjects.length > 0 && (
            <div className="projects-list-section">
              <h2 className="section-title">Your Projects</h2>
              <div className="projects-list">
                {filteredProjects.map((project) => (
                  <div 
                    key={project.id}
                    className="project-list-card"
                    onClick={() => handleProjectClick(project)}
                  >
                    <div className="project-card-content">
                      <div className="project-header">
                        <h3 className="project-name">{project.name}</h3>
                        <div className="project-type-tag">
                          {project.type}
                        </div>
                      </div>
                      
                      <p className="project-description">{project.description}</p>
                      
                      <div className="project-meta">
                        <div className="meta-item">
                          <Calendar size={14} />
                          <span>Created: {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'Unknown'}</span>
                        </div>
                        
                        {project.analysis && (
                          <>
                            <div className="meta-item">
                              <Brain size={14} />
                              <span>AI Score: {project.analysis.clarity_score}/10</span>
                            </div>
                            <div className="meta-item">
                              <Award size={14} />
                              <span>{project.skill_demonstrations?.filter((s: any) => s.verified).length || 0} verified skills</span>
                            </div>
                          </>
                        )}
                      </div>
                      
                      <div className="project-badges">
                        {project.scale === 'enterprise' && (
                          <span className="project-badge enterprise">Enterprise</span>
                        )}
                        {project.impact === 'significant' && (
                          <span className="project-badge impact">High Impact</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredProjects.length === 0 && !showCreateForm && (
            <div className="empty-state">
              <div className="empty-state-content">
                <Folder size={64} className="empty-icon" />
                <h3>No projects yet</h3>
                <p>Create your first project to start building your professional portfolio.</p>
                <p className="ecosystem-note">
                  Your verified skills will automatically sync with{' '}
                  <a 
                    href="https://reelcv.reelapps.co.za" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ecosystem-link"
                  >
                    ReelCV
                  </a>
                  {' '}for a complete professional profile
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer with ReelApps ecosystem links */}
      <footer className="mt-12 pt-8 border-t border-gray-700">
        <div className="text-center">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white mb-2">Explore the ReelApps Ecosystem</h3>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <a 
                href="https://reelcv.reelapps.co.za" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                ReelCV - Professional Profiles
              </a>
              <a 
                href="https://reelpersona.reelapps.co.za" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                ReelPersona - Work Personality Assessment
              </a>
              <a 
                href="https://reelhunter.reelapps.co.za" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                ReelHunter - Talent Acquisition
              </a>
              <a 
                href="https://reelskills.reelapps.co.za" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                ReelSkills - Skill Development
              </a>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            <p>
              Powered by{' '}
              <a 
                href="https://www.reelapps.co.za" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                ReelApps.co.za
              </a>
              {' '}- The complete professional development platform
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  const {
    initialize,
    isLoading,
    isInitializing: storeInitializing,
    isAuthenticated,
    user,
    login,
    signup,
    sendPasswordResetEmail,
    logout,
    error,
  } = useAuthStore();
  const [localInitializing, setLocalInitializing] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [reelPassScore, setReelPassScore] = useState<ReelPassScore | undefined>();
  const [showReelPassDashboard, setShowReelPassDashboard] = useState(false);

  // Load projects from Supabase when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadProjects();
    } else {
      setProjects([]);
    }
  }, [isAuthenticated, user]);

  const loadProjects = async () => {
    if (!user) return;
    
    setProjectsLoading(true);
    try {
      const supabase = getSupabaseClient();
      
      // First, get the user's profile ID
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        setProjectsLoading(false);
        return;
      }

      if (!profileData) {
        console.log('No profile found for user');
        setProjectsLoading(false);
        return;
      }

      // Load projects using the profile ID
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('profile_id', profileData.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading projects:', error);
        return;
      }

      // Convert database projects to app projects
      const projects: Project[] = (data || []).map(dbProject => ({
        ...dbProjectToProject(dbProject),
        // Set default values for app-specific fields
        analysis: {},
        plan: [],
        skill_demonstrations: [],
        status: 'active',
        type: 'Professional Project',
        scale: 'medium' as const,
        // Set default pipeline stage if not set
        pipeline_stage: 'planning' as const
      }));
      
      setProjects(projects);
      
      // Calculate ReelPass score
      const score = calculateReelPassScore(projects);
      setReelPassScore(score);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setProjectsLoading(false);
    }
  };

  const addProject = async (project: Project) => {
    if (!user) {
      alert('Please sign in to create projects');
      return;
    }

    try {
      const supabase = getSupabaseClient();
      
      // First, get the user's profile ID from the profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        alert('Could not find user profile. Please ensure your profile is set up.');
        return;
      }

      if (!profileData) {
        alert('No profile found. Please set up your profile first.');
        return;
      }

      // Use the helper function to convert project to database format with the correct profile ID
      const projectData = projectToDbInsert(project, profileData.id);

      // Save to database
      const { data, error } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single();

      if (error) {
        console.error('Error saving project:', error);
        alert(`Failed to save project: ${error.message}`);
        return;
      }

      // Convert database project back to app project format
      const newProject: Project = {
        ...dbProjectToProject(data),
        // Preserve app-specific fields that aren't stored in database
        analysis: project.analysis,
        plan: project.plan,
        skill_demonstrations: project.skill_demonstrations,
        status: project.status,
        type: project.type,
        scale: project.scale,
        // Ensure pipeline_stage is set
        pipeline_stage: project.pipeline_stage || 'planning'
      };
      
      setProjects(prevProjects => {
        const updatedProjects = [newProject, ...prevProjects];
        
        // Recalculate ReelPass score
        const score = calculateReelPassScore(updatedProjects);
        setReelPassScore(score);
        
        return updatedProjects;
      });
    } catch (err) {
      console.error('Failed to save project:', err);
      alert('Failed to save project. Please check your connection and try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleProjectMove = (projectId: string, newStage: string) => {
    console.log(`Moving project ${projectId} to stage ${newStage}`);
    
    // Update the project's pipeline stage
    setProjects(prevProjects => {
      const updatedProjects = prevProjects.map(project => 
        project.id === projectId 
          ? { 
              ...project, 
              pipeline_stage: newStage as Project['pipeline_stage'],
              // Update status based on stage
              status: (newStage === 'completed' ? 'completed' : 'active') as Project['status']
            }
          : project
      );
      
      // Save to localStorage for persistence (optional since we're using Supabase)
      localStorage.setItem('reelProjects', JSON.stringify(updatedProjects));
      
      // Recalculate ReelPass score with updated projects
      const updatedScore = calculateReelPassScore(updatedProjects);
      setReelPassScore(updatedScore);
      
      return updatedProjects;
    });
  };

  useEffect(() => {
    const init = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseAnonKey) {
          throw new Error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
        }
        
        // Initialize Supabase
        initializeSupabase(supabaseUrl, supabaseAnonKey);
        await initialize();

        // Initialize AWS (optional)
        const awsInitialized = initializeAWS();
        if (awsInitialized) {
          console.log('AWS services initialized successfully');
        } else {
          console.log('AWS services not available - using Supabase only');
        }
        
      } catch (error) {
        console.error('Initialization error:', error);
        setInitError(error instanceof Error ? error.message : 'Init error');
      } finally {
        setLocalInitializing(false);
      }
    };
    init();
  }, [initialize]);

  const handleViewReelPass = () => {
    setShowReelPassDashboard(true);
  };

  if (localInitializing || isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading ReelProject...</p>
        </div>
      </div>
    );
  }

  if (initError) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-4">
            <h2 className="text-red-300 font-semibold mb-2">Configuration Error</h2>
            <p className="text-red-200 text-sm">{initError}</p>
          </div>
          <p className="text-gray-400 text-sm">
            Please ensure your Supabase environment variables are properly configured.
          </p>
        </div>
      </div>
    );
  }

  if (showReelPassDashboard && reelPassScore) {
    return (
      <div className="app">
        <button 
          className="back-button"
          onClick={() => setShowReelPassDashboard(false)}
        >
          ← Back to Projects
        </button>
        <ReelPassDashboard 
          score={reelPassScore} 
          onViewDetails={(component) => {
            console.log('View details for:', component);
            // Handle navigation to specific component details
          }}
        />
      </div>
    );
  }

  return (
    <AppWrapper
      isAuthenticated={isAuthenticated}
      isInitializing={storeInitializing ?? false}
      _user={user}
      error={error ?? null}
      onLogin={login}
      onSignup={signup}
      onPasswordReset={sendPasswordResetEmail}
      isLoading={isLoading ?? false}
    >
      {/* Simple Logout Button - positioned in top right */}
      {isAuthenticated && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-600 rounded-lg transition-colors shadow-lg"
            title="Sign out"
          >
            <LogOut size={16} />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      )}
      
      <Routes>
        <Route path="/" element={
          <ProjectListView 
            projects={projects} 
            onAddProject={addProject}
            onProjectMove={handleProjectMove}
            isLoading={projectsLoading}
            reelPassScore={reelPassScore}
            onViewReelPass={handleViewReelPass}
          />
        } />
        <Route path="/project/:id" element={<ProjectDetailView projects={projects} />} />
      </Routes>
    </AppWrapper>
  );
}

export default App