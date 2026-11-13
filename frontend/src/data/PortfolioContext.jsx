import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "../config";
import {
  profile as defaultProfile,
  summary as defaultSummary,
  skills as defaultSkills,
  experiences as defaultExperiences,
  projects as defaultProjects,
  stats as defaultStats,
  education as defaultEducation,
  certifications as defaultCertifications,
  testimonials as defaultTestimonials,
  learningConcepts as defaultLearningConcepts,
} from "./portfolioData";

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPin, setAdminPin] = useState("");

  const [profileData, setProfileData] = useState(defaultProfile);
  const [summaryData, setSummaryData] = useState(defaultSummary);
  const [skillsData, setSkillsData] = useState(defaultSkills);
  const [experiencesData, setExperiencesData] = useState(defaultExperiences);
  const [projectsData, setProjectsData] = useState(defaultProjects);
  const [statsData, setStatsData] = useState(defaultStats);
  const [educationData, setEducationData] = useState(defaultEducation);
  const [certificationsData, setCertificationsData] = useState(defaultCertifications);
  const [testimonialsData, setTestimonialsData] = useState(defaultTestimonials);
  const [learningData, setLearningData] = useState(defaultLearningConcepts || []);

  const [isLoaded, setIsLoaded] = useState(false);

  // ─── useRef mirrors: always hold the LATEST state values ───────────────────
  // This eliminates stale-closure bugs in syncWithServerJSON.
  const latestRef = useRef({});
  latestRef.current = {
    profileData,
    summaryData,
    skillsData,
    experiencesData,
    projectsData,
    statsData,
    educationData,
    certificationsData,
    testimonialsData,
    learningData,
  };
  // ───────────────────────────────────────────────────────────────────────────

  // Theme State ('cyber' | 'fire')
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem("portfolio_theme") || "cyber";
  });

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem("portfolio_theme", newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Fetch server-side portfolioData.json on load
  useEffect(() => {
    const fetchServerData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/portfolio-data`);
        const result = await response.json();
        if (result.success && result.data) {
          const d = result.data;
          if (d.profile) setProfileData(d.profile);
          if (d.summary) setSummaryData(d.summary);
          if (d.skills) setSkillsData(d.skills);
          if (d.experiences) setExperiencesData(d.experiences);
          if (d.projects) setProjectsData(d.projects);
          if (d.stats) setStatsData(d.stats);
          if (d.education) setEducationData(d.education);
          if (d.certifications) setCertificationsData(d.certifications);
          if (d.testimonials) setTestimonialsData(d.testimonials);
          if (d.learning) setLearningData(d.learning);
          console.log("Loaded portfolio data from server JSON!");
        }
      } catch (e) {
        console.warn("Could not fetch server portfolioData.json, using defaults:", e);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchServerData();
  }, []);

  // ─── Save changes to backend server JSON (portfolioData.json) ──────────────
  // FIX: Always read from latestRef.current so we NEVER send stale state.
  //      The caller can optionally override specific fields via `updatedFields`.
  const syncWithServerJSON = async (updatedFields = {}) => {
    const latest = latestRef.current;
    const fullState = {
      profile:        updatedFields.profileData        ?? latest.profileData,
      summary:        updatedFields.summaryData        ?? latest.summaryData,
      skills:         updatedFields.skillsData         ?? latest.skillsData,
      experiences:    updatedFields.experiencesData    ?? latest.experiencesData,
      projects:       updatedFields.projectsData       ?? latest.projectsData,
      stats:          updatedFields.statsData          ?? latest.statsData,
      education:      updatedFields.educationData      ?? latest.educationData,
      certifications: updatedFields.certificationsData ?? latest.certificationsData,
      testimonials:   updatedFields.testimonialsData   ?? latest.testimonialsData,
      learning:       updatedFields.learningData       ?? latest.learningData,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/portfolio-data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullState),
      });
      const data = await res.json();
      if (data.success) {
        console.log("✅ Portfolio state synchronized with server portfolioData.json");
      } else {
        console.warn("Server sync returned failure:", data);
      }
    } catch (e) {
      console.warn("Error syncing portfolio state to server JSON:", e);
    }
  };
  // ───────────────────────────────────────────────────────────────────────────

  // State Wrappers with Auto Server-JSON Sync
  const updateProfileData = (newProfile) => {
    setProfileData(newProfile);
    syncWithServerJSON({ profileData: newProfile });
  };

  const updateSummaryData = (newSummary) => {
    setSummaryData(newSummary);
    syncWithServerJSON({ summaryData: newSummary });
  };

  const updateSkillsData = (newSkills) => {
    setSkillsData(newSkills);
    syncWithServerJSON({ skillsData: newSkills });
  };

  const updateExperiencesData = (newExp) => {
    setExperiencesData(newExp);
    syncWithServerJSON({ experiencesData: newExp });
  };

  const updateProjectsData = (newProjects) => {
    setProjectsData(newProjects);
    syncWithServerJSON({ projectsData: newProjects });
  };

  const updateStatsData = (newStats) => {
    setStatsData(newStats);
    syncWithServerJSON({ statsData: newStats });
  };

  const updateEducationData = (newEdu) => {
    setEducationData(newEdu);
    syncWithServerJSON({ educationData: newEdu });
  };

  const updateCertificationsData = (newCerts) => {
    setCertificationsData(newCerts);
    syncWithServerJSON({ certificationsData: newCerts });
  };

  const updateTestimonialsData = (newTestimonials) => {
    setTestimonialsData(newTestimonials);
    syncWithServerJSON({ testimonialsData: newTestimonials });
  };

  const updateLearningData = (newLearning) => {
    setLearningData(newLearning);
    syncWithServerJSON({ learningData: newLearning });
  };

  const loginAdmin = async (pin) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/verify-pin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const data = await response.json();
      if (data.success) {
        setIsAdmin(true);
        return true;
      }
    } catch (e) {

    }
    return false;
  };

  const changeAdminPin = async (currentPin, newPin) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/change-pin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPin, newPin }),
      });

      const data = await response.json();

      if (data.success) {
        setAdminPin("");
        return true;
      }

      return false;
    } catch (e) {
      console.warn("Could not sync new PIN with server:", e);
      return false;
    }
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
  };

  // Projects CRUD
  const addProject = (newProject) => {
    const updated = [
      { ...newProject, id: "proj-" + Date.now() },
      ...projectsData,
    ];
    updateProjectsData(updated);
  };

  const updateProject = (id, updatedFields) => {
    const updated = projectsData.map((p) =>
      p.id === id ? { ...p, ...updatedFields } : p
    );
    updateProjectsData(updated);
  };

  const deleteProject = (id) => {
    const updated = projectsData.filter((p) => p.id !== id);
    updateProjectsData(updated);
  };

  // Reset to default data on server
  const resetToDefault = async () => {
    setProfileData(defaultProfile);
    setSummaryData(defaultSummary);
    setSkillsData(defaultSkills);
    setExperiencesData(defaultExperiences);
    setProjectsData(defaultProjects);
    setStatsData(defaultStats);
    setEducationData(defaultEducation);
    setCertificationsData(defaultCertifications);
    setTestimonialsData(defaultTestimonials);
    setLearningData(defaultLearningConcepts);
    setAdminPin("1234");

    const defaultFullState = {
      profile: defaultProfile,
      summary: defaultSummary,
      skills: defaultSkills,
      experiences: defaultExperiences,
      projects: defaultProjects,
      stats: defaultStats,
      education: defaultEducation,
      certifications: defaultCertifications,
      testimonials: defaultTestimonials,
      learning: defaultLearningConcepts,
    };

    try {
      await fetch(`${API_BASE_URL}/api/portfolio-data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(defaultFullState),
      });
    } catch (e) {
      console.warn("Could not reset server JSON:", e);
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        isAdmin,
        adminPin,
        changeAdminPin,
        loginAdmin,
        logoutAdmin,
        profileData,
        setProfileData: updateProfileData,
        summaryData,
        setSummaryData: updateSummaryData,
        skillsData,
        setSkillsData: updateSkillsData,
        experiencesData,
        setExperiencesData: updateExperiencesData,
        projectsData,
        addProject,
        updateProject,
        deleteProject,
        statsData,
        setStatsData: updateStatsData,
        educationData,
        setEducationData: updateEducationData,
        certificationsData,
        setCertificationsData: updateCertificationsData,
        testimonialsData,
        setTestimonialsData: updateTestimonialsData,
        learningData,
        setLearningData: updateLearningData,
        resetToDefault,
        isLoaded,
        theme,
        setTheme,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);
