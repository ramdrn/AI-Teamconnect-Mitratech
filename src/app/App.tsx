import { useState } from 'react';
import { Bookmark, Clock, List, Settings, HelpCircle, User, ChevronDown, Search, Menu, ChevronLeft, Upload, Download, Edit, Trash2, Share2, Printer, FileText, MoreHorizontal, Sparkles } from 'lucide-react';
import { AIAssistantChat } from '@/app/components/AIAssistantChat';

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('Documents');
  const [isDragging, setIsDragging] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [documents, setDocuments] = useState<Array<{
    id: string;
    name: string;
    size: string;
    author: string;
    modifiedOn: string;
    checkedOutBy: string;
  }>>([]);

  const mainNavItems = [
    'Home', 'Home', 'Contacts', 'Matters', 'Financials', 'CSM', 
    'Calendar & Tasks', 'Documents', 'SOP', 'TAP', 'Reports', 
    'Invoice IQ', 'Questions', 'Admin'
  ];

  const sidebarItems = [
    'General',
    'Parties',
    'Tasks & Appointments',
    'Documents',
    'Narratives',
    'Financials',
    'Deadlines',
    'Resolution',
    'Cost Centers',
    'Supplemental',
    'Related Advice & Matters',
    'Security',
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file upload logic here
    const files = Array.from(e.dataTransfer.files);
    console.log('Files dropped:', files);
    
    // Add files to documents list
    const newDocs = files.map((file, index) => ({
      id: `doc-${Date.now()}-${index}`,
      name: file.name,
      size: `${(file.size / 1024).toFixed(2)} KB`,
      author: 'Brad',
      modifiedOn: new Date().toLocaleDateString('en-US', { 
        month: '2-digit', 
        day: '2-digit', 
        year: 'numeric' 
      }),
      checkedOutBy: '-'
    }));
    
    setDocuments(prev => [...prev, ...newDocs]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const newDocs = Array.from(files).map((file, index) => ({
      id: `doc-${Date.now()}-${index}`,
      name: file.name,
      size: `${(file.size / 1024).toFixed(2)} KB`,
      author: 'Brad',
      modifiedOn: new Date().toLocaleDateString('en-US', { 
        month: '2-digit', 
        day: '2-digit', 
        year: 'numeric' 
      }),
      checkedOutBy: '-'
    }));
    
    setDocuments(prev => [...prev, ...newDocs]);
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  return (
    <div className="h-screen flex flex-col bg-[#f5f6f8]">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-[#d1d5dc] px-6 py-3 flex items-center justify-between shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-[#2D7FF9] w-8 h-8 rounded flex items-center justify-center">
            <div className="grid grid-cols-2 grid-rows-2 gap-0.5 w-5 h-5">
              <div className="bg-white rounded-sm"></div>
              <div className="bg-white rounded-sm"></div>
              <div className="bg-white rounded-sm"></div>
              <div className="bg-white rounded-sm"></div>
            </div>
          </div>
          <h1 className="text-xl font-semibold">
            <span className="text-[#1e2939]">Team</span>
            <span className="text-[#6a7282] font-normal">Connect</span>
          </h1>
        </div>

        {/* Center Search */}
        <div className="flex items-center gap-4 flex-1 max-w-[600px] mx-auto">
          <div className="relative">
            <select className="appearance-none bg-white border border-[#d1d5dc] rounded px-3 py-1.5 pr-8 text-sm font-medium text-[#364153]">
              <option>Matters</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#364153] pointer-events-none" />
          </div>
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-white border border-[#d1d5dc] rounded px-3 py-1.5 pr-9 text-sm placeholder:text-[rgba(10,10,10,0.5)]"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6a7282]" />
          </div>
          
          {/* AI Assistant Button */}
          <button 
            onClick={() => setShowAIAssistant(!showAIAssistant)}
            className="relative flex items-center gap-2 px-3 py-1.5 bg-white border border-[#d1d5dc] rounded hover:bg-[#E8F2FF] hover:border-[#2D7FF9] transition-all duration-200 shadow-sm group"
          >
            <Sparkles className="w-4 h-4 text-[#2D7FF9] group-hover:animate-pulse" />
            <span className="text-sm font-medium text-[#364153] whitespace-nowrap">AI Assistant</span>
            {/* New Badge */}
            <span className="absolute -top-1 -right-1 bg-[#2D7FF9] text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-full">
              New
            </span>
          </button>
          
          <button className="p-1.5 hover:bg-gray-100 rounded">
            <HelpCircle className="w-5 h-5 text-[#6a7282]" />
          </button>
        </div>

        {/* Right Utilities */}
        <div className="flex items-center gap-2">
          <button className="flex flex-col items-center p-2 hover:bg-gray-50 rounded text-xs text-[#4a5565]">
            <Bookmark className="w-5 h-5 mb-0.5 text-[#6a7282]" />
            <span className="text-[11px]">Bookmarks</span>
          </button>
          <button className="flex flex-col items-center p-2 hover:bg-gray-50 rounded text-xs text-[#4a5565]">
            <Clock className="w-5 h-5 mb-0.5 text-[#6a7282]" />
            <span className="text-[11px]">Recent</span>
          </button>
          <button className="flex flex-col items-center p-2 hover:bg-gray-50 rounded text-xs text-[#4a5565]">
            <List className="w-5 h-5 mb-0.5 text-[#6a7282]" />
            <span className="text-[11px]">All</span>
          </button>
          <button className="flex flex-col items-center p-2 hover:bg-gray-50 rounded text-xs text-[#4a5565]">
            <Settings className="w-5 h-5 mb-0.5 text-[#6a7282]" />
            <span className="text-[11px]">Tools</span>
          </button>
          <button className="flex flex-col items-center p-2 hover:bg-gray-50 rounded text-xs text-[#4a5565]">
            <HelpCircle className="w-5 h-5 mb-0.5 text-[#6a7282]" />
            <span className="text-[11px]">Help</span>
          </button>
          <button className="flex flex-col items-center p-2 hover:bg-gray-50 rounded text-xs text-[#4a5565]">
            <Settings className="w-5 h-5 mb-0.5 text-[#6a7282]" />
            <span className="text-[11px]">Setup</span>
          </button>
          <button className="flex flex-col items-center p-2 hover:bg-gray-50 rounded text-xs text-[#4a5565]">
            <User className="w-5 h-5 mb-0.5 text-[#6a7282]" />
            <span className="text-[11px]">Brad</span>
          </button>
          <button className="p-2 hover:bg-gray-50 rounded">
            <ChevronDown className="w-5 h-5 text-[#6a7282]" />
          </button>
        </div>
      </header>

      {/* Secondary Navigation */}
      <nav className="bg-[#2D7FF9] px-4 py-0 flex items-center gap-1 shrink-0">
        <button className="flex items-center gap-2 px-3 py-2 text-white hover:bg-[rgba(255,255,255,0.1)] rounded">
          <Menu className="w-4 h-4" />
          <span className="text-sm font-medium">Home</span>
        </button>
        {mainNavItems.slice(1).map((item, index) => (
          <button
            key={index}
            className="px-3 py-2 text-white hover:bg-[rgba(255,255,255,0.1)] rounded text-sm font-medium whitespace-nowrap"
          >
            {item}
          </button>
        ))}
      </nav>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside
          className={`bg-[#f0f1f3] border-r border-[#d1d5dc] transition-all duration-300 ${
            sidebarCollapsed ? 'w-12' : 'w-64'
          } shrink-0 flex flex-col`}
        >
          <div className="p-4 border-b border-[#d1d5dc]">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="flex items-center gap-2 text-sm text-[#4a5565] hover:text-[#2D7FF9]"
            >
              <Menu className="w-4 h-4" />
              {!sidebarCollapsed && <span>Collapse All</span>}
            </button>
          </div>

          {!sidebarCollapsed && (
            <>
              <div className="px-4 py-3 bg-[#e5e7eb]">
                <p className="text-xs font-medium text-[#4a5565] leading-tight">
                  Matter - 000051-Mitchell Pritchett v Phil Dunphy
                </p>
              </div>

              <nav className="flex-1 overflow-y-auto py-2">
                {sidebarItems.map((item) => (
                  <button
                    key={item}
                    onClick={() => setActiveTab(item)}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      activeTab === item
                        ? 'bg-[#dbeafe] text-[#2D7FF9] border-l-4 border-[#2D7FF9]'
                        : 'text-[#4a5565] hover:bg-[#e5e7eb]'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </nav>
            </>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Breadcrumb */}
          <div className="mb-4">
            <button className="flex items-center gap-1 text-sm text-[#2D7FF9] hover:underline">
              <ChevronLeft className="w-4 h-4" />
              Back to Matters
            </button>
          </div>

          {/* Page Header */}
          <div className="bg-white rounded-lg shadow-sm border border-[#d1d5dc] mb-6">
            <div className="p-6 border-b border-[#d1d5dc]">
              <h2 className="text-xl font-semibold text-[#1e2939] mb-4">
                Matter - 000051-Mitchell Pritchett v Phil Dunphy
              </h2>
              <div className="flex flex-wrap gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#d1d5dc] rounded hover:bg-gray-50 text-sm">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#d1d5dc] rounded hover:bg-gray-50 text-sm">
                  <FileText className="w-4 h-4" />
                  Create a Copy
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#d1d5dc] rounded hover:bg-gray-50 text-sm">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
                <button className="px-3 py-1.5 bg-white border border-[#d1d5dc] rounded hover:bg-gray-50 text-sm">
                  Change Phase
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#d1d5dc] rounded hover:bg-gray-50 text-sm">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#d1d5dc] rounded hover:bg-gray-50 text-sm">
                  <Printer className="w-4 h-4" />
                  Printable View
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#d1d5dc] rounded hover:bg-gray-50 text-sm">
                  <HelpCircle className="w-4 h-4" />
                  Help
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#d1d5dc] rounded hover:bg-gray-50 text-sm">
                  <Bookmark className="w-4 h-4" />
                  Add Bookmark
                </button>
              </div>
            </div>

            {/* Documents Section */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-[#1e2939] mb-2">Documents</h3>
              <p className="text-sm text-[#6a7282] mb-6">
                Location: <span className="text-[#2D7FF9]">Attachments</span>
              </p>

              {/* Upload Area */}
              <div
                className={`border-2 border-dashed border-[#d1d5dc] rounded-lg p-8 mb-6 bg-[#fafbfc] hover:border-[#2D7FF9] transition-colors ${
                  isDragging ? 'border-[#2D7FF9] bg-blue-50' : ''
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center justify-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2 bg-white border border-[#d1d5dc] rounded hover:bg-gray-50 text-sm font-medium cursor-pointer">
                    <Upload className="w-4 h-4" />
                    Intelligent Upload
                    <input 
                      type="file" 
                      multiple 
                      onChange={handleFileUpload} 
                      className="hidden" 
                    />
                  </label>
                  <p className="text-sm text-[#6a7282]">Drop files here to upload</p>
                </div>
              </div>

              {/* Document Toolbar */}
              <div className="bg-[#2D7FF9] rounded-t-lg px-4 py-2 flex items-center gap-3">
                <button className="p-1.5 hover:bg-[rgba(255,255,255,0.1)] rounded">
                  <Download className="w-4 h-4 text-white" />
                </button>
                <button className="p-1.5 hover:bg-[rgba(255,255,255,0.1)] rounded">
                  <Upload className="w-4 h-4 text-white" />
                </button>
                <button className="p-1.5 hover:bg-[rgba(255,255,255,0.1)] rounded">
                  <Edit className="w-4 h-4 text-white" />
                </button>
                <button className="p-1.5 hover:bg-[rgba(255,255,255,0.1)] rounded">
                  <FileText className="w-4 h-4 text-white" />
                </button>
                <button className="p-1.5 hover:bg-[rgba(255,255,255,0.1)] rounded">
                  <Share2 className="w-4 h-4 text-white" />
                </button>
                <button className="p-1.5 hover:bg-[rgba(255,255,255,0.1)] rounded">
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
                <button className="p-1.5 hover:bg-[rgba(255,255,255,0.1)] rounded">
                  <Printer className="w-4 h-4 text-white" />
                </button>
                <button className="p-1.5 hover:bg-[rgba(255,255,255,0.1)] rounded">
                  <MoreHorizontal className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Document Table */}
              <div className="border border-[#d1d5dc] rounded-b-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 text-xs text-[#6a7282]">
                  Documents: {documents.length > 0 ? `1 - ${documents.length} of ${documents.length}` : '0 - 0 of 0'}
                </div>
                <table className="w-full">
                  <thead className="bg-[#f9fafb] border-b border-[#d1d5dc]">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#4a5565]">Action</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#4a5565]">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#4a5565]">File Size</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#4a5565]">Author</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#4a5565]">Modified On</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#4a5565]">Checked Out By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc, index) => (
                      <tr key={doc.id} className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                        <td className="px-4 py-3 text-sm text-[#6a7282]">
                          <button className="p-1.5 hover:bg-gray-200 rounded transition-colors" onClick={() => handleDeleteDocument(doc.id)}>
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </td>
                        <td className="px-4 py-3 text-sm text-[#1e2939] font-medium">{doc.name}</td>
                        <td className="px-4 py-3 text-sm text-[#6a7282]">{doc.size}</td>
                        <td className="px-4 py-3 text-sm text-[#6a7282]">{doc.author}</td>
                        <td className="px-4 py-3 text-sm text-[#6a7282]">{doc.modifiedOn}</td>
                        <td className="px-4 py-3 text-sm text-[#6a7282]">{doc.checkedOutBy}</td>
                      </tr>
                    ))}
                    {documents.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-16 text-center text-sm text-[#6a7282]">
                          No documents available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className="bg-white px-4 py-3 border-t border-[#d1d5dc] flex justify-end items-center gap-2">
                  <span className="text-sm text-[#6a7282]">Documents per page:</span>
                  <select className="border border-[#d1d5dc] rounded px-2 py-1 text-sm">
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* AI Assistant Chat */}
      <AIAssistantChat 
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        currentMatter="Matter #000051 - Mitchell Pritchett v Phil Dunphy"
        onDocumentsClassified={(docs) => {
          // Add classified documents to the main document list
          const newDocs = docs.map((doc, index) => ({
            id: `doc-${Date.now()}-${index}`,
            name: doc.name,
            size: doc.size,
            author: 'Brad',
            modifiedOn: new Date().toLocaleDateString('en-US', { 
              month: '2-digit', 
              day: '2-digit', 
              year: 'numeric' 
            }),
            checkedOutBy: '-'
          }));
          setDocuments(prev => [...prev, ...newDocs]);
        }}
      />
    </div>
  );
}