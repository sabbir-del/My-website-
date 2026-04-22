import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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
  Settings,
  Upload,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'research' | 'blogs'>('profile');
  const [isEditing, setIsEditing] = useState<string | null>(null); // 'new' or 'id'
  const [editItem, setEditItem] = useState<any>(null);

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
      const profDoc = await getDoc(doc(db, 'settings', 'profile'));
      if (profDoc.exists()) setProfile(profDoc.data() as any);

      const resSnap = await getDocs(query(collection(db, 'research')));
      setResearches(resSnap.docs.map(d => ({ id: d.id, ...d.data() })));

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

  const [editorTab, setEditorTab] = useState<'info' | 'content'>('info');

  const handleEditResearch = (item: any) => {
    setEditItem(item || { title: '', abstract: '', tag: '', link: '', imageUrl: '' });
    setIsEditing('research');
    setEditorTab('info');
  };

  const handleEditBlog = (item: any) => {
    setEditItem(item || { title: '', excerpt: '', content: '', date: new Date().toLocaleDateString() });
    setIsEditing('blog');
    setEditorTab('info');
  };

  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `research/${user.uid}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setEditItem({ ...editItem, imageUrl: url });
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const saveResearch = async () => {
    try {
      if (editItem.id) {
        await setDoc(doc(db, 'research', editItem.id), { ...editItem, authorId: user?.uid });
      } else {
        await addDoc(collection(db, 'research'), { ...editItem, authorId: user?.uid });
      }
      setIsEditing(null);
      fetchData();
    } catch (e) {
      alert('Error saving research');
    }
  };

  const saveBlog = async () => {
    try {
      if (editItem.id) {
        await setDoc(doc(db, 'blogs', editItem.id), { ...editItem, authorId: user?.uid });
      } else {
        await addDoc(collection(db, 'blogs'), { ...editItem, authorId: user?.uid });
      }
      setIsEditing(null);
      fetchData();
    } catch (e) {
      alert('Error saving blog');
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
          <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest font-bold">Admin Panel v2.0</p>
        </div>

        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => { setActiveTab('profile'); setIsEditing(null); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors ${activeTab === 'profile' && !isEditing ? 'bg-sky-accent text-midnight' : 'hover:bg-white/5 text-white/60'}`}
          >
            <Settings className="w-4 h-4" /> Profile Info
          </button>
          <button 
            onClick={() => { setActiveTab('research'); setIsEditing(null); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors ${activeTab === 'research' || isEditing === 'research' ? 'bg-sky-accent text-midnight' : 'hover:bg-white/5 text-white/60'}`}
          >
            <FlaskConical className="w-4 h-4" /> Research Works
          </button>
          <button 
            onClick={() => { setActiveTab('blogs'); setIsEditing(null); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors ${activeTab === 'blogs' || isEditing === 'blog' ? 'bg-sky-accent text-midnight' : 'hover:bg-white/5 text-white/60'}`}
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
            {isEditing === 'research' && (editItem.id ? 'Edit Research' : 'Add Research')}
            {isEditing === 'blog' && (editItem.id ? 'Edit Blog' : 'New Blog')}
            {!isEditing && activeTab === 'profile' && 'Update Profile'}
            {!isEditing && activeTab === 'research' && 'Research Works'}
            {!isEditing && activeTab === 'blogs' && 'Technical Blogs'}
          </h1>
          <button onClick={() => window.open('/', '_blank')} className="flex items-center gap-2 text-xs font-bold text-sky-accent hover:underline">
            View Live Site <ExternalLink className="w-3 h-3" />
          </button>
        </header>

        {/* PROFILE TAB */}
        {!isEditing && activeTab === 'profile' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 bg-white p-8 rounded-xl border border-gray-100 shadow-sm max-w-4xl">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-midnight/40 leading-none">Full Name</label>
                <input 
                  type="text" 
                  value={profile.name} 
                  onChange={e => setProfile({...profile, name: e.target.value})}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-accent/20 outline-none text-sm transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-midnight/40 leading-none">Professional Title</label>
                <input 
                  type="text" 
                  value={profile.title} 
                  onChange={e => setProfile({...profile, title: e.target.value})}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-accent/20 outline-none text-sm transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-midnight/40 leading-none">Bio Summary</label>
              <textarea 
                rows={4}
                value={profile.bio} 
                onChange={e => setProfile({...profile, bio: e.target.value})}
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-accent/20 outline-none text-sm transition-all"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
               <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-midnight/40 leading-none">CV URL</label>
                <input 
                  type="text" 
                  value={profile.cvUrl} 
                  placeholder="Link to your PDF"
                  onChange={e => setProfile({...profile, cvUrl: e.target.value})}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-accent/20 outline-none text-sm transition-all"
                />
              </div>
               <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-midnight/40 leading-none">Public Email</label>
                <input 
                  type="text" 
                  value={profile.email} 
                  onChange={e => setProfile({...profile, email: e.target.value})}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-accent/20 outline-none text-sm transition-all"
                />
              </div>
            </div>

            <button onClick={saveProfile} className="btn-editorial">
              <Save className="w-4 h-4" /> Save Profile Info
            </button>
          </motion.div>
        )}

        {/* RESEARCH TAB */}
        {!isEditing && activeTab === 'research' && (
          <div className="space-y-6 max-w-5xl">
             <button onClick={() => handleEditResearch(null)} className="flex items-center gap-2 bg-midnight text-white px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-midnight/90 transition-all shadow-lg shadow-midnight/10 mb-8">
               <Plus className="w-4 h-4" /> Add New Research
             </button>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {researches.map(res => (
                 <div key={res.id} className="bg-white rounded-2xl border border-gray-100 relative group hover:border-sky-accent transition-all cursor-pointer overflow-hidden flex flex-col" onClick={() => handleEditResearch(res)}>
                    {res.imageUrl && (
                      <div className="h-32 overflow-hidden border-b border-gray-50">
                        <img src={res.imageUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="" />
                      </div>
                    )}
                    <div className="p-6 flex-1">
                      <div className="text-[9px] font-black text-sky-accent uppercase tracking-widest mb-2">{res.tag || 'Project'}</div>
                      <h3 className="font-bold text-base leading-tight mb-4 line-clamp-2">{res.title}</h3>
                      <p className="text-[10px] text-[#64748B] line-clamp-2 leading-relaxed mb-6">{res.abstract}</p>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteItem('research', res.id); }}
                      className="absolute bottom-6 right-6 p-2 text-gray-200 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                 </div>
               ))}
             </div>
          </div>
        )}

        {/* BLOG TAB */}
        {!isEditing && activeTab === 'blogs' && (
          <div className="space-y-6 max-w-4xl">
             <button onClick={() => handleEditBlog(null)} className="flex items-center gap-2 bg-midnight text-white px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-midnight/90 transition-all shadow-lg shadow-midnight/10 mb-8">
               <Plus className="w-4 h-4" /> Write New Article
             </button>
             <div className="flex flex-col gap-4">
               {blogs.map(blog => (
                 <div key={blog.id} className="bg-white p-6 rounded-xl border border-gray-100 flex justify-between items-center hover:border-sky-accent transition-colors cursor-pointer group" onClick={() => handleEditBlog(blog)}>
                    <div className="flex items-center gap-6">
                      <div className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest w-24">{blog.date}</div>
                      <h3 className="font-bold text-lg group-hover:text-midnight transition-colors">{blog.title}</h3>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); deleteItem('blogs', blog.id); }} className="p-2 text-gray-200 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                 </div>
               ))}
             </div>
          </div>
        )}

        {/* EDITOR VIEW (Research or Blog) */}
        {isEditing && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl max-w-4xl overflow-hidden">
            {/* Editor Tabs */}
            <div className="flex border-b border-gray-100">
              <button 
                onClick={() => setEditorTab('info')}
                className={`flex-1 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${editorTab === 'info' ? 'bg-midnight text-sky-accent' : 'text-[#94A3B8] hover:bg-gray-50'}`}
              >
                1. General Info
              </button>
              <button 
                onClick={() => setEditorTab('content')}
                className={`flex-1 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${editorTab === 'content' ? 'bg-midnight text-sky-accent' : 'text-[#94A3B8] hover:bg-gray-50'}`}
              >
                2. Detail {isEditing === 'research' ? 'Abstract' : 'Content'}
              </button>
            </div>

            <div className="p-10 space-y-8">
              {editorTab === 'info' ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-midnight/40">Entry Title</label>
                    <input 
                      type="text" 
                      value={editItem.title} 
                      onChange={e => setEditItem({...editItem, title: e.target.value})}
                      className="w-full text-3xl font-extrabold tracking-tighter outline-none focus:text-midnight transition-colors py-2"
                      placeholder="Enter a descriptive title..."
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-midnight/40">
                        {isEditing === 'research' ? 'Category / Tag' : 'Publication Date'}
                      </label>
                      <input 
                        type="text" 
                        value={isEditing === 'research' ? editItem.tag : editItem.date} 
                        onChange={e => setEditItem({...editItem, [isEditing === 'research' ? 'tag' : 'date']: e.target.value})}
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white outline-none text-sm font-bold"
                        placeholder={isEditing === 'research' ? "e.g. Robotics" : "Apr 22, 2026"}
                      />
                    </div>
                    {isEditing === 'research' && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-midnight/40">Cover Image</label>
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-24 rounded-xl bg-gray-50 border border-dashed border-gray-200 overflow-hidden flex items-center justify-center relative">
                            {editItem.imageUrl ? (
                              <img src={editItem.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                            ) : (
                              <ImageIcon className="w-6 h-6 text-gray-300" />
                            )}
                            {uploading && (
                              <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                <Loader2 className="w-5 h-5 text-sky-accent animate-spin" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-border-editorial rounded-lg text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-gray-50 transition-colors">
                              <Upload className="w-3 h-3" />
                              {editItem.imageUrl ? 'Change Image' : 'Upload Image'}
                              <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                            </label>
                            <p className="text-[9px] text-[#94A3B8] mt-2 italic">Supports JPG, PNG, WebP (Max 5MB)</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-midnight/40">
                        {isEditing === 'research' ? 'Paper Link' : 'Short Excerpt'}
                      </label>
                      <input 
                        type="text" 
                        value={isEditing === 'research' ? editItem.link : editItem.excerpt} 
                        onChange={e => setEditItem({...editItem, [isEditing === 'research' ? 'link' : 'excerpt']: e.target.value})}
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white outline-none text-sm font-bold"
                        placeholder="Additional meta info..."
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                   <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-midnight/40">
                      {isEditing === 'research' ? 'Abstract / Summary' : 'Full Blog Content'}
                    </label>
                    <textarea 
                      rows={isEditing === 'research' ? 8 : 15}
                      value={isEditing === 'research' ? editItem.abstract : editItem.content} 
                      onChange={e => setEditItem({...editItem, [isEditing === 'research' ? 'abstract' : 'content']: e.target.value})}
                      className="w-full p-6 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white outline-none text-sm leading-relaxed font-medium"
                      placeholder="Deep dive into the details..."
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-8 border-t border-gray-100">
                {editorTab === 'info' ? (
                  <button 
                    onClick={() => setEditorTab('content')}
                    className="bg-midnight text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest text-[11px] hover:bg-midnight/90"
                  >
                    Next: Edit {isEditing === 'research' ? 'Abstract' : 'Content'}
                  </button>
                ) : (
                  <button 
                    onClick={isEditing === 'research' ? saveResearch : saveBlog} 
                    className="bg-sky-accent text-midnight px-10 py-4 rounded-xl font-black uppercase tracking-widest text-[11px] hover:scale-[1.02] transition-transform"
                  >
                    Finalize & Save
                  </button>
                )}
                
                <button 
                  onClick={() => setIsEditing(null)} 
                  className="px-10 py-4 border border-gray-200 rounded-xl font-black uppercase tracking-widest text-[11px] text-[#94A3B8] hover:bg-gray-50 transition-colors"
                >
                  Discard Changes
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
