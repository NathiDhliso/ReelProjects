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
import { Plus, Search, Folder, Target, Brain, Award, Lightbulb, Trophy } from 'lucide-react'
import { Project, ReelPassScore } from './types'
import { calculateReelPassScore } from './lib/reelpass-scoring'
import ReelPassWidget from './components/ReelPassWidget'
import ReelPassDashboard from './components/ReelPassDashboard'

function ProjectListView({ projects, onAddProject, isLoading, reelPassScore, onViewReelPass }: { 
  projects: Project[], 
  onAddProject: (project: Project) => void,
  isLoading: boolean,
  reelPassScore?: ReelPassScore,
  onViewReelPass: () => void
}) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

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
          
          <button 
            className="btn-new-project"
            onClick={() => onAddProject({} as Project)}
          >
            <Plus size={20} />
            Create AI Project
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {!showCreateForm ? (
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <button 
              onClick={() => setShowCreateForm(true)}
              className="w-full p-4 border-2 border-dashed border-gray-600 rounded-lg hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
            >
              + Create New AI-Powered Project
            </button>
          </div>
        ) : (
          <CreateProjectForm 
            onProjectCreated={addProject} 
            onClose={handleCloseForm}
          />
        )}
        
        {filteredProjects.length > 0 && (
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Your Projects</h2>
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <div 
                  key={project.id}
                  className="p-4 border border-gray-700 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors"
                  onClick={() => handleProjectClick(project)}
                >
                  <h3 className="font-semibold text-white">{project.name}</h3>
                  <p className="text-gray-400 text-sm">{project.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <p className="text-gray-500 text-xs">
                      Created: {new Date(project.created_at).toLocaleDateString()}
                    </p>
                    {project.analysis && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-blue-400">
                          AI Score: {project.analysis.clarity_score}/10
                        </span>
                        <span className="text-green-400">
                          {project.skill_demonstrations?.filter((s: any) => s.verified).length || 0} verified skills
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {filteredProjects.length === 0 && !showCreateForm && (
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 text-center">
            <p className="text-gray-400 mb-4">
              No projects yet. Create your first project to start building your professional portfolio.
            </p>
            <p className="text-sm text-gray-500">
              Your verified skills will automatically sync with{' '}
              <a 
                href="https://reelcv.reelapps.co.za" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                ReelCV
              </a>
              {' '}for a complete professional profile
            </p>
          </div>
        )}
      </div>

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
      loadUserProjects();
    } else {
      setProjects([]);
    }
  }, [isAuthenticated, user]);

  const loadUserProjects = async () => {
    if (!user) return;
    
    setProjectsLoading(true);
    try {
      const supabase = getSupabaseClient();
      
      // Query projects from database
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading projects:', error);
        return;
      }

      // Transform database projects to app format
      const transformedProjects = data?.map(project => ({
        id: project.id,
        name: project.title,
        description: project.description,
        goals: project.role, // Using role field for goals
        target_skills: project.technologies || [],
        analysis: {
          clarity_score: 8,
          feasibility_score: 8,
          identified_risks: [],
          suggested_technologies: project.technologies || [],
          detected_skills: [],
          skill_mapping: []
        },
        plan: [],
        skill_demonstrations: [],
        status: project.featured ? 'featured' : 'active',
        created_at: project.created_at,
        type: 'Professional Project',
        user_id: user.id
      })) || [];

      setProjects(transformedProjects);
      
      // Calculate ReelPass score
      const score = calculateReelPassScore(transformedProjects);
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
      
      // Save to database
      const { data, error } = await supabase
        .from('projects')
        .insert({
          profile_id: user.id,
          title: project.name,
          description: project.description,
          role: project.goals || '',
          technologies: project.target_skills || [],
          demo_url: '',
          github_url: '',
          type: project.type || 'personal',
          featured: false
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving project:', error);
        return;
      }

      // Create the new project with database ID
      const newProject = {
        ...project,
        id: data.id,
        user_id: user.id
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
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
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