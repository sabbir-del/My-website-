/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  Linkedin, 
  Github, 
  Mail, 
  ExternalLink, 
  BookOpen, 
  Cpu, 
  Camera, 
  Gamepad2, 
  ChevronRight,
  Menu,
  X,
  GraduationCap,
  Calendar,
  Briefcase
} from 'lucide-react';
import { useState, useEffect } from 'react';

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'research', label: 'Research' },
  { id: 'blog', label: 'Blog' },
  { id: 'hobbies', label: 'Hobbies' },
  { id: 'contact', label: 'Contact' },
];

const education = [
  {
    degree: "B.Sc. in Electrical & Electronic Engineering",
    institution: "Your University Name",
    period: "2021 - Present",
    details: "Focusing on Power Systems, Control Engineering, and VLSI Design. Current CGPA: 3.8/4.0."
  },
  {
    degree: "Higher Secondary Certificate",
    institution: "Your College Name",
    period: "2018 - 2020",
    details: "Science Group. Excelled in Mathematics and Physics."
  }
];

const researchData = [
  {
    title: "Optimized PV Systems",
    abstract: "A study on improving efficiency of photovoltaic systems using MPPT algorithms under partial shading conditions.",
    link: "#",
    tag: "Power Systems"
  },
  {
    title: "Smart Grid Integration",
    abstract: "Exploring the challenges and solutions for integrating renewable energy sources into existing local smart grid infrastructures.",
    link: "#",
    tag: "Smart Grid"
  },
  {
    title: "IoT in Agriculture",
    abstract: "Development of a low-cost IoT-based soil moisture monitoring system for precision irrigation in rural areas.",
    link: "#",
    tag: "IoT/Automation"
  }
];

const blogPosts = [
  {
    title: "The Future of Power Electronics",
    date: "Dec 12, 2023",
    excerpt: "Exploring how Gallium Nitride (GaN) is revolutionizing power conversion efficiency..."
  },
  {
    title: "My Journey into VLSI Design",
    date: "Nov 28, 2023",
    excerpt: "The first steps, the late nights, and the satisfaction of my first chip layout..."
  }
];

const hobbies = [
  { icon: <Cpu className="w-5 h-5" />, label: "Circuit Design" },
  { icon: <Camera className="w-5 h-5" />, label: "Photography" },
  { icon: <BookOpen className="w-5 h-5" />, label: "Tech Reading" },
  { icon: <Gamepad2 className="w-5 h-5" />, label: "Gaming" }
];

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import { db } from './lib/firebase';
import { collection, doc, getDoc, getDocs, orderBy, query, onSnapshot } from 'firebase/firestore';

