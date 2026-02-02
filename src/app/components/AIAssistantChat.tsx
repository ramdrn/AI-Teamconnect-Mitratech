import { useState, useRef, useEffect } from 'react';
import { X, Send, Paperclip, Sparkles, Upload, FileText, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  documents?: ClassifiedDocument[];
  summary?: DocumentSummary;
}

interface ClassifiedDocument {
  name: string;
  matter: string;
  folder: string;
  confidence: 'High' | 'Medium' | 'Low';
  size: string;
  type: string;
}

interface DocumentSummary {
  title: string;
  date: string;
  parties: string;
  keyPoints: string[];
  deadline?: string;
  recommendation?: string;
}

interface AIAssistantChatProps {
  isOpen: boolean;
  onClose: () => void;
  currentMatter: string;
  onDocumentsClassified?: (documents: ClassifiedDocument[]) => void;
}

export function AIAssistantChat({ isOpen, onClose, currentMatter, onDocumentsClassified }: AIAssistantChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI Document Assistant. I can help you upload, classify, and manage documents for your matters. How can I assist you today?",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [pendingClassifications, setPendingClassifications] = useState<ClassifiedDocument[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const simulateAIResponse = (content: string, documents?: ClassifiedDocument[], summary?: DocumentSummary) => {
    setIsTyping(true);
    
    setTimeout(() => {
      const newMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content,
        timestamp: new Date(),
        documents,
        summary,
      };
      
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
      
      if (documents) {
        setPendingClassifications(documents);
      }
    }, 1500);
  };

  const classifyDocument = (fileName: string, size: number): ClassifiedDocument => {
    const lowerName = fileName.toLowerCase();
    
    // Pattern matching for classification
    let folder = 'General';
    let confidence: 'High' | 'Medium' | 'Low' = 'Medium';
    let matter = currentMatter;

    if (lowerName.includes('settlement') || lowerName.includes('offer')) {
      folder = 'Negotiations';
      confidence = 'High';
    } else if (lowerName.includes('motion') || lowerName.includes('pleading') || lowerName.includes('complaint')) {
      folder = 'Pleadings';
      confidence = 'High';
    } else if (lowerName.includes('discovery') || lowerName.includes('interrogator') || lowerName.includes('deposition')) {
      folder = 'Discovery';
      confidence = 'High';
    } else if (lowerName.includes('correspondence') || lowerName.includes('letter') || lowerName.includes('email')) {
      folder = 'Correspondence';
      confidence = 'Medium';
    } else if (lowerName.includes('evidence') || lowerName.includes('photo') || lowerName.includes('exhibit')) {
      folder = 'Evidence';
      confidence = 'High';
    } else if (lowerName.includes('contract') || lowerName.includes('agreement')) {
      folder = 'Contracts';
      confidence = 'High';
    } else {
      confidence = 'Low';
    }

    // Determine matter based on filename
    if (lowerName.includes('smith') || lowerName.includes('jones')) {
      matter = 'Matter #45892 - Smith v. Jones';
    } else if (lowerName.includes('pritchett') || lowerName.includes('dunphy')) {
      matter = 'Matter #000051 - Mitchell Pritchett v Phil Dunphy';
    } else if (lowerName.includes('wilson')) {
      matter = 'Matter #38471 - Wilson Case';
    }

    return {
      name: fileName,
      matter,
      folder,
      confidence,
      size: `${(size / 1024).toFixed(2)} KB`,
      type: fileName.split('.').pop()?.toUpperCase() || 'FILE',
    };
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: `Uploading ${files.length} document${files.length > 1 ? 's' : ''}...`,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);

    const classifiedDocs = Array.from(files).map(file => 
      classifyDocument(file.name, file.size)
    );

    const response = `I've analyzed ${files.length} document${files.length > 1 ? 's' : ''}. Here's what I found:`;
    
    simulateAIResponse(response, classifiedDocs);
  };

  const handleExampleUpload = () => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: 'Upload example documents',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);

    // Create example documents
    const exampleDocs: ClassifiedDocument[] = [
      {
        name: 'Settlement_Offer_Smith_v_Jones.pdf',
        matter: 'Matter #45892 - Smith v. Jones',
        folder: 'Negotiations',
        confidence: 'High',
        size: '245.67 KB',
        type: 'PDF',
      },
      {
        name: 'Discovery_Response_Wilson_Case.docx',
        matter: 'Matter #38471 - Wilson Case',
        folder: 'Discovery',
        confidence: 'High',
        size: '128.34 KB',
        type: 'DOCX',
      },
      {
        name: 'Motion_to_Dismiss_Pritchett.pdf',
        matter: 'Matter #000051 - Mitchell Pritchett v Phil Dunphy',
        folder: 'Pleadings',
        confidence: 'High',
        size: '312.89 KB',
        type: 'PDF',
      },
      {
        name: 'Evidence_Photos_Dunphy_Matter.zip',
        matter: 'Matter #000051 - Mitchell Pritchett v Phil Dunphy',
        folder: 'Evidence',
        confidence: 'High',
        size: '1024.56 KB',
        type: 'ZIP',
      },
      {
        name: 'Correspondence_OpposingCounsel.pdf',
        matter: 'Matter #000051 - Mitchell Pritchett v Phil Dunphy',
        folder: 'Correspondence',
        confidence: 'Medium',
        size: '89.23 KB',
        type: 'PDF',
      },
    ];

    const response = `I've analyzed 5 example documents. Here's what I found:`;
    
    simulateAIResponse(response, exampleDocs);
  };

  const handleAcceptAll = () => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: 'Accept all classifications',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setPendingClassifications([]);

    if (onDocumentsClassified) {
      onDocumentsClassified(pendingClassifications);
    }

    simulateAIResponse(
      `Great! All ${pendingClassifications.length} documents have been uploaded successfully. Would you like me to summarize any of them?`
    );
  };

  const handleSummarize = (docName: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: `Summarize the ${docName}`,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);

    let summary: DocumentSummary;

    if (docName.toLowerCase().includes('settlement')) {
      summary = {
        title: 'Settlement Offer - Smith v. Jones',
        date: 'January 15, 2026',
        parties: 'Smith (Plaintiff) vs. Jones (Defendant)',
        keyPoints: [
          'Offer Amount: $125,000 to settle all claims',
          'Full release of liability included',
          'Confidentiality clause required',
          '30-day acceptance deadline',
        ],
        deadline: 'February 14, 2026',
        recommendation: 'Review with client before deadline. Consider counter-offer if amount below expectations.',
      };
    } else if (docName.toLowerCase().includes('motion')) {
      summary = {
        title: 'Motion to Dismiss - Pritchett v. Dunphy',
        date: 'January 28, 2026',
        parties: 'Mitchell Pritchett (Plaintiff) vs. Phil Dunphy (Defendant)',
        keyPoints: [
          'Motion filed by defendant to dismiss case',
          'Claims lack of subject matter jurisdiction',
          'Cites procedural deficiencies in complaint',
          'Response due within 21 days',
        ],
        deadline: 'February 18, 2026',
        recommendation: 'Prepare opposition brief addressing jurisdictional arguments. Consult case law on similar matters.',
      };
    } else {
      summary = {
        title: `Document Summary - ${docName}`,
        date: 'February 2, 2026',
        parties: 'Multiple parties',
        keyPoints: [
          'Document contains important case information',
          'Multiple references to key dates and events',
          'Requires attorney review',
        ],
        recommendation: 'Review document for critical details and deadlines.',
      };
    }

    simulateAIResponse('', undefined, summary);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    const lowerInput = inputValue.toLowerCase();
    
    // Handle different queries
    if (lowerInput.includes('status') && lowerInput.includes('matter')) {
      simulateAIResponse(
        `Matter #000051 - Mitchell Pritchett v Phil Dunphy\n\nStatus: Active - Discovery Phase\nNext Deadline: Motion response due February 18, 2026\nDocuments: 12 total (5 pleadings, 3 discovery, 2 correspondence, 2 evidence)\nLast Activity: Motion to Dismiss filed on January 28, 2026\n\nWould you like more details on any specific aspect?`
      );
    } else if (lowerInput.includes('summarize') || lowerInput.includes('summary')) {
      const docToSummarize = pendingClassifications[0]?.name || 'settlement offer';
      handleSummarize(docToSummarize);
      setInputValue('');
      return;
    } else if (lowerInput.includes('find') || lowerInput.includes('search')) {
      simulateAIResponse(
        `I found 3 discovery documents from last month:\n\n1. Discovery_Response_Wilson_Case.docx (Jan 15)\n2. Interrogatories_Response_Pritchett.pdf (Jan 22)\n3. Document_Production_Request.pdf (Jan 28)\n\nWould you like me to open any of these documents?`
      );
    } else if (lowerInput.includes('upload') || lowerInput.includes('add')) {
      simulateAIResponse(
        'I can help you upload documents. Please click the attachment icon below or use the "Upload Example Documents" button to get started.'
      );
    } else {
      simulateAIResponse(
        `I understand you're asking about "${inputValue}". I can help with:\n\n• Uploading and classifying documents\n• Checking matter status\n• Summarizing documents\n• Finding related documents\n• Setting deadline reminders\n\nWhat would you like to do?`
      );
    }
    
    setInputValue('');
  };

  const handleQuickAction = (action: string) => {
    if (action === 'upload') {
      handleExampleUpload();
    } else if (action === 'status') {
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: 'Check matter status',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
      
      simulateAIResponse(
        `Matter #000051 - Mitchell Pritchett v Phil Dunphy\n\nStatus: Active - Discovery Phase\nNext Deadline: Motion response due February 18, 2026\nDocuments: 12 total\nLast Activity: Motion to Dismiss filed on January 28, 2026`
      );
    } else if (action === 'summary') {
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: 'Get matter summary',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
      
      simulateAIResponse(
        `**Matter Summary**\n\nCase: Mitchell Pritchett v Phil Dunphy\nMatter #: 000051\nPhase: Discovery\n\nRecent Activity:\n• Motion to Dismiss filed (Jan 28)\n• Settlement discussions ongoing\n• Discovery responses pending\n\nAction Items:\n• Respond to motion by Feb 18\n• Review settlement offer\n• Complete discovery responses`
      );
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'High': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Low': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getConfidenceIcon = (confidence: string) => {
    switch (confidence) {
      case 'High': return <CheckCircle2 className="w-4 h-4" />;
      case 'Medium': return <AlertCircle className="w-4 h-4" />;
      case 'Low': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="bg-[#2D7FF9] text-white p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <div>
            <h2 className="font-semibold text-lg">AI Document Assistant</h2>
            <p className="text-xs text-blue-100 truncate max-w-[280px]">{currentMatter}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Actions */}
      <div className="p-3 bg-gray-50 border-b border-gray-200 shrink-0">
        <div className="flex gap-2">
          <button
            onClick={() => handleQuickAction('upload')}
            className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-xs font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
          >
            <Upload className="w-3 h-3" />
            Upload Docs
          </button>
          <button
            onClick={() => handleQuickAction('status')}
            className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-xs font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
          >
            <FileText className="w-3 h-3" />
            Status
          </button>
          <button
            onClick={() => handleQuickAction('summary')}
            className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-xs font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            Summary
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-[#E8F2FF] text-[#1e2939]'
                  : 'bg-white border border-gray-200 text-[#1e2939]'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              
              {/* Document Classifications */}
              {message.documents && message.documents.length > 0 && (
                <div className="mt-3 space-y-2">
                  {message.documents.map((doc, index) => (
                    <div key={index} className="bg-gray-50 rounded p-3 border border-gray-200">
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 text-[#2D7FF9] mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-[#1e2939] truncate">{doc.name}</p>
                          <p className="text-xs text-[#6a7282] mt-0.5">→ {doc.matter}</p>
                          <p className="text-xs text-[#6a7282]">→ Folder: <span className="font-medium">{doc.folder}</span></p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${getConfidenceColor(doc.confidence)}`}>
                              {getConfidenceIcon(doc.confidence)}
                              {doc.confidence}
                            </span>
                            <span className="text-xs text-[#6a7282]">{doc.size}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={handleAcceptAll}
                      className="flex-1 px-3 py-2 bg-[#2D7FF9] text-white rounded text-xs font-medium hover:bg-[#1e6fd9] transition-colors"
                    >
                      Accept All
                    </button>
                    <button
                      onClick={() => setPendingClassifications([])}
                      className="px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded text-xs font-medium hover:bg-gray-50 transition-colors"
                    >
                      Review
                    </button>
                  </div>
                </div>
              )}

              {/* Document Summary */}
              {message.summary && (
                <div className="mt-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-sm text-[#1e2939] mb-2">{message.summary.title}</h4>
                  <div className="space-y-2 text-xs">
                    <p><span className="font-medium">Date:</span> {message.summary.date}</p>
                    <p><span className="font-medium">Parties:</span> {message.summary.parties}</p>
                    
                    <div>
                      <p className="font-medium mb-1">Key Points:</p>
                      <ul className="list-disc list-inside space-y-1 text-[#4a5565]">
                        {message.summary.keyPoints.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    </div>
                    
                    {message.summary.deadline && (
                      <p className="bg-yellow-100 border border-yellow-300 rounded px-2 py-1">
                        <span className="font-medium">⏰ Deadline:</span> {message.summary.deadline}
                      </p>
                    )}
                    
                    {message.summary.recommendation && (
                      <div className="bg-blue-100 border border-blue-300 rounded px-2 py-1">
                        <p className="font-medium">💡 Recommendation:</p>
                        <p className="text-[#4a5565] mt-1">{message.summary.recommendation}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <p className="text-xs text-gray-400 mt-2">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg p-3 max-w-[85%]">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-[#2D7FF9] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-[#2D7FF9] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-[#2D7FF9] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white shrink-0">
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg,.zip"
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Upload documents"
          >
            <Paperclip className="w-5 h-5 text-[#6a7282]" />
          </button>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me anything..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2D7FF9] focus:border-transparent text-sm"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="p-2 bg-[#2D7FF9] text-white rounded hover:bg-[#1e6fd9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
