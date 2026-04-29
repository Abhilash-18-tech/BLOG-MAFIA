import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';
import { io } from 'socket.io-client';
import { Send, Users, ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Chat = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  const socketBaseUrl = apiBaseUrl.replace(/\/api\/?$/, '');

  // Scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!user) return;

    // Connect to Socket.io once per user session
    socketRef.current = io(socketBaseUrl);
    
    // Join personal room for private DMs
    socketRef.current.emit('setup', user);

    // Listen for incoming direct messages
    socketRef.current.on('receive_message', (newMessage) => {
      setMessages((prev) => {
        if (prev.find(m => m._id === newMessage._id)) return prev;
        return [...prev, newMessage];
      });
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [user]); // Only depend on user avoiding infinite reconnects on route changes

  // Fetch contacts logic decoupled from socket
  useEffect(() => {
    if (!user) return;

    const fetchContacts = async () => {
      try {
        const res = await api.get('/chat/users');
        let fetchedContacts = res.data.data;
        
        const stateContact = location.state?.contact;
        if (stateContact) {
          const exists = fetchedContacts.find(c => c._id === stateContact._id);
          if (!exists) {
            fetchedContacts = [stateContact, ...fetchedContacts];
          }
          setContacts(fetchedContacts);
          loadConversation(stateContact);
        } else {
          setContacts(fetchedContacts);
        }
      } catch (err) {
        console.error('Failed to fetch contacts', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchContacts();
  }, [user, location.state]);

  const loadConversation = async (contact) => {
    if (!contact) return;
    setActiveContact(contact);
    try {
      const res = await api.get(`/chat/${contact._id}`);
      setMessages(res.data.data);
    } catch (err) {
      console.error('Failed to fetch messages', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !activeContact || !user) return;

    // Use proper Mongo _id if user object provides it under _id or id
    const authId = user._id || user.id;

    const messageData = {
      senderId: authId,
      receiverId: activeContact._id,
      text: messageText,
    };

    // Optimistically update UI so sender sees the message instantly without waiting for a bounce back
    const optimisticMsg = {
      _id: Date.now().toString(),
      sender: authId, 
      receiver: activeContact._id,
      text: messageText,
      createdAt: new Date().toISOString()
    };
    
    setMessages((prev) => [...prev, optimisticMsg]);
    setMessageText('');

    // Emit to socket server directly, server handles DB saving
    socketRef.current.emit('send_message', messageData);
  };

  if (loading) return <div className="text-center pt-20">Loading chats...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 h-[calc(100vh-80px)]">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl shadow-sm h-full flex overflow-hidden">
        
        {/* Left Sidebar (Contacts) */}
        <div className={`w-full md:w-1/3 border-r border-[var(--border)] flex flex-col ${activeContact ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-6 border-b border-[var(--border)] flex justify-between items-center">
            <h2 className="text-2xl font-brand font-bold text-[var(--ink)]">Messages</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {contacts.length === 0 ? (
               <div className="text-center text-[var(--muted)] pt-10 px-4">
                 <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                 <p>No contacts yet.</p>
                 <p className="text-sm mt-2">Follow users to start chatting with them.</p>
               </div>
            ) : (
              contacts.map(contact => (
                <button
                  key={contact._id}
                  onClick={() => loadConversation(contact)}
                  className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all ${
                    activeContact?._id === contact._id 
                      ? 'bg-[var(--accent-soft)] outline outline-[var(--accent)] outline-1' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {contact.username?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="text-left flex-1 overflow-hidden">
                    <p className="font-semibold text-[var(--ink)] truncate">{contact.username}</p>
                    <p className="text-sm text-[var(--muted)] truncate">Click to chat</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Chat Panel */}
        <div className={`w-full md:w-2/3 flex flex-col bg-white ${!activeContact ? 'hidden md:flex' : 'flex'}`}>
          {!activeContact ? (
             <div className="flex-1 flex flex-col items-center justify-center text-[var(--muted)]">
                 <MessageCircle className="w-16 h-16 opacity-10 mb-4" />
                 <p className="text-lg">Select a conversation to start chatting</p>
             </div>
          ) : (
             <>
               {/* Chat Header */}
               <div className="p-6 border-b border-[var(--border)] flex items-center gap-4 bg-[var(--surface)]">
                 <button onClick={() => setActiveContact(null)} className="md:hidden text-[var(--muted)] hover:text-black">
                   <ArrowLeft className="w-6 h-6" />
                 </button>
                 <div className="w-10 h-10 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-bold">
                    {activeContact.username?.charAt(0).toUpperCase() || '?'}
                 </div>
                 <h3 className="text-lg font-bold text-[var(--ink)]">{activeContact.username}</h3>
               </div>

               {/* Messages History */}
               <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                 {messages.length === 0 ? (
                   <p className="text-center text-[var(--muted)] pt-10">Say hi to {activeContact.username}!</p>
                 ) : (
                   messages.map(msg => {
                     const currentUserId = user._id || user.id;
                     const isMine = msg.sender === currentUserId || msg.sender?._id === currentUserId;
                     return (
                       <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                         <div className={`max-w-[70%] p-4 rounded-2xl ${
                           isMine 
                             ? 'bg-[var(--ink)] text-white rounded-br-sm' 
                             : 'bg-white border border-[var(--border)] text-[var(--ink)] rounded-bl-sm shadow-sm'
                         }`}>
                           <p style={{ wordBreak: 'break-word' }}>{msg.text}</p>
                           <span className={`text-[10px] block mt-1 ${isMine ? 'text-white/70' : 'text-gray-400'}`}>
                             {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                           </span>
                         </div>
                       </div>
                     );
                   })
                 )}
                 <div ref={messagesEndRef} />
               </div>

               {/* Chat Input */}
               <div className="p-4 bg-white border-t border-[var(--border)]">
                 <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                   <input
                     type="text"
                     placeholder="Message..."
                     value={messageText}
                     onChange={(e) => setMessageText(e.target.value)}
                     className="flex-1 bg-gray-100/50 border border-[var(--border)] rounded-full px-5 py-3 outline-none focus:border-[var(--accent)] transition-colors"
                     required
                   />
                   <button 
                     type="submit" 
                     disabled={!messageText.trim()}
                     className="w-12 h-12 rounded-full bg-[var(--ink)] hover:bg-black text-white flex items-center justify-center flex-shrink-0 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     <Send className="w-5 h-5 ml-1" />
                   </button>
                 </form>
               </div>
             </>
          )}
        </div>

      </div>
    </div>
  );
};

// Add missing icon import fallback that might occur
const MessageCircle = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
);

export default Chat;