function Portfolio() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [researches, setResearches] = useState<any[]>(researchData);
  const [blogs, setBlogs] = useState<any[]>(blogPosts);

  useEffect(() => {
    // Real-time Profile
    const unsubProfile = onSnapshot(doc(db, 'settings', 'profile'), (doc) => {
      if (doc.exists()) setProfile(doc.data());
    });

    // Real-time Research
    const unsubResearch = onSnapshot(collection(db, 'research'), (snap) => {
      if (!snap.empty) setResearches(snap.docs.map(d => ({ ...d.data(), id: d.id })));
    });

    // Real-time Blogs
    const unsubBlogs = onSnapshot(query(collection(db, 'blogs'), orderBy('date', 'desc')), (snap) => {
      if (!snap.empty) setBlogs(snap.docs.map(d => ({ ...d.data(), id: d.id })));
    });

    return () => {
      unsubProfile();
      unsubResearch();
      unsubBlogs();
    };
  }, []);

  const handleDownloadCV = () => {
    window.open(profile?.cvUrl || 'https://example.com/cv.pdf', '_blank');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-midnight selection:bg-sky-accent/20">
      {/* Editorial Navbar */}
      <nav className="h-20 border-b border-border-editorial flex items-center justify-between px-8 md:px-12 bg-white sticky top-0 z-50">
        <div className="text-xl font-extrabold tracking-tighter uppercase">
          {profile?.name?.split(' ')[0] || 'Sabbir'} <span className="text-sky-accent">{profile?.name?.split(' ')[1] || 'Hossain'}</span>
        </div>
        
        <div className="hidden md:flex items-center gap-10">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="text-[0.75rem] font-bold uppercase tracking-[0.15em] text-[#64748B] hover:text-midnight transition-colors"
            >
              {section.label}
            </a>
          ))}
        </div>

        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 top-20 bg-white z-40 p-8 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-2xl font-extrabold uppercase tracking-tight"
                >
                  {section.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col md:flex-row">
        <aside className="md:w-[450px] border-b md:border-b-0 md:border-r border-border-editorial bg-sky-light p-8 md:p-12 flex flex-col justify-between md:min-h-[calc(100vh-80px)]">
          <section id="home" className="mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-extrabold leading-[0.95] tracking-tighter mb-8 text-midnight"
            >
              {profile?.title?.split(' ')[0] || 'Electrical'} <br /> {profile?.title?.split(' ').slice(1).join(' ') || 'Engineer'}<span className="text-sky-accent">.</span>
            </motion.h1>
            <p className="text-lg text-[#475569] leading-relaxed mb-10 max-w-sm">
              {profile?.bio || 'EEE student focused on renewable grid optimization and intelligent automation for sustainable global energy transitions.'}
            </p>
            <button 
              onClick={handleDownloadCV}
              className="btn-editorial w-max"
            >
              <Download className="w-4 h-4" />
              Download CV
            </button>
          </section>

          <section id="hobbies" className="mt-auto">
            <span className="text-[0.7rem] uppercase tracking-[0.2em] font-bold text-sky-accent mb-6 block">Interests</span>
            <div className="grid grid-cols-2 gap-4">
              {hobbies.map((hobby, idx) => (
                <div key={idx} className="flex flex-col items-center p-4 rounded bg-white/50 border border-border-editorial/50 text-midnight/70">
                  <div className="mb-2">{hobby.icon}</div>
                  <span className="text-[0.65rem] font-bold uppercase tracking-widest">{hobby.label}</span>
                </div>
              ))}
            </div>
          </section>
        </aside>

        <div className="flex-1 p-8 md:p-16 flex flex-col gap-12 overflow-y-auto">
          <section id="about">
            <span className="section-label-editorial">About Me</span>
            <div className="prose prose-slate max-w-none">
              <p className="text-xl font-medium text-[#475569] leading-relaxed mb-8">
                {profile?.tagline || 'Currently pursuing a B.Sc. in Electrical & Electronic Engineering, I bridge the gap between pure hardware design and smart software integration.'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {education.map((edu, idx) => (
                <div key={idx} className="editorial-border p-6 rounded bg-white">
                  <div className="text-[0.65rem] font-bold text-sky-accent uppercase tracking-[0.2em] mb-2">{edu.period}</div>
                  <h4 className="font-bold text-lg mb-1">{edu.degree}</h4>
                  <div className="text-sm text-[#94A3B8] font-medium">{edu.institution}</div>
                </div>
              ))}
            </div>
          </section>

          <section id="research">
            <span className="section-label-editorial">Research Showcase</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {researches.map((item, idx) => (
                <div key={idx} className="editorial-card group bg-white">
                  <div className="text-[0.6rem] font-bold text-sky-accent uppercase tracking-widest mb-3">{item.tag}</div>
                  <h4 className="text-lg font-bold mb-3 leading-tight">{item.title}</h4>
                  <p className="text-sm text-[#64748B] leading-relaxed line-clamp-3 mb-6">
                    {item.abstract}
                  </p>
                  <a href={item.link} className="inline-block text-[0.7rem] font-bold text-sky-accent tracking-widest hover:underline">
                    READ PAPER →
                  </a>
                </div>
              ))}
            </div>
          </section>

          <section id="blog">
            <span className="section-label-editorial">Latest Articles</span>
            <div className="flex flex-col bg-white">
              {blogs.map((post, idx) => (
                <div key={idx} className="blog-item-editorial group cursor-pointer hover:bg-sky-light/30 px-2 transition-colors">
                  <h4 className="font-bold text-lg group-hover:text-midnight flex-1">
                    {post.title}
                  </h4>
                  <span className="text-[0.7rem] font-bold text-[#94A3B8] uppercase tracking-wider">{post.date}</span>
                </div>
              ))}
            </div>
          </section>

          <footer id="contact" className="mt-auto pt-10 border-t border-border-editorial flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex gap-8 items-center">
              <a href={profile?.linkedin || "#"} className="text-[0.75rem] font-bold uppercase tracking-widest hover:text-sky-accent transition-colors">LinkedIn</a>
              <a href={profile?.github || "#"} className="text-[0.75rem] font-bold uppercase tracking-widest hover:text-sky-accent transition-colors">GitHub</a>
              <a href={profile?.twitter || "#"} className="text-[0.75rem] font-bold uppercase tracking-widest hover:text-sky-accent transition-colors">Twitter</a>
            </div>
            <div className="text-[0.7rem] font-bold text-[#94A3B8] uppercase tracking-[0.25em]">
              {profile?.email || 'sabbir.hossain@edu.com'}
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Checking auth...</div>;
  return user ? <>{children}</> : <Navigate to="/admin/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route 
            path="/admin" 
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

