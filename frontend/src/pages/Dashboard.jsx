import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart,
  BarChart, Bar, CartesianGrid, Legend
} from 'recharts';
import { 
  TrendingUp, Users, Heart, MessageCircle, FileText, 
  Clock, Award, PenTool, EyeOff, FileEdit, Bell,
  MoreVertical, ArrowUpRight
} from 'lucide-react';

// Mock Data for Charts
const viewsData = [
  { name: 'Mon', views: 400 },
  { name: 'Tue', views: 300 },
  { name: 'Wed', views: 550 },
  { name: 'Thu', views: 480 },
  { name: 'Fri', views: 700 },
  { name: 'Sat', views: 850 },
  { name: 'Sun', views: 1200 },
];

const engagementData = [
  { name: 'Post 1', likes: 120, comments: 45 },
  { name: 'Post 2', likes: 250, comments: 80 },
  { name: 'Post 3', likes: 180, comments: 55 },
  { name: 'Post 4', likes: 300, comments: 110 },
];

const topBlogs = [
  { id: 1, title: 'The Future of AI in Web Development', views: '12.4K', likes: '1.2K', engagement: '18%' },
  { id: 2, title: 'Mastering React Server Components', views: '8.2K', likes: '850', engagement: '14%' },
  { id: 3, title: 'Why I Switched from VS Code to Cursor', views: '5.1K', likes: '620', engagement: '11%' },
];

