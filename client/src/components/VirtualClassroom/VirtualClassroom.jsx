import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, Mic, MicOff, VideoOff, Play, Send, CheckCircle2, 
  Terminal, Sparkles, MessageSquare, PhoneOff, Share2, Layers, Award,
  Printer, X, Star, ShieldCheck, Download, Copy, RefreshCw, 
  HelpCircle, Bug, Lightbulb, Code2, Volume2, Flag, Square,
  Check, ChevronRight, Zap, BookOpen, Wand2, Globe, Key, LogIn
} from 'lucide-react';
import { api } from '../../services/api';
import { pythonRunner } from '../../services/pythonRunner';
import { soundEffects } from '../../utils/audioEffects';
import { useAuth } from '../../services/authContext';
import { generateWithGemini } from '../../services/firebase';
import { queryKnowledgeCore, getStoredGeminiKey, setStoredGeminiKey } from '../../services/kodaAiEngine';

// Helper to render formatted Markdown in Koda AI chat (bolds, code badges, lists, headings)
function renderInlineMarkdown(str) {
  if (!str) return '';
  const parts = str.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} style={{ color: '#f8fafc', fontWeight: 800 }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={index} style={{
          background: '#0f172a',
          color: '#38bdf8',
          padding: '1px 5px',
          borderRadius: '4px',
          fontSize: '11px',
          fontFamily: 'var(--font-mono)'
        }}>
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

function renderKodaMessage(content) {
  if (!content) return null;
  const lines = content.split('\n');
  return lines.map((line, idx) => {
    const trimmed = line.trim();

    // Headings
    if (trimmed.startsWith('### ') || trimmed.startsWith('## ')) {
      const heading = trimmed.replace(/^#{2,3}\s+/, '');
      return (
        <div key={idx} style={{ fontWeight: 800, fontSize: '13px', color: '#38bdf8', marginTop: '8px', marginBottom: '4px' }}>
          {renderInlineMarkdown(heading)}
        </div>
      );
    }

    // Bullet points
    if (trimmed.startsWith('•') || trimmed.startsWith('-') || /^\d+\.\s/.test(trimmed)) {
      const bulletText = trimmed.replace(/^[•\-]\s*/, '').replace(/^\d+\.\s*/, '');
      return (
        <div key={idx} style={{ paddingLeft: '8px', marginBottom: '3px', display: 'flex', gap: '6px' }}>
          <span style={{ color: '#38bdf8', flexShrink: 0 }}>•</span>
          <span style={{ flex: 1 }}>{renderInlineMarkdown(bulletText)}</span>
        </div>
      );
    }

    // Empty lines
    if (!trimmed) {
      return <div key={idx} style={{ height: '6px' }} />;
    }

    return (
      <div key={idx} style={{ marginBottom: '2px', lineHeight: 1.5 }}>
        {renderInlineMarkdown(line)}
      </div>
    );
  });
}

// Starter Project Templates
const CODE_TEMPLATES = {
  space: {
    name: '🚀 Space Adventure Quest',
    code: `# Codeyoung 1:1 Live Trial Class Project
# Building a Space Adventure Quest!

player_name = "Young Innovator"
energy = 100
level = 1

print(f"🚀 Welcome to Space Academy, {player_name}!")

def explore_alien_planet(planet_name):
    global energy, level
    print(f"🛸 Scanning strange surface of {planet_name}...")
    energy -= 15
    level += 1
    print(f"✨ Level Up! Current Level: {level} | Energy: {energy}")

# Explore cosmic destinations
destinations = ["Mars Outpost", "Europa Ocean", "Titan Nebula"]
for planet in destinations:
    explore_alien_planet(planet)

print(f"🎉 Mission Complete! Reached Level {level} with {energy}% energy!")
`
  },
  guessing: {
    name: '🎮 Secret Number Game',
    code: `# 🎮 Secret Number Guessing Game
import random

secret_number = 7
print("🎲 Welcome to the Codeyoung Mystery Number Game!")
print("The mentor has picked a secret number between 1 and 10.")

guesses = [3, 9, 7]
for guess in guesses:
    print(f"🤔 Testing guess: {guess}")
    if guess < secret_number:
        print("⬆️ Too low! Aim higher!")
    elif guess > secret_number:
        print("⬇️ Too high! Aim lower!")
    else:
        print(f"🎯 BINGO! {guess} is the correct number! 🏆")
        break
`
  },
  fireworks: {
    name: '🌟 Star Fireworks Pattern',
    code: `# 🌟 Star Fireworks Pattern Generator
print("🎆 Initiating Cosmic Fireworks Pattern...")

symbols = ["⭐", "✨", "🚀", "🪐", "💎"]
for i in range(1, 6):
    line = ""
    for j in range(i):
        line += symbols[j % len(symbols)] + " "
    print(line)

print("✨ Beautiful galaxy pattern generated with nested loops!")
`
  },
  ai_bot: {
    name: '🤖 AI Chatbot Simulator',
    code: `# 🤖 Koda AI Robot Simulator
robot_name = "Koda"
print(f"🤖 Hello! I am {robot_name}, your Codeyoung AI Assistant.")

def process_query(question):
    print(f"🧑 User asks: '{question}'")
    q = question.lower()
    if "hello" in q or "hi" in q:
        print(f"🤖 {robot_name}: Greetings, explorer! Ready to build games?")
    elif "loop" in q:
        print(f"🤖 {robot_name}: Loops repeat tasks automatically so you code faster!")
    elif "python" in q:
        print(f"🤖 {robot_name}: Python powers NASA rovers, AI models, and YouTube!")
    else:
        print(f"🤖 {robot_name}: Great question! Let's write code to solve it together.")

process_query("Hello Koda!")
process_query("What is a loop?")
process_query("Why do we learn Python?")
`
  },
  math_quiz: {
    name: '🧮 Superhero Math Challenge',
    code: `# 🧮 Superhero Speed Math Challenge
print("⚡ Welcome to the Superhero Math Challenge!")

score = 0
challenges = [
    (12, 8, "+", 20),
    (7, 6, "*", 42),
    (50, 15, "-", 35),
    (81, 9, "/", 9)
]

for a, b, op, expected in challenges:
    result = 0
    if op == "+": result = a + b
    elif op == "*": result = a * b
    elif op == "-": result = a - b
    elif op == "/": result = a / b

    if result == expected:
        score += 25
        print(f"✅ {a} {op} {b} = {result} (Correct! +25 XP)")

print(f"🏆 Final Math Power: {score}/100 XP! Math Superpower Unlocked!")
`
  },
  blank: {
    name: '📝 Blank Script (Clean Canvas)',
    code: `# Welcome to your blank Python canvas!
# Type any Python code below and click 'Run Code'

name = "Innovator"
print(f"Hello, {name}! Let's build something amazing today!")
`
  }
};

// Initial Scratch Blocks
const INITIAL_SCRATCH_BLOCKS = [
  { id: 1, type: 'event', label: 'when 🟢 green flag clicked', icon: '🟢', color: '#f59e0b' },
  { id: 2, type: 'motion', label: 'move (25) steps', action: 'move', param: 25, color: '#3b82f6' },
  { id: 3, type: 'sound', label: "play sound 'laser_blast'", action: 'sound', param: 'laser', color: '#ec4899' },
  { id: 4, type: 'looks', label: 'change color effect by (30)', action: 'color', param: 30, color: '#8b5cf6' },
  { id: 5, type: 'motion', label: 'turn ↷ (20) degrees', action: 'turn', param: 20, color: '#3b82f6' },
  { id: 6, type: 'looks', label: 'say "I love coding with Codeyoung!" for 2s', action: 'say', param: 'I love coding with Codeyoung!', color: '#8b5cf6' },
  { id: 7, type: 'sound', label: "play sound 'cheer'", action: 'sound', param: 'cheer', color: '#ec4899' }
];

export default function VirtualClassroom({ bookingId, onBackToBooking }) {
  const { user, openAuthModal } = useAuth();

  // Classroom Media Controls
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [activeTab, setActiveTab] = useState('python'); // 'python' | 'scratch' | 'ai'
  const [showCertificate, setShowCertificate] = useState(false);

  // Python Code State
  const [selectedTemplate, setSelectedTemplate] = useState('space');
  const [code, setCode] = useState(CODE_TEMPLATES.space.code);
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [executionStats, setExecutionStats] = useState(null);
  const [copiedCodeToast, setCopiedCodeToast] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState([
    'Initializing Codeyoung Cloud Sandbox...',
    'Python 3.11 Runtime Ready 🚀',
    'Interactive 1:1 Workspace Connected.',
    'Ready! Click "Run Code" to execute.'
  ]);

  // Scratch Interactive State
  const [scratchBlocks, setScratchBlocks] = useState(INITIAL_SCRATCH_BLOCKS);
  const [isScratchRunning, setIsScratchRunning] = useState(false);
  const [activeBlockIndex, setActiveBlockIndex] = useState(-1);
  const [spriteX, setSpriteX] = useState(0);
  const [spriteY, setSpriteY] = useState(0);
  const [spriteRotation, setSpriteRotation] = useState(0);
  const [spriteHue, setSpriteHue] = useState(0);
  const [spriteSpeech, setSpriteSpeech] = useState('');
  const [selectedSprite, setSelectedSprite] = useState('🚀');

  // AI Mentor State
  const [aiChatMessages, setAiChatMessages] = useState([
    {
      sender: 'Koda AI',
      role: 'assistant',
      time: '10:00 AM',
      text: "👋 Hi there! I'm Koda, your Codeyoung AI Coding Companion! You can ask me to explain your code, fix bugs, or give you exciting coding missions!"
    }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);

  // Classroom Live Chat State
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Mentor Aarav', time: '10:01 AM', text: "Welcome to Codeyoung! Today we're going to build your very first interactive game!" },
    { sender: user?.name || 'Student', time: '10:02 AM', text: "Awesome! I'm ready!" },
    { sender: 'Mentor Aarav', time: '10:03 AM', text: "Let's run the code and see our spaceship blast off!" }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Milestone Checklist
  const [milestones, setMilestones] = useState([
    { id: 1, text: 'Icebreaker & Child Curiosity', done: true },
    { id: 2, text: 'Computational Thinking Puzzle', done: true },
    { id: 3, text: 'Hands-on Project Building', done: false },
    { id: 4, text: 'Live Code Execution & AI Debugging', done: false },
    { id: 5, text: 'Parent Curriculum Roadmap & Certificate', done: false }
  ]);

  // Timer
  const [secondsRemaining, setSecondsRemaining] = useState(45 * 60);
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Dynamic student and mentor persona resolution
  const isMentor = user?.role === 'mentor';
  const isParent = user?.role === 'parent';
  const isStudent = user?.role === 'student';

  const studentDisplayName = isStudent
    ? (user?.name || 'Leo Jenkins')
    : isParent
      ? (user?.childName || 'Leo Jenkins')
      : isMentor
        ? 'Leo Jenkins'
        : 'Young Innovator';

  const studentAvatar = isStudent && user?.avatar
    ? user.avatar
    : 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80';

  const studentSubtext = isStudent
    ? (user?.title || 'Student Explorer (Grade 4)')
    : isParent
      ? `Parent: ${user?.name || 'Guardian'} (${user?.timezone || 'US Eastern'})`
      : isMentor
        ? 'Student Mentee (Grade 4 • New York)'
        : 'Guest Explorer (Not Signed In)';

  const mentorName = isMentor ? (user?.name || 'Aarav Sharma') : 'Aarav Sharma';
  const mentorAvatar = isMentor && user?.avatar
    ? user.avatar
    : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80';
  const mentorSubtext = isMentor ? `${user?.title || 'Lead Coding Educator'} (You)` : 'Lead Coding Educator • IST';

  // Handle Template Selection
  const handleSelectTemplate = (key) => {
    setSelectedTemplate(key);
    if (CODE_TEMPLATES[key]) {
      setCode(CODE_TEMPLATES[key].code);
      setConsoleOutput(prev => [
        ...prev,
        `📂 Loaded project template: ${CODE_TEMPLATES[key].name}`
      ]);
    }
  };

  // ==========================================
  // 1. REAL PYTHON CODE EXECUTION
  // ==========================================
  const handleRunCode = async () => {
    setIsRunningCode(true);
    const runTimeStr = new Date().toLocaleTimeString();

    // Mark milestone 4
    setMilestones(prev => prev.map(m => m.id === 4 ? { ...m, done: true } : m));

    try {
      const result = await pythonRunner.run(code);
      setExecutionStats({
        duration: result.executionTimeMs,
        success: result.success
      });

      const newOutputs = [
        `>>> Executing project at ${runTimeStr}...`,
        ...result.stdout
      ];

      if (result.stderr && result.stderr.length > 0) {
        newOutputs.push(`❌ ${result.stderr.join('\n')}`);
      } else {
        newOutputs.push(`⚡ Finished in ${result.executionTimeMs}ms with exit code 0`);
      }

      setConsoleOutput(newOutputs);
      soundEffects.playVictory();
    } catch (err) {
      setConsoleOutput(prev => [
        ...prev,
        `>>> Execution Error at ${runTimeStr}:`,
        `❌ ${err.message || String(err)}`
      ]);
    } finally {
      setIsRunningCode(false);
    }
  };

  const handleClearConsole = () => {
    setConsoleOutput(['Terminal cleared. Ready for next run.']);
    setExecutionStats(null);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopiedCodeToast(true);
    setTimeout(() => setCopiedCodeToast(false), 2500);
  };

  const handleDownloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTemplate}_project.py`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ==========================================
  // 2. REAL INTERACTIVE SCRATCH EXECUTION
  // ==========================================
  const handleRunScratch = async () => {
    if (isScratchRunning) return;
    setIsScratchRunning(true);
    setConsoleOutput(prev => [...prev, '🟢 Starting Scratch Visual Execution Sequence...']);

    for (let i = 0; i < scratchBlocks.length; i++) {
      setActiveBlockIndex(i);
      const b = scratchBlocks[i];

      if (b.action === 'move') {
        setSpriteX(prev => (prev + b.param) % 180);
      } else if (b.action === 'turn') {
        setSpriteRotation(prev => prev + b.param);
      } else if (b.action === 'color') {
        setSpriteHue(prev => prev + b.param);
      } else if (b.action === 'sound') {
        soundEffects.playSound(b.param);
      } else if (b.action === 'say') {
        setSpriteSpeech(b.param);
        setTimeout(() => setSpriteSpeech(''), 2200);
      }

      // Step delay
      await new Promise(r => setTimeout(r, 650));
    }

    setActiveBlockIndex(-1);
    setIsScratchRunning(false);
    setConsoleOutput(prev => [...prev, '🎉 Scratch blocks finished execution!']);
    soundEffects.playVictory();
  };

  const handleStopScratch = () => {
    setIsScratchRunning(false);
    setActiveBlockIndex(-1);
    setSpriteSpeech('');
  };

  const handleResetScratchSprite = () => {
    setSpriteX(0);
    setSpriteY(0);
    setSpriteRotation(0);
    setSpriteHue(0);
    setSpriteSpeech('');
    soundEffects.playPop();
  };

  const handleAddScratchBlock = (type) => {
    const presets = {
      move: { type: 'motion', label: 'move (20) steps', action: 'move', param: 20, color: '#3b82f6' },
      turn: { type: 'motion', label: 'turn ↷ (15) deg', action: 'turn', param: 15, color: '#3b82f6' },
      laser: { type: 'sound', label: "play sound 'laser_blast'", action: 'sound', param: 'laser', color: '#ec4899' },
      say: { type: 'looks', label: 'say "Level complete!" for 2s', action: 'say', param: 'Level complete!', color: '#8b5cf6' },
      color: { type: 'looks', label: 'change color effect by (25)', action: 'color', param: 25, color: '#8b5cf6' },
      coin: { type: 'sound', label: "play sound 'coin'", action: 'sound', param: 'coin', color: '#ec4899' }
    };

    if (presets[type]) {
      setScratchBlocks(prev => [...prev, { ...presets[type], id: Date.now() }]);
      soundEffects.playPop();
    }
  };

  // ==========================================
  // 3. AI CODING MENTOR & ASSISTANT
  // ==========================================
  const handleSendAiMessage = async (customMsg = null) => {
    const textToSend = customMsg || aiInput;
    if (!textToSend.trim()) return;

    const userMsg = {
      sender: user?.name || 'You',
      role: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: textToSend
    };

    setAiChatMessages(prev => [...prev, userMsg]);
    if (!customMsg) setAiInput('');
    setIsAiThinking(true);

    try {
      let replyText = '';
      let codeSnippet = null;
      let action = null;
      let senderName = 'Koda AI Mentor';

      // 1. Try resilient AI (handles server, direct gemini, and knowledge core)
      try {
        const res = await api.askAI(textToSend, code, activeTab, studentDisplayName);
        replyText = res.reply;
        codeSnippet = res.codeSnippet;
        action = res.action;
        senderName = res.source === 'gemini-live' ? 'Koda AI (Gemini 2.5 Flash)' : 'Koda AI Mentor';
      } catch (fbErr) {
        // 2. Direct fallback to Koda AI Knowledge Core
        const coreResult = queryKnowledgeCore(textToSend, code, activeTab, studentDisplayName);
        replyText = coreResult.reply;
        codeSnippet = coreResult.codeSnippet;
        action = coreResult.action;
      }

      const aiReply = {
        sender: senderName,
        role: 'assistant',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: replyText,
        codeSnippet,
        action
      };
      setAiChatMessages(prev => [...prev, aiReply]);
      soundEffects.playPop();
    } catch (err) {
      // 3. Guaranteed intelligent response, never a static fallback!
      const fallback = queryKnowledgeCore(textToSend, code, activeTab, studentDisplayName);
      setAiChatMessages(prev => [
        ...prev,
        {
          sender: 'Koda AI Mentor',
          role: 'assistant',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: fallback.reply,
          codeSnippet: fallback.codeSnippet || null,
          action: fallback.action || null
        }
      ]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleAiExplainCode = async () => {
    setIsAiThinking(true);
    setAiDrawerOpen(true);
    try {
      const res = await api.explainCode(code, activeTab);
      setAiChatMessages(prev => [
        ...prev,
        {
          sender: 'Koda AI',
          role: 'assistant',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `📖 **Code Explanation by Koda:**\n\n${res.summary}\n\n` +
                (res.breakdown?.length 
                  ? `**Key Components:**\n` + res.breakdown.map(b => `• Line ${b.line}: **${b.type}** — ${b.text}`).join('\n')
                  : '') +
                `\n\n${res.rating || ''}`
        }
      ]);
      soundEffects.playPop();
    } catch (e) {
      handleSendAiMessage('Explain my current code in simple terms');
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleAiDebugCode = async () => {
    setIsAiThinking(true);
    setAiDrawerOpen(true);
    try {
      const res = await api.debugCode(code, activeTab);
      let reply = '';
      if (res.hasIssues) {
        reply = `🔍 **I spotted ${res.issues.length} item(s) to check:**\n\n` +
                res.issues.map(iss => `• ${iss}`).join('\n') +
                `\n\n${res.explanation}`;
      } else {
        reply = `✨ **Superb!** Your syntax and structure look 100% clean and ready to execute!`;
      }

      setAiChatMessages(prev => [
        ...prev,
        {
          sender: 'Koda AI',
          role: 'assistant',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: reply,
          fixedCode: res.hasIssues ? res.fixedCode : null
        }
      ]);
      soundEffects.playPop();
    } catch (e) {
      handleSendAiMessage('Check my code for bugs or errors');
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleAiGetChallenge = async () => {
    setIsAiThinking(true);
    setAiDrawerOpen(true);
    try {
      const res = await api.getChallenge(code, activeTab);
      const ch = res.challenge;
      setAiChatMessages(prev => [
        ...prev,
        {
          sender: 'Koda AI',
          role: 'assistant',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `🎯 **New Mission: ${ch.title}** (${ch.difficulty})\n\n` +
                `${ch.description}\n\n` +
                `🎁 **Reward:** ${ch.reward}`,
          codeSnippet: ch.starterCode
        }
      ]);
      soundEffects.playPop();
    } catch (e) {
      handleSendAiMessage('Give me a level-up coding challenge');
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleApplyCodeSnippet = (snippet) => {
    setCode(prev => `${prev.trim()}\n${snippet}\n`);
    soundEffects.playPop();
  };

  // Classroom Live Chat Handler
  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages(prev => [
      ...prev,
      {
        sender: user?.name || 'You',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: chatInput
      }
    ]);
    setChatInput('');
  };

  return (
    <div className="classroom-container" id="virtual-live-classroom">
      {/* Classroom Top Bar */}
      <div className="classroom-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#ef4444', color: 'white', padding: '4px 10px', borderRadius: 'var(--radius-pill)', fontSize: '11px', fontWeight: 800, letterSpacing: '0.05em' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'white', display: 'inline-block' }} />
            <span>LIVE TRIAL SESSION</span>
          </div>

          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Kodaverse 1:1 Live Classroom</span>
              <span style={{ fontSize: '11px', background: '#312e81', color: '#c7d2fe', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                Interactive IDE + AI
              </span>
            </h3>
            <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>
              Session Ref: <strong style={{ color: '#818cf8' }}>{bookingId || 'KV-TR-LIVE-DEMO'}</strong>
            </span>
          </div>
        </div>

        {/* Center Session Timer */}
        <div style={{ background: '#0f172a', padding: '6px 16px', borderRadius: 'var(--radius-pill)', border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', fontWeight: 700, color: '#fbbf24' }}>
          <span>Session Timer:</span>
          <span style={{ fontFamily: 'var(--font-mono)' }}>{formatTimer(secondsRemaining)}</span>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* AI Tutor Toggle Button */}
          <button
            id="btn-toggle-ai-mentor"
            onClick={() => setAiDrawerOpen(prev => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: aiDrawerOpen ? 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' : '#1e1b4b',
              color: 'white',
              border: '1.5px solid #6366f1',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: aiDrawerOpen ? '0 0 15px rgba(99, 102, 241, 0.4)' : 'none'
            }}
          >
            <Sparkles size={14} color="#38bdf8" />
            <span>Koda AI Mentor</span>
          </button>

          <button
            id="btn-open-certificate"
            className="btn-primary"
            style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white', padding: '6px 14px', fontSize: '12.5px', border: 'none' }}
            onClick={() => setShowCertificate(true)}
          >
            <Award size={15} />
            <span>Trial Certificate</span>
          </button>

          <button
            className="btn-secondary"
            style={{ background: '#334155', color: 'white', borderColor: '#475569', padding: '6px 12px', fontSize: '12px' }}
            onClick={onBackToBooking}
          >
            Leave Classroom
          </button>
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div className="classroom-main" style={{ display: 'grid', gridTemplateColumns: aiDrawerOpen ? '260px 1fr 340px' : '280px 1fr 300px', height: '640px' }}>
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: LIVE VIDEO FEEDS & CONTROLS                  */}
        {/* ========================================================= */}
        <div style={{ background: '#1e293b', borderRight: '1px solid #334155', padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
          
          {/* Mentor Video Tile */}
          <div className="video-tile" style={{ height: '190px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '12px', background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: 'var(--radius-pill)', color: '#38bdf8', fontWeight: 700 }}>
                👨‍🏫 Mentor Feed {isMentor ? '(You)' : '(India)'}
              </span>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} title="Microphone Active" />
            </div>

            <div style={{ textAlign: 'center' }}>
              <img
                src={mentorAvatar}
                alt={mentorName}
                style={{ width: 62, height: 62, borderRadius: '50%', border: '3px solid #6366f1', margin: '0 auto 6px auto', objectFit: 'cover' }}
              />
              <div style={{ fontSize: '13px', fontWeight: 700 }}>{mentorName}</div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>{mentorSubtext}</div>
            </div>

            <div style={{ fontSize: '10.5px', color: '#64748b', textAlign: 'center' }}>
              1:1 Active Encrypted Audio/Video
            </div>
          </div>

          {/* Student Video Tile (Dynamically bound to student persona) */}
          <div className="video-tile" style={{ height: '190px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '12px', background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: 'var(--radius-pill)', color: '#a78bfa', fontWeight: 700 }}>
                👶 Student Feed ({isParent ? 'Child' : isStudent ? 'You' : 'Participant'})
              </span>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: micOn ? '#22c55e' : '#ef4444' }} />
            </div>

            <div style={{ textAlign: 'center' }}>
              <img
                src={studentAvatar}
                alt={studentDisplayName}
                style={{ width: 62, height: 62, borderRadius: '50%', border: '3px solid #8b5cf6', margin: '0 auto 6px auto', objectFit: 'cover' }}
              />
              <div style={{ fontSize: '13px', fontWeight: 700 }}>{studentDisplayName}</div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                {studentSubtext}
              </div>
              {!user && (
                <button
                  id="btn-classroom-signin"
                  onClick={() => openAuthModal('signin')}
                  style={{
                    marginTop: '6px',
                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                    border: 'none',
                    color: 'white',
                    padding: '3px 12px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.4)'
                  }}
                >
                  <LogIn size={11} />
                  <span>Sign In / Connect</span>
                </button>
              )}
            </div>

            <div style={{ fontSize: '10.5px', color: '#64748b', textAlign: 'center' }}>
              Screen Shared: Live Sandbox
            </div>
          </div>

          {/* Video / Audio Controls */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: 'auto' }}>
            <button
              className="btn-secondary"
              style={{ padding: '8px', borderRadius: '50%', background: micOn ? '#334155' : '#ef4444', color: 'white', borderColor: '#475569' }}
              onClick={() => setMicOn(!micOn)}
              title={micOn ? 'Mute Microphone' : 'Unmute Microphone'}
            >
              {micOn ? <Mic size={16} /> : <MicOff size={16} />}
            </button>

            <button
              className="btn-secondary"
              style={{ padding: '8px', borderRadius: '50%', background: videoOn ? '#334155' : '#ef4444', color: 'white', borderColor: '#475569' }}
              onClick={() => setVideoOn(!videoOn)}
              title={videoOn ? 'Turn Camera Off' : 'Turn Camera On'}
            >
              {videoOn ? <Video size={16} /> : <VideoOff size={16} />}
            </button>

            <button
              className="btn-secondary"
              style={{ padding: '8px', borderRadius: '50%', background: screenSharing ? '#4f46e5' : '#334155', color: 'white', borderColor: '#475569' }}
              onClick={() => setScreenSharing(!screenSharing)}
              title="Share Screen"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CENTER COLUMN: INTERACTIVE CODING SANDBOX                 */}
        {/* ========================================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', background: '#1e1e1e', overflow: 'hidden' }}>
          
          {/* Editor Header Bar with Language Tabs & Template Selector */}
          <div style={{ background: '#2d3748', padding: '8px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #4a5568', flexWrap: 'wrap', gap: '8px' }}>
            
            {/* Language Switcher */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                id="tab-python-mode"
                style={{
                  background: activeTab === 'python' ? '#1e1e1e' : 'transparent',
                  color: activeTab === 'python' ? '#68d391' : '#a0aec0',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onClick={() => setActiveTab('python')}
              >
                <Terminal size={14} />
                <span>🐍 Python (main.py)</span>
              </button>

              <button
                id="tab-scratch-mode"
                style={{
                  background: activeTab === 'scratch' ? '#1e1e1e' : 'transparent',
                  color: activeTab === 'scratch' ? '#f6ad55' : '#a0aec0',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onClick={() => setActiveTab('scratch')}
              >
                <Layers size={14} />
                <span>🧩 Visual Blocks (Scratch)</span>
              </button>
            </div>

            {/* Template Selector (Python Mode) */}
            {activeTab === 'python' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>Template:</span>
                <select
                  value={selectedTemplate}
                  onChange={(e) => handleSelectTemplate(e.target.value)}
                  style={{
                    background: '#1a202c',
                    color: '#e2e8f0',
                    border: '1px solid #4a5568',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '11.5px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {Object.entries(CODE_TEMPLATES).map(([key, item]) => (
                    <option key={key} value={key}>{item.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {activeTab === 'python' ? (
                <>
                  <button
                    onClick={handleCopyCode}
                    title="Copy Code"
                    style={{ background: '#374151', color: '#d1d5db', border: 'none', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    {copiedCodeToast ? <Check size={14} color="#4ade80" /> : <Copy size={14} />}
                  </button>

                  <button
                    onClick={handleDownloadCode}
                    title="Download .py file"
                    style={{ background: '#374151', color: '#d1d5db', border: 'none', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    <Download size={14} />
                  </button>

                  <button
                    id="btn-run-code"
                    className="btn-primary"
                    disabled={isRunningCode}
                    style={{
                      padding: '6px 16px',
                      fontSize: '13px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      border: 'none',
                      boxShadow: '0 0 12px rgba(16, 185, 129, 0.4)'
                    }}
                    onClick={handleRunCode}
                  >
                    {isRunningCode ? (
                      <RefreshCw size={14} className="animate-spin" />
                    ) : (
                      <Play size={14} fill="white" />
                    )}
                    <span>{isRunningCode ? 'Running...' : 'Run Code'}</span>
                  </button>
                </>
              ) : (
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    id="btn-run-scratch-blocks"
                    onClick={handleRunScratch}
                    disabled={isScratchRunning}
                    style={{
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      padding: '6px 14px',
                      borderRadius: '6px',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Flag size={14} fill="white" />
                    <span>Run Green Flag</span>
                  </button>

                  <button
                    id="btn-stop-scratch-blocks"
                    onClick={handleStopScratch}
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title="Stop Blocks"
                  >
                    <Square size={13} fill="white" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Editor Body */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
            
            {/* PYTHON TAB */}
            {activeTab === 'python' && (
              <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
                {/* Code Editor */}
                <textarea
                  id="code-editor-textarea"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  style={{
                    flex: 1,
                    background: '#1e1e1e',
                    color: '#e2e8f0',
                    border: 'none',
                    padding: '16px 20px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13.5px',
                    resize: 'none',
                    outline: 'none',
                    lineHeight: 1.6,
                    tabSize: 4
                  }}
                  spellCheck="false"
                  placeholder="# Write your Python code here..."
                />
              </div>
            )}

            {/* SCRATCH VISUAL BLOCKS TAB */}
            {activeTab === 'scratch' && (
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 280px', background: '#1e293b', overflow: 'hidden' }}>
                
                {/* Scratch Script Workspace */}
                <div style={{ padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                      Interactive Block Sequence
                    </span>
                    <button
                      onClick={() => setScratchBlocks(INITIAL_SCRATCH_BLOCKS)}
                      style={{ background: 'none', border: 'none', color: '#818cf8', fontSize: '11px', cursor: 'pointer' }}
                    >
                      Reset Default Blocks
                    </button>
                  </div>

                  {scratchBlocks.map((b, idx) => (
                    <div
                      key={b.id}
                      style={{
                        background: b.color,
                        color: 'white',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        width: 'fit-content',
                        marginLeft: b.type === 'event' ? '0px' : '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: activeBlockIndex === idx ? '0 0 16px white' : '0 2px 4px rgba(0,0,0,0.2)',
                        transform: activeBlockIndex === idx ? 'scale(1.04)' : 'scale(1)',
                        transition: 'all 0.15s ease',
                        border: activeBlockIndex === idx ? '2px solid white' : '1px solid rgba(255,255,255,0.2)'
                      }}
                    >
                      <span>{b.label}</span>
                      <button
                        onClick={() => setScratchBlocks(prev => prev.filter(x => x.id !== b.id))}
                        style={{ background: 'rgba(0,0,0,0.2)', border: 'none', color: 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginLeft: '6px' }}
                        title="Remove Block"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}

                  {/* Add Block Palette */}
                  <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #334155' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '8px' }}>
                      Click to Add Blocks:
                    </span>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <button onClick={() => handleAddScratchBlock('move')} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>+ Move 20</button>
                      <button onClick={() => handleAddScratchBlock('turn')} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>+ Turn 15°</button>
                      <button onClick={() => handleAddScratchBlock('laser')} style={{ background: '#ec4899', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>+ Laser Sound</button>
                      <button onClick={() => handleAddScratchBlock('coin')} style={{ background: '#ec4899', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>+ Coin Sound</button>
                      <button onClick={() => handleAddScratchBlock('color')} style={{ background: '#8b5cf6', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>+ Color Effect</button>
                      <button onClick={() => handleAddScratchBlock('say')} style={{ background: '#8b5cf6', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>+ Speech Bubble</button>
                    </div>
                  </div>
                </div>

                {/* Live Animated Sprite Canvas / Stage */}
                <div style={{ background: '#0f172a', borderLeft: '1px solid #334155', padding: '12px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#38bdf8' }}>
                      Live Stage (Canvas)
                    </span>
                    <button
                      onClick={handleResetScratchSprite}
                      style={{ background: '#1e293b', border: '1px solid #475569', color: '#cbd5e1', padding: '2px 8px', borderRadius: '4px', fontSize: '10.5px', cursor: 'pointer' }}
                    >
                      Reset Sprite
                    </button>
                  </div>

                  {/* Stage Screen Area */}
                  <div style={{
                    flex: 1,
                    background: 'radial-gradient(circle at center, #1e1b4b 0%, #0f172a 100%)',
                    borderRadius: '12px',
                    border: '1.5px solid #334155',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {/* Grid Background Lines */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                      backgroundSize: '24px 24px'
                    }} />

                    {/* Speech Bubble */}
                    {spriteSpeech && (
                      <div style={{
                        position: 'absolute',
                        top: '20px',
                        background: 'white',
                        color: '#0f172a',
                        padding: '6px 12px',
                        borderRadius: '12px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                        animation: 'bounce 0.3s ease',
                        zIndex: 10
                      }}>
                        {spriteSpeech}
                      </div>
                    )}

                    {/* Animated Sprite */}
                    <div style={{
                      fontSize: '52px',
                      transform: `translate(${spriteX}px, ${spriteY}px) rotate(${spriteRotation}deg)`,
                      filter: `hue-rotate(${spriteHue}deg)`,
                      transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.3s ease',
                      userSelect: 'none',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      soundEffects.playPop();
                      setSpriteRotation(prev => prev + 45);
                    }}
                    title="Click sprite to trigger fun spin!"
                    >
                      {selectedSprite}
                    </div>

                    <div style={{ position: 'absolute', bottom: '8px', right: '8px', fontSize: '10px', color: '#64748b' }}>
                      x: {spriteX} | y: {spriteY} | rot: {spriteRotation % 360}°
                    </div>
                  </div>

                  {/* Sprite Chooser */}
                  <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>Sprite:</span>
                    {['🚀', '🛸', '🐱', '⭐', '🤖'].map(sp => (
                      <button
                        key={sp}
                        onClick={() => setSelectedSprite(sp)}
                        style={{
                          background: selectedSprite === sp ? '#4f46e5' : '#1e293b',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '3px 6px',
                          fontSize: '14px',
                          cursor: 'pointer'
                        }}
                      >
                        {sp}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Console Output Bar */}
            <div style={{
              height: '140px',
              background: '#111827',
              borderTop: '1px solid #374151',
              padding: '10px 16px',
              overflowY: 'auto',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: '#a7f3d0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ color: '#9ca3af', fontSize: '11px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Terminal size={12} color="#10b981" />
                  <span>Cloud Sandbox Terminal Output:</span>
                  {executionStats && (
                    <span style={{ color: executionStats.success ? '#34d399' : '#f87171', fontWeight: 700 }}>
                      [⚡ {executionStats.duration}ms]
                    </span>
                  )}
                </span>
                <button
                  onClick={handleClearConsole}
                  style={{ background: 'transparent', border: 'none', color: '#6b7280', fontSize: '11px', cursor: 'pointer' }}
                >
                  Clear Terminal
                </button>
              </div>

              {consoleOutput.map((line, idx) => (
                <div key={idx} style={{ color: line.startsWith('❌') ? '#f87171' : line.startsWith('>>>') ? '#60a5fa' : '#a7f3d0', lineHeight: 1.4 }}>
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: AI MENTOR DRAWER OR CHAT & MILESTONES       */}
        {/* ========================================================= */}
        {aiDrawerOpen ? (
          /* KODA AI TUTOR DRAWER */
          <div style={{ background: '#0f172a', borderLeft: '1px solid #334155', display: 'flex', flexDirection: 'column' }}>
            {/* AI Header */}
            <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', padding: '12px 14px', borderBottom: '1px solid #4338ca', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={14} color="white" />
                </div>
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 800, margin: 0, color: 'white' }}>Koda AI Coding Mentor</h4>
                  <span style={{ fontSize: '10.5px', color: '#c7d2fe' }}>1:1 Pair Programmer</span>
                </div>
              </div>
              <button
                onClick={() => setAiDrawerOpen(false)}
                style={{ background: 'none', border: 'none', color: '#c7d2fe', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Quick Action Shortcuts */}
            <div style={{ padding: '8px 12px', background: '#1e293b', borderBottom: '1px solid #334155', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
              <button
                id="btn-ai-explain-code"
                onClick={handleAiExplainCode}
                disabled={isAiThinking}
                style={{ background: '#334155', color: '#e2e8f0', border: '1px solid #475569', padding: '6px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <Lightbulb size={12} color="#fbbf24" />
                <span>Explain Code</span>
              </button>

              <button
                id="btn-ai-debug-code"
                onClick={handleAiDebugCode}
                disabled={isAiThinking}
                style={{ background: '#334155', color: '#e2e8f0', border: '1px solid #475569', padding: '6px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <Bug size={12} color="#f87171" />
                <span>Debug Code</span>
              </button>

              <button
                id="btn-ai-next-challenge"
                onClick={handleAiGetChallenge}
                disabled={isAiThinking}
                style={{ background: '#334155', color: '#e2e8f0', border: '1px solid #475569', padding: '6px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <Zap size={12} color="#38bdf8" />
                <span>Next Mission</span>
              </button>

              <button
                onClick={() => handleSendAiMessage('How can I add awesome sound or powerup effects?')}
                disabled={isAiThinking}
                style={{ background: '#334155', color: '#e2e8f0', border: '1px solid #475569', padding: '6px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <Wand2 size={12} color="#c084fc" />
                <span>Add Powerup</span>
              </button>
            </div>

            {/* AI Messages Stream */}
            <div style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {aiChatMessages.map((msg, i) => (
                <div key={i} style={{
                  background: msg.role === 'assistant' ? '#1e293b' : '#312e81',
                  border: msg.role === 'assistant' ? '1px solid #334155' : '1px solid #4338ca',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  fontSize: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '10.5px', color: '#94a3b8' }}>
                    <strong style={{ color: msg.role === 'assistant' ? '#38bdf8' : '#c7d2fe' }}>{msg.sender}</strong>
                    <span>{msg.time}</span>
                  </div>
                  <div style={{ lineHeight: 1.5, color: '#f1f5f9' }}>
                    {renderKodaMessage(msg.text)}
                  </div>

                  {/* Optional Actionable Code Snippet */}
                  {(msg.codeSnippet || msg.fixedCode) && (
                    <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                      <button
                        onClick={() => handleApplyCodeSnippet(msg.codeSnippet || msg.fixedCode)}
                        style={{
                          background: '#10b981',
                          color: 'white',
                          border: 'none',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Zap size={12} />
                        <span>Insert Code Into Editor</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {isAiThinking && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '11.5px', padding: '6px' }}>
                  <RefreshCw size={13} className="animate-spin" color="#38bdf8" />
                  <span>Koda AI is thinking...</span>
                </div>
              )}
            </div>

            {/* AI Chat Input */}
            <form onSubmit={(e) => { e.preventDefault(); handleSendAiMessage(); }} style={{ padding: '10px', background: '#1e293b', borderTop: '1px solid #334155', display: 'flex', gap: '6px' }}>
              <input
                type="text"
                placeholder="Ask Koda anything about your code..."
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                style={{ flex: 1, background: '#0f172a', border: '1px solid #475569', borderRadius: '6px', padding: '8px 10px', color: 'white', fontSize: '12px', outline: 'none' }}
              />
              <button
                type="submit"
                disabled={isAiThinking}
                style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 12px', cursor: 'pointer' }}
              >
                <Send size={13} />
              </button>
            </form>
          </div>
        ) : (
          /* STANDARD RIGHT COLUMN: MILESTONES & CLASSROOM CHAT */
          <div style={{ background: '#1e293b', borderLeft: '1px solid #334155', display: 'flex', flexDirection: 'column' }}>
            
            {/* Trial Milestone Checklist */}
            <div style={{ padding: '12px 14px', borderBottom: '1px solid #334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Trial Milestones
                </span>
                <span style={{ fontSize: '10.5px', color: '#10b981', fontWeight: 700 }}>
                  {milestones.filter(m => m.done).length} of 5 Done
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                {milestones.map(m => (
                  <div
                    key={m.id}
                    onClick={() => setMilestones(prev => prev.map(x => x.id === m.id ? { ...x, done: !x.done } : x))}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: m.done ? '#4ade80' : '#94a3b8',
                      cursor: 'pointer'
                    }}
                  >
                    {m.done ? <CheckCircle2 size={13} color="#22c55e" /> : <div style={{ width: 12, height: 12, borderRadius: '50%', border: '1.5px solid #64748b' }} />}
                    <span style={{ textDecoration: m.done ? 'line-through' : 'none', fontSize: '11.5px' }}>{m.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Messages */}
            <div style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '10.5px', color: '#64748b', textAlign: 'center', padding: '4px' }}>
                1:1 Class Room Chat
              </div>
              {chatMessages.map((msg, i) => (
                <div key={i} style={{ background: msg.sender === 'You' || msg.sender === user?.name ? '#312e81' : '#334155', padding: '8px 10px', borderRadius: '8px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px', fontSize: '10.5px', color: '#94a3b8' }}>
                    <strong>{msg.sender}</strong>
                    <span>{msg.time}</span>
                  </div>
                  <div style={{ color: '#f8fafc' }}>{msg.text}</div>
                </div>
              ))}
            </div>

            {/* Chat Input Box */}
            <form onSubmit={handleSendChat} style={{ padding: '8px 12px', background: '#0f172a', borderTop: '1px solid #334155', display: 'flex', gap: '6px' }}>
              <input
                type="text"
                placeholder="Type message to mentor..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                style={{ flex: 1, background: '#1e293b', border: '1px solid #475569', borderRadius: '6px', padding: '6px 10px', color: 'white', fontSize: '12px', outline: 'none' }}
              />
              <button type="submit" style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer' }}>
                <Send size={13} />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* OFFICIAL TRIAL CERTIFICATE MODAL                          */}
      {/* ========================================================= */}
      {showCertificate && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            maxWidth: '650px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            position: 'relative'
          }}>
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
              padding: '24px 28px',
              color: 'white',
              textAlign: 'center',
              position: 'relative'
            }}>
              <button
                onClick={() => setShowCertificate(false)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', padding: '4px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, marginBottom: '8px' }}>
                <Award size={16} color="#fbbf24" />
                <span>KODAVERSE ACADEMY</span>
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '4px 0', letterSpacing: '0.02em', color: '#fbbf24' }}>
                Certificate of Achievement
              </h2>
              <p style={{ fontSize: '13px', color: '#c7d2fe', margin: 0 }}>
                1:1 Live Coding & STEM Mentorship • Official Verification
              </p>
            </div>

            {/* Certificate Body */}
            <div style={{ padding: '32px 36px', textAlign: 'center', background: '#fafaf9' }}>
              <p style={{ fontSize: '13px', color: '#78716c', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, margin: '0 0 8px 0' }}>
                This is proudly presented to
              </p>

              {/* Dynamic Name from User Auth Profile */}
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#1c1917', fontFamily: 'Georgia, serif', borderBottom: '2px dashed #d6d3d1', display: 'inline-block', paddingBottom: '6px', minWidth: '280px', margin: '0 auto 16px auto' }}>
                {studentDisplayName}
              </div>

              <p style={{ fontSize: '14px', color: '#44403c', lineHeight: 1.6, maxWidth: '500px', margin: '0 auto 24px auto' }}>
                For outstanding curiosity, computational logic, and successfully building their first interactive computer program in the <strong>Kodaverse 1:1 Live Trial Session</strong>.
              </p>

              {/* Signatures & Badges */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #e7e5e4' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: '#4f46e5' }}>
                    {bookingId || 'CY-TR-LIVE-DEMO'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#a8a29e', marginTop: '2px' }}>Verification ID</div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px auto', color: 'white', boxShadow: '0 4px 6px -1px rgba(217, 119, 6, 0.3)' }}>
                    <ShieldCheck size={28} />
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#92400e' }}>Verified STEM</div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#1c1917' }}>
                    {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div style={{ fontSize: '11px', color: '#a8a29e', marginTop: '2px' }}>Date Issued</div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div style={{ background: '#f5f5f4', padding: '16px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: '#78716c' }}>
                Accredited by STEM.org & Talentise Global
              </span>
              <button
                className="btn-primary"
                style={{ padding: '8px 18px', fontSize: '13px' }}
                onClick={() => window.print()}
              >
                <Printer size={15} />
                <span>Print / Save as PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
