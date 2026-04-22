import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, collection, addDoc, getDocs, deleteDoc, query, orderBy } from 'firebase/firestore';
import { 
  UserPen, 
  Plus, 
  Trash2, 
  Save, 
  LayoutDashboard, 
  FileText, 
  FlaskConical, 
  Briefcase,
  ExternalLink,
  ChevronRight,
  LogOut,
  Settings
} from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'research' | 'blogs'>('profile');
  
  // Profile State
  const [profile, setProfile] = useState({
    name: 'Sabbir Hossain',
    title: 'Electrical Engineer',
    bio: '',
    cvUrl: '',
    email: '',
    linkedin: '',
    github: '',
    twitter: ''
  });

  // Data Lists
  const [researches, setResearches] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      // Fetch Profile
      const profDoc = await getDoc(doc(db, 'settings', 'profile'));
      if (profDoc.exists()) setProfile(profDoc.data() as any);

      // Fetch Research
      const resSnap = await getDocs(query(collection(db, 'research')));
      setResearches(resSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      // Fetch Blogs
      const blogSnap = await getDocs(query(collection(db, 'blogs'), orderBy('date', 'desc')));
      setBlogs(blogSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  const saveProfile = async () => {
    try {
      await setDoc(doc(db, 'settings', 'profile'), profile);
      alert('Profile updated!');
    } catch (e) {
      alert('Error updating profile');
    }
  };

  const addResearch = async () => {
    const title = prompt('Research Title');
    const abstract = prompt('Abstract');
    const tag = prompt('Tag (e.g. Power Systems)');
    if (title && abstract) {
      await addDoc(collection(db, 'research'), { title, abstract, tag, authorId: user?.uid });
      fetchData();
    }
  };

  const addBlog = async () => {
    const title = prompt('Blog Title');
    if (title) {
      await addDoc(collection(db, 'blogs'), { 
        title, 
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), 
        excerpt: '',
        authorId: user?.uid 
      });
      fetchData();
    }
  };

  const deleteItem = async (col: string, id: string) => {
    if (confirm('Delete this item?')) {
      await deleteDoc(doc(db, col, id));
      fetchData();
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading CMS...</div>;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-midnight text-white flex flex-col p-6">
        <div className="mb-12">
          <h2 className="text-xl font-bold tracking-tighter uppercase italic">
            Sabbir<span className="text-sky-accent">CMS</span>
          </h2>
          <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest font-bold">Admin Panel v1.0</p>
        </div>

        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors ${activeTab === 'profile' ? 'bg-sky-accent text-midnight' : 'hover:bg-white/5 text-white/60'}`}
          >
            <Settings className="w-4 h-4" /> Profile Info
          </button>
          <button 
            onClick={() => setActiveTab('research')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors ${activeTab === 'research' ? 'bg-sky-accent text-midnight' : 'hover:bg-white/5 text-white/60'}`}
          >
            <FlaskConical className="w-4 h-4" /> Research Works
          </button>
          <button 
            onClick={() => setActiveTab('blogs')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors ${activeTab === 'blogs' ? 'bg-sky-accent text-midnight' : 'hover:bg-white/5 text-white/60'}`}
          >
            <FileText className="w-4 h-4" /> Technical Blogs
          </button>
        </nav>

        <div className="pt-6 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
               {user?.email?.charAt(0).toUpperCase()}
             </div>
             <span className="text-[10px] font-bold text-white/40 truncate w-24">{user?.email}</span>
          </div>
          <button onClick={logout} className="hover:text-red-400 transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 overflow-y-auto p-8 md:p-12">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight">
            {activeTab === 'profile' && 'Update Profile'}
            {activeTab === 'research' && 'Manage Research'}
            {activeTab === 'blogs' && 'Manage Blogs'}
          </h1>
          <a href="/" target="_blank" className="flex items-center gap-2 text-xs font-bold text-sky-accent hover:underline">
            View Live Site <ExternalLink className="w-3 h-3" />
          </a>
        </header>

        {activeTab === 'profile' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-midnight/40">Full Name</label>
                <input 
                  type="text" 
                  value={profile.name} 
                  onChange={e => setProfile({...profile, name: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-sky-accent text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-midnight/40">Professional Title</label>
                <input 
                  type="text" 
                  value={profile.title} 
                  onChange={e => setProfile({...profile, title: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-sky-accent text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-midnight/40">Bio / About Me Summary</label>
              <textarea 
                rows={4}
                value={profile.bio} 
                onChange={e => setProfile({...profile, bio: e.target.value})}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-sky-accent text-sm"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2 text-blue-600">
                <label className="text-[10px] font-bold uppercase tracking-widest text-midnight/40 text-midnight">LinkedIn</label>
                <input 
                  type="text" 
                  value={profile.linkedin} 
                  onChange={e => setProfile({...profile, linkedin: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-sky-accent text-sm"
                />
              </div>
               <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-midnight/40">GitHub</label>
                <input 
                  type="text" 
                  value={profile.github} 
                  onChange={e => setProfile({...profile, github: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-sky-accent text-sm"
                />
              </div>
               <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-midnight/40">CV Upload URL</label>
                <input 
                  type="text" 
                  value={profile.cvUrl} 
                  onChange={e => setProfile({...profile, cvUrl: e.target.value})}
                  placeholder="https://..."
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-sky-accent text-sm"
                />
              </div>
            </div>

            <button onClick={saveProfile} className="btn-editorial">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </motion.div>
        )}

        {activeTab === 'research' && (
          <div className="space-y-4">
             <button onClick={addResearch} className="flex items-center gap-2 bg-midnight text-white px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-midnight/90 transition-all mb-4">
               <Plus className="w-4 h-4" /> Add Research Work
             </button>
             <div className="grid gap-4">
               {researches.map(res => (
                 <div key={res.id} className="bg-white p-6 rounded-xl border border-gray-100 flex justify-between items-center group hover:border-sky-accent transition-colors">
                    <div>
                      <span className="text-[9px] font-bold text-sky-accent uppercase tracking-widest">{res.tag || 'Uncategorized'}</span>
                      <h3 className="font-bold text-lg">{res.title}</h3>
                    </div>
                    <button onClick={() => deleteItem('research', res.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                 </div>
               ))}
             </div>
          </div>
        )}

        {activeTab === 'blogs' && (
          <div className="space-y-4">
             <button onClick={addBlog} className="flex items-center gap-2 bg-midnight text-white px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-midnight/90 transition-all mb-4">
               <Plus className="w-4 h-4" /> New Blog Post
             </button>
             <div className="grid gap-4">
               {blogs.map(blog => (
                 <div key={blog.id} className="bg-white p-6 rounded-xl border border-gray-100 flex justify-between items-center group hover:border-sky-accent transition-colors">
                    <div>
                      <span className="text-[9px] font-bold text-midnight/40 uppercase tracking-widest">{blog.date}</span>
                      <h3 className="font-bold text-lg">{blog.title}</h3>
                    </div>
                    <button onClick={() => deleteItem('blogs', blog.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                 </div>
               ))}
             </div>
          </div>
        )}
      </main>
    </div>
  );
}