const activities = [
  { id: 1, user: 'Sarah Jenkins', avatar: 'https://i.pravatar.cc/150?u=sarah', action: 'liked your post', time: '2m ago' },
  { id: 2, user: 'Mike Chen', avatar: 'https://i.pravatar.cc/150?u=mike', action: 'commented: "Great read!"', time: '15m ago' },
  { id: 3, user: 'Alex Rivera', avatar: 'https://i.pravatar.cc/150?u=alex', action: 'saved your article', time: '1h ago' },
  { id: 4, user: 'Emma Wilson', avatar: 'https://i.pravatar.cc/150?u=emma', action: 'started following you', time: '3h ago' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ articles: 0, views: 0, likes: 0 });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7D');
  const [incognito, setIncognito] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!user || !user.id) return;
        const postsRes = await api.get(`/posts?author=${user.id}`);
        const posts = postsRes.data?.data || [];
        setStats({
          articles: posts.length,
          views: posts.reduce((acc, p) => acc + (p.views || 0), 0) + 14500, // Mock addition for visual
          likes: posts.reduce((acc, p) => acc + (p.likesCount || 0), 0) + 2300, // Mock addition
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  // Glassmorphism Card Style
  const glassCard = "bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 shadow-xl rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:border-white/40 dark:hover:border-gray-700/50";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] text-gray-900 dark:text-gray-100 font-sans selection:bg-indigo-500/30">
      
      {/* Decorative Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">
              Welcome back, {user?.name?.split(' ')[0] || 'Creator'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-2">
              Here is what&apos;s happening with your Blog Mafia presence today.
            </p>
          </div>
          
          {/* Quick Actions Header */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIncognito(!incognito)}
              className={`p-2.5 rounded-xl border backdrop-blur-md transition-all ${
                incognito 
                ? 'bg-gray-900 text-white border-gray-800 dark:bg-white dark:text-gray-900' 
                : 'bg-white/50 border-gray-200 text-gray-600 hover:bg-white dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-300'
              }`}
              title="Toggle Incognito Mode"
            >
              <EyeOff className="w-5 h-5" />
            </button>
            <Link to="/write" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 active:scale-95">
              <PenTool className="w-4 h-4" />
              Write Blog
            </Link>
          </div>
        </div>

        {/* KPI Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Posts', value: stats.articles, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10', trend: '+12%' },
            { label: 'Total Views', value: stats.views.toLocaleString(), icon: EyeOff, iconReal: TrendingUp, color: 'text-indigo-500', bg: 'bg-indigo-500/10', trend: '+24%' },
            { label: 'Total Likes', value: stats.likes.toLocaleString(), icon: Heart, color: 'text-rose-500', bg: 'bg-rose-500/10', trend: '+18%' },
            { label: 'Engagement Score', value: '86', suffix: '/100', icon: Award, color: 'text-amber-500', bg: 'bg-amber-500/10', trend: '+5%' },
          ].map((stat, i) => (
            <div key={i} className={`${glassCard} group cursor-pointer`}>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                  {stat.iconReal ? <stat.iconReal className="w-6 h-6" /> : <stat.icon className="w-6 h-6" />}
                </div>
                <span className="flex items-center text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  {stat.trend}
                </span>
              </div>
              <h3 className="text-gray-500 dark:text-gray-400 font-medium text-sm">{stat.label}</h3>
              <div className="flex items-baseline mt-1">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                {stat.suffix && <span className="text-gray-500 text-sm ml-1">{stat.suffix}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Main Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Charts & Top Blogs (Takes up 2/3) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Chart Section */}
            <div className={glassCard}>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-bold">Audience Overview</h2>
                  <p className="text-sm text-gray-500">Views across your publications</p>
                </div>
                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                  {['7D', '30D', 'ALL'].map(range => (
                    <button 
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${timeRange === range ? 'bg-white dark:bg-gray-600 shadow text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={viewsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.8)', backdropFilter: 'blur(8px)', borderRadius: '12px', border: 'none', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="views" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Engagement Bar Chart & Audience Insights Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Engagement Chart */}
              <div className={glassCard}>
                <h2 className="text-lg font-bold mb-6">Engagement</h2>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={engagementData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }} barSize={12}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#6b7280'}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#6b7280'}} />
                      <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: '#1f2937', color: '#fff' }} />
                      <Bar dataKey="likes" fill="#ec4899" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="comments" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Audience Insights */}
              <div className={`${glassCard} flex flex-col justify-between`}>
                <div>
                  <h2 className="text-lg font-bold mb-1">Audience Insights</h2>
                  <p className="text-sm text-gray-500 mb-6">Understand your readers better</p>
                </div>
                
                <div className="space-y-5">
                  <div className="flex items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <Clock className="w-10 h-10 p-2.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg mr-4" />
                    <div>
                      <p className="text-xs text-gray-500">Most Active Time</p>
                      <p className="font-semibold">8:00 PM - 10:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <Users className="w-10 h-10 p-2.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg mr-4" />
                    <div>
                      <p className="text-xs text-gray-500">Top Demographic</p>
                      <p className="font-semibold">Developers (18-24)</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <FileText className="w-10 h-10 p-2.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg mr-4" />
                    <div>
                      <p className="text-xs text-gray-500">Avg Reading Time</p>
                      <p className="font-semibold">4m 12s per post</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Content Row */}
            <div className={glassCard}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">Top Performing Blogs</h2>
                <button className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline">View All</button>
              </div>
              <div className="space-y-4">
                {topBlogs.map((blog, idx) => (
                  <div key={blog.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm font-bold text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm md:text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{blog.title}</h4>
                        <div className="flex mt-1 space-x-4 text-xs text-gray-500">
                          <span className="flex items-center"><EyeOff className="w-3 h-3 mr-1" /> {blog.views}</span>
                          <span className="flex items-center"><Heart className="w-3 h-3 mr-1" /> {blog.likes}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-emerald-500">{blog.engagement}</div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider">Eng. Rate</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Activity Feed & Drafts */}
          <div className="space-y-8">
            
            {/* Activity Feed */}
            <div className={`${glassCard} flex flex-col h-[500px]`}>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  <h2 className="text-lg font-bold">Activity Feed</h2>
                </div>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
                {activities.map((activity, i) => (
                  <div key={activity.id} className="relative flex gap-4 items-start group">
                    {/* Connection Line */}
                    {i !== activities.length - 1 && (
                      <div className="absolute top-10 left-5 bottom-[-24px] w-px bg-gray-200 dark:bg-gray-800 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50 transition-colors"></div>
                    )}
                    
                    {/* Avatar */}
                    <div className="relative z-10 w-10 h-10 rounded-full border-2 border-white dark:border-[#0A0A0A] overflow-hidden shrink-0 shadow-sm">
                      <img src={activity.avatar} alt={activity.user} className="w-full h-full object-cover" />
                    </div>
                    
                    {/* Content */}
                    <div className="pt-1 w-full bg-transparent p-2 -mt-2 rounded-xl transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/30 cursor-pointer">
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        <span className="font-semibold text-gray-900 dark:text-white mr-1 hover:text-indigo-500 transition-colors">{activity.user}</span>
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-800 transition-colors">
                View All Notifications
              </button>
            </div>

            {/* Quick Drafts Widget */}
            <div className={glassCard}>
               <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <FileEdit className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    Recent Drafts
                  </h2>
               </div>
               <div className="space-y-3">
                 {['Next.js 15: What is New?', 'Design Patterns for 2026'].map((draft, i) => (
                   <div key={i} className="group p-3 border border-gray-100 dark:border-gray-800 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-md transition-all cursor-pointer">
                     <h4 className="font-medium text-sm text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{draft}</h4>
                     <p className="text-xs text-gray-400 mt-1 text-right">Edited {i === 0 ? 'Today' : '2 days ago'}</p>
                   </div>
                 ))}
                 <Link to="/write" className="block w-full text-center mt-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl py-3 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white transition-all">
                   + Create New Draft
                 </Link>
               </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
