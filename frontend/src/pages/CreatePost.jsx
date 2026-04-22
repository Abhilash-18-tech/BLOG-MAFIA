import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image as ImageIcon, Heading1, Code, Type, Sparkles, Loader2 } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // AI states
  const [aiLoading, setAiLoading] = useState({ title: false, summary: false, category: false });
  const [suggestedTitles, setSuggestedTitles] = useState([]);
  
  // Slash command state
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPos, setSlashMenuPos] = useState({ top: 0, left: 0 });
  const editorRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.data);
      } catch (err) {
        console.error('Failed to fetch categories');
      }
    };
    fetchCategories();
  }, []);

  // Load draft
  useEffect(() => {
    const savedDraft = localStorage.getItem('blog_draft');
    if (savedDraft) {
      try {
        const { title: dTitle, description: dDesc, content: dContent, category: dCat } = JSON.parse(savedDraft);
        if (dTitle) setTitle(dTitle);
        if (dDesc) setDescription(dDesc);
        if (dContent) setContent(dContent);
        if (dCat) setCategory(dCat);
        if (editorRef.current && dContent) {
          editorRef.current.innerHTML = dContent;
        }
      } catch(e) {}
    }
  }, []);

  // Save draft
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (title || description || content || category) {
        localStorage.setItem('blog_draft', JSON.stringify({ title, description, content, category }));
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [title, description, content, category]);

  // Handle Notion-like slash commands
  const handleEditorInput = (e) => {
     const value = e.target.innerText;
     setContent(value);
     
     // Detect slash
     const selection = window.getSelection();
     if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const textBeforeCursor = range.startContainer.textContent?.slice(0, range.startOffset);
        
        if (textBeforeCursor && textBeforeCursor.endsWith('/')) {
           const rect = range.getBoundingClientRect();
           setSlashMenuPos({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
           setShowSlashMenu(true);
        } else {
           setShowSlashMenu(false);
        }
     }
  };

  const insertFormatting = (format) => {
     setShowSlashMenu(false);
     document.execCommand('delete', false); // removes the '/'
     if (format === 'h1') {
        document.execCommand('formatBlock', false, 'H1');
     } else if (format === 'p') {
        document.execCommand('formatBlock', false, 'P');
     }
     editorRef.current?.focus();
  };
  // --- AI API CALLS ---
  const handleSuggestTitle = async () => {
    if (!content || content.length < 20) {
      return setError('Please write some content first so AI can suggest a title.');
    }
    setAiLoading(prev => ({ ...prev, title: true }));
    setError('');
    try {
      const res = await api.post('/ai/title', { content });
      if (res.data.titles) {
        setSuggestedTitles(res.data.titles);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'AI Failed to suggest title');
    } finally {
      setAiLoading(prev => ({ ...prev, title: false }));
    }
  };

  const handleGenerateSummary = async () => {
    if (!content || content.length < 20) {
      return setError('Please write some content first so AI can summarize it.');
    }
    setAiLoading(prev => ({ ...prev, summary: true }));
    setError('');
    try {
      const res = await api.post('/ai/summary', { content });
      if (res.data.summary) {
        setDescription(res.data.summary);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'AI Failed to generate summary');
    } finally {
      setAiLoading(prev => ({ ...prev, summary: false }));
    }
  };

  const handleSuggestCategory = async () => {
    if (!content || content.length < 20) {
      return setError('Please write some content first so AI can suggest a category.');
    }
    setAiLoading(prev => ({ ...prev, category: true }));
    setError('');
    try {
      const res = await api.post('/ai/category', { content });
      const suggested = res.data.category;
      if (suggested) {
        const match = categories.find(c => c.name.toLowerCase() === suggested.toLowerCase());
        if (match) {
          setCategory(match._id);
        } else {
          setError(`AI suggested category '${suggested}' which is not in your list. Please select one manually.`);
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'AI Failed to suggest category');
    } finally {
      setAiLoading(prev => ({ ...prev, category: false }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || !category || !description) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    try {
      let dataToUpload = { title, description, content, category };
      let config = {};

      if (image) {
        dataToUpload = new FormData();
        dataToUpload.append('title', title);
        dataToUpload.append('description', description);
        dataToUpload.append('content', content);
        dataToUpload.append('category', category);
        dataToUpload.append('image', image);
        config.headers = { 'Content-Type': 'multipart/form-data' };
      }

      await api.post('/posts', dataToUpload, config);
      localStorage.removeItem('blog_draft');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto py-12 px-6 sm:px-8 w-full relative">
      <div className="flex justify-between items-center mb-8">
        <span className="text-sm text-[var(--muted)] flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> Draft Auto-saved
        </span>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="btn-primary btn-ripple px-6 py-2.5 rounded-full text-sm font-semibold disabled:opacity-50"
        >
          {loading ? 'Publishing...' : 'Publish'}
        </button>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
        {error && <div className="text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">{error}</div>}
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Title</label>
            <button 
              type="button" 
              onClick={handleSuggestTitle} 
              disabled={aiLoading.title}
              title="Suggest Title with AI"
              className="flex items-center justify-center w-8 h-8 text-[var(--accent)] hover:bg-[var(--accent-soft)] rounded-full transition-colors"
            >
              {aiLoading.title ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            </button>
          </div>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-5xl lg:text-6xl font-brand font-black placeholder-[var(--muted)] border-none focus:ring-0 p-0 bg-transparent text-[var(--ink)] leading-tight"
            autoFocus
          />
          {suggestedTitles.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {suggestedTitles.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => { setTitle(t); setSuggestedTitles([]); }}
                  className="px-3 py-1.5 text-xs bg-[var(--accent-soft)] text-[var(--accent)] rounded-full hover:opacity-80 transition-opacity whitespace-normal text-left"
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Description / Summary</label>
            <button 
              type="button" 
              onClick={handleGenerateSummary} 
              disabled={aiLoading.summary}
              title="Generate Summary with AI"
              className="flex items-center justify-center w-8 h-8 text-[var(--accent)] hover:bg-[var(--accent-soft)] rounded-full transition-colors"
            >
              {aiLoading.summary ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            </button>
          </div>
          <input
            type="text"
            placeholder="Write a short description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-xl text-[var(--muted)] placeholder-[var(--muted)] opacity-70 border-none focus:ring-0 p-0 bg-transparent font-medium"
            maxLength={500}
          />
        </div>

        <div className="flex gap-6 items-center border-y border-[var(--border)] py-6 flex-wrap">
          <div className="flex items-center gap-4">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] rounded-full px-4 py-2 text-sm shadow-sm focus:border-[var(--accent)] focus:ring-[var(--accent)] outline-none cursor-pointer"
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-[var(--muted)] whitespace-nowrap">Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="text-sm text-[var(--muted)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--accent-soft)] file:text-[var(--accent)] hover:file:bg-[var(--accent)] hover:file:text-white cursor-pointer transition-colors"
            />
          </div>
        </div>

        {/* Notion Style Editor */}
        <div className="min-h-[400px] relative mt-4">
          <div
             ref={editorRef}
             className="editor-notion"
             contentEditable
             data-placeholder="Press '/' for commands, or start typing..."
             onInput={handleEditorInput}
             suppressContentEditableWarning={true}
          />
        </div>

        {/* Slash Command Popover */}
        {showSlashMenu && (
           <div 
             className="editor-slash-menu"
             style={{ top: slashMenuPos.top + 20, left: slashMenuPos.left }}
           >
              <div className="px-3 py-2 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider border-b border-[var(--border)]">
                 Basic Blocks
              </div>
              <div className="slash-item" onMouseDown={(e) => { e.preventDefault(); insertFormatting('p'); }}>
                 <Type className="w-4 h-4" /> Text
              </div>
              <div className="slash-item" onMouseDown={(e) => { e.preventDefault(); insertFormatting('h1'); }}>
                 <Heading1 className="w-4 h-4" /> Heading 1
              </div>
              <div className="slash-item disabled opacity-50 cursor-not-allowed" title="Coming soon">
                 <ImageIcon className="w-4 h-4" /> Image
              </div>
              <div className="slash-item disabled opacity-50 cursor-not-allowed" title="Coming soon">
                 <Code className="w-4 h-4" /> Code Block
              </div>
           </div>
        )}
      </form>
    </main>
  );
};

export default CreatePost;
