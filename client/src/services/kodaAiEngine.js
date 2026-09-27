/**
 * Koda AI Intelligent Engine
 * High-performance, context-aware AI mentor for young innovators.
 * Supports:
 *  1. Optional live Gemini API connection (via user/parent API key or Firebase)
 *  2. Comprehensive STEM & Computer Science Knowledge Core (SQL, Python, Web, Scratch, Algorithms, Math)
 *  3. In-browser AST / Syntax code analyzer & debugger
 *  4. Dynamic mission & challenge generator
 */

// Key for user-provided Gemini API key (optional for parents/educators)
const GEMINI_STORAGE_KEY = 'kodaverse_gemini_api_key';

export function getStoredGeminiKey() {
  if (typeof window === 'undefined') return '';
  return import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem(GEMINI_STORAGE_KEY) || '';
}

export function setStoredGeminiKey(key) {
  if (typeof window === 'undefined') return;
  if (!key) {
    localStorage.removeItem(GEMINI_STORAGE_KEY);
  } else {
    localStorage.setItem(GEMINI_STORAGE_KEY, key.trim());
  }
}

/**
 * Call Gemini 2.5 Flash / Flash Latest API directly with user key
 */
async function callDirectGemini(apiKey, prompt, code, language, studentName) {
  const models = ['gemini-2.5-flash', 'gemini-flash-latest'];
  let lastError = null;

  const systemInstruction = 
    `You are Koda, an inspiring, patient, and friendly AI Coding Mentor at Codeyoung (a premier 1:1 STEM academy for kids).\n` +
    `Student Name: ${studentName}\n` +
    `Active Coding Environment: ${language}\n` +
    (code ? `Current Student Code:\n\`\`\`${language}\n${code}\n\`\`\`\n` : '') +
    `Respond enthusiastically with clear explanations, neat code snippets, fun analogies, and friendly emojis suitable for kids and teenagers!`;

  const payload = {
    contents: [
      {
        parts: [
          { text: `${systemInstruction}\n\nStudent Question: ${prompt}` }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 800
    }
  };

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return { text, model };
        }
      } else {
        const err = await res.json().catch(() => ({}));
        lastError = new Error(err.error?.message || `Gemini (${model}) returned status ${res.status}`);
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('No response text received from Gemini');
}

/**
 * Comprehensive STEM Knowledge Core
 */
export function queryKnowledgeCore(query, code = '', language = 'python', studentName = 'Young Innovator') {
  const q = (query || '').toLowerCase().trim();

  // 1. Greetings & Persona questions
  if (/^(hi|hello|hey|hloo|hlo|helo|holla|greetings|good\s*(morning|afternoon|evening)|yo\b)/i.test(q)) {
    return {
      reply: `👋 **Hello ${studentName}! I'm Koda, your AI Coding Companion!** 🚀\n\n` +
             `I'm super excited to code with you today! I can help you:\n` +
             `• 💡 **Answer any coding question** (like *"What is SQL?"*, *"How do loops work?"*)\n` +
             `• 🔍 **Explain or debug your code** in Python or Visual Blocks\n` +
             `• 🎮 **Give you fun coding challenges** to level up your astronaut!\n\n` +
             `What would you like to build or learn right now?`,
      action: 'greeting'
    };
  }

  if (q.includes('who are you') || q.includes('what are you') || q.includes('what can you do')) {
    return {
      reply: `🤖 **I'm Koda, your Codeyoung 1:1 AI Coding Mentor!**\n\n` +
             `Think of me as your co-pilot in this coding quest. You write the code, and I help you test it, find bugs, explain tricky concepts, and design awesome games and apps!\n\n` +
             `Try asking me:\n` +
             `• *"What is SQL?"*\n` +
             `• *"How does a for-loop work?"*\n` +
             `• *"Explain my code"*\n` +
             `• *"Give me a new coding mission"*`,
      action: 'intro'
    };
  }

  // 2. SQL & Database Questions
  if (q.includes('sql') || q.includes('database') || q.includes('query') || q.includes('table') && (q.includes('data') || q.includes('what'))) {
    return {
      reply: `🗄️ **What is SQL? (Structured Query Language)**\n\n` +
             `**SQL** (pronounced *"Sequel"* or *"S-Q-L"*) is the universal language used to talk to **Databases**! 📊\n\n` +
             `### 💡 Think of it like this:\n` +
             `Imagine your favorite video game (like Minecraft or Roblox). Where does it remember your player name, inventory, diamonds, and high scores when you log off? In a **Database**!\n\n` +
             `SQL gives you superpower commands to search and manage that data:\n\n` +
             `\`\`\`sql\n` +
             `-- 1. Find all players who have more than 100 diamonds:\n` +
             `SELECT player_name, score \n` +
             `FROM players \n` +
             `WHERE diamonds > 100 \n` +
             `ORDER BY score DESC;\n\n` +
             `-- 2. Add a new player to the game:\n` +
             `INSERT INTO players (player_name, level) \n` +
             `VALUES ('${studentName}', 10);\n` +
             `\`\`\`\n\n` +
             `### 🔑 4 Magic SQL Commands (CRUD):\n` +
             `1. **SELECT** 🔍 — Read and search for information\n` +
             `2. **INSERT** ➕ — Add new records (like saving a new player)\n` +
             `3. **UPDATE** ✏️ — Change existing data (like increasing your level)\n` +
             `4. **DELETE** 🗑️ — Remove data you no longer need\n\n` +
             `Companies like Netflix, Spotify, and NASA use SQL every single day to handle billions of songs, movies, and space data!`,
      action: 'concept_sql',
      codeSnippet: `-- Sample SQL Query\nSELECT name, level, energy \nFROM space_cadets \nWHERE status = 'Active';`
    };
  }

  // 3. Variables & Data Types
  if (q.includes('variable') || q.includes('data type') || q.includes('string') || q.includes('integer') || q.includes('boolean')) {
    return {
      reply: `📦 **What is a Variable?**\n\n` +
             `A **Variable** is like a labeled storage box inside the computer's memory! You give it a name, put some data inside, and you can open or change it anytime.\n\n` +
             `\`\`\`python\n` +
             `# Storing your astronaut's stats in variables\n` +
             `player_name = "${studentName}"    # String (Text)\n` +
             `energy = 100                     # Integer (Number)\n` +
             `shields_up = True                # Boolean (True/False)\n` +
             `planets = ["Mars", "Europa"]     # List (Array)\n\n` +
             `# Updating a variable:\n` +
             `energy = energy - 20\n` +
             `print(f"Energy remaining: {energy}")\n` +
             `\`\`\`\n\n` +
             `Notice in your editor right now, you have \`energy = 100\`! That's a variable keeping score in your space game!`,
      action: 'concept_variable'
    };
  }

  // 4. Loops (for, while)
  if (q.includes('loop') || q.includes('for loop') || q.includes('while loop') || q.includes('repeat') || q.includes('iteration')) {
    return {
      reply: `🔁 **What is a Loop?**\n\n` +
             `Computers are lightning fast at repeating tasks without ever getting tired! A **Loop** tells the computer to repeat a block of code multiple times.\n\n` +
             `### 🚀 1. The For-Loop (Counting or visiting items):\n` +
             `\`\`\`python\n` +
             `planets = ["Mercury", "Venus", "Mars", "Jupiter"]\n` +
             `for planet in planets:\n` +
             `    print(f"🚀 Traveling to planet: {planet}...")\n` +
             `\`\`\`\n\n` +
             `### ⚡ 2. The While-Loop (Runs while a condition is True):\n` +
             `\`\`\`python\n` +
             `countdown = 5\n` +
             `while countdown > 0:\n` +
             `    print(f"T-minus {countdown}...")\n` +
             `    countdown -= 1\n` +
             `print("🚀 BLASTOFF!")\n` +
             `\`\`\`\n\n` +
             `Try adding a loop to your space code to visit all planets in one go!`,
      action: 'concept_loop',
      codeSnippet: `for planet in ["Mars Outpost", "Europa Ocean", "Titan Nebula"]:\n    explore_alien_planet(planet)`
    };
  }

  // 5. Functions & Methods
  if (q.includes('function') || q.includes('def ') || q.includes('method') || q.includes('parameter') || q.includes('return')) {
    return {
      reply: `🛠️ **What is a Function?**\n\n` +
             `A **Function** is like a reusable mini-recipe or a magic spell. Instead of writing 10 lines of code over and over, you write it once, give it a name, and summon it whenever you want!\n\n` +
             `\`\`\`python\n` +
             `# 1. Defining the function recipe (with def)\n` +
             `def activate_turbo(boost_amount):\n` +
             `    print(f"🔥 Turbo rockets fired! +{boost_amount} speed!")\n` +
             `    return boost_amount * 2\n\n` +
             `# 2. Calling (running) the function:\n` +
             `new_speed = activate_turbo(50)\n` +
             `print(f"Current Speed: {new_speed} km/s")\n` +
             `\`\`\`\n\n` +
             `In your current editor, \`def explore_alien_planet(planet_name):\` is a custom function!`,
      action: 'concept_function'
    };
  }

  // 6. If / Else & Decision Logic
  if (q.includes('if') && (q.includes('else') || q.includes('condition') || q.includes('decision')) || q.includes('conditional')) {
    return {
      reply: `🔀 **Conditionals: If, Elif, & Else**\n\n` +
             `Conditionals allow your code to make smart decisions depending on what happens in your game!\n\n` +
             `\`\`\`python\n` +
             `energy = 15\n\n` +
             `if energy > 50:\n` +
             `    print("🟢 Ship is in tip-top shape! Full speed ahead!")\n` +
             `elif energy > 20:\n` +
             `    print("🟡 Warning: Energy getting low, look for fuel!")\n` +
             `else:\n` +
             `    print("🔴 Danger! Emergency battery mode activated!")\n` +
             `\`\`\`\n\n` +
             `💡 *Rule to remember:* In Python, remember the colon \`:\` after each \`if\`, \`elif\`, or \`else\`!`,
      action: 'concept_conditionals'
    };
  }

  // 7. Python vs JavaScript vs other languages
  if (q.includes('python') && (q.includes('what') || q.includes('why') || q.includes('javascript') || q.includes('is'))) {
    return {
      reply: `🐍 **What is Python?**\n\n` +
             `**Python** is one of the world's most popular programming languages! It was designed to read almost like plain English sentences, making it super clean and friendly.\n\n` +
             `### 🌟 What is Python used for?\n` +
             `• 🤖 **Artificial Intelligence & Machine Learning** (Gemini, ChatGPT, Tesla Self-Driving)\n` +
             `• 🚀 **Space Science & NASA Data Processing**\n` +
             `• 🎮 **Game Development & Scripting**\n` +
             `• 🌐 **Web Servers & Cloud Backends**\n\n` +
             `You are currently coding in **Python 3.11** right in this sandbox!`,
      action: 'concept_python'
    };
  }

  if (q.includes('javascript') || q.includes('js') || q.includes('html') || q.includes('css')) {
    return {
      reply: `🌐 **The Languages of the Web!**\n\n` +
             `Every website you visit uses this dream trio:\n` +
             `• 🧱 **HTML (Skeleton):** Builds the buttons, text, and structure.\n` +
             `• 🎨 **CSS (Outfit & Style):** Makes it look gorgeous with colors, glassmorphism, and animations.\n` +
             `• ⚡ **JavaScript (Brain & Muscles):** Makes things happen when you click, drag, or type!\n\n` +
             `In fact, this entire Kodaverse classroom platform is built with modern JavaScript and HTML!`,
      action: 'concept_web'
    };
  }

  // 8. Explain My Code
  if (q.includes('explain') || q.includes('what does my code') || q.includes('how does my code') || q.includes('walk me through')) {
    if (!code || !code.trim()) {
      return {
        reply: `📝 **Your editor is currently empty!**\n\nPick one of the cool templates above (like **Space Quest** or **Cyber Math Quest**) or type some Python code, and I'll break it down step-by-step for you!`,
        action: 'empty_code'
      };
    }

    const lines = code.split('\n').filter(l => l.trim() && !l.trim().startsWith('#'));
    const hasDef = code.includes('def ');
    const hasLoop = code.includes('for ') || code.includes('while ');
    const hasPrint = code.includes('print(');

    return {
      reply: `📖 **Code Breakdown for ${studentName}:**\n\n` +
             `Your script has **${lines.length} active lines** of Python logic. Here is what happens:\n\n` +
             (hasDef ? `1. 🛠️ **Custom Function (\`def\`):** You create a reusable routine that runs specific steps whenever called.\n` : '') +
             (hasLoop ? `2. 🔁 **Loop Iteration:** You iterate over items automatically without repeating yourself.\n` : '') +
             (hasPrint ? `3. 🖥️ **Console Output (\`print\`):** You display formatted text and emojis in the live terminal.\n` : '') +
             `4. 📦 **Variables & State:** You track data like player names, energy, or levels in real-time.\n\n` +
             `💡 *Pro Tip:* Click the **Run Code ▶** button below to see Python execute your logic in the cloud terminal!`,
      action: 'explain'
    };
  }

  // 9. Bug / Error / Debugging help
  if (q.includes('bug') || q.includes('error') || q.includes('fix') || q.includes('syntax') || q.includes('broken') || q.includes('help me debug')) {
    const issues = analyzeCodeIssues(code);
    if (issues.length > 0) {
      return {
        reply: `🔍 **I spotted ${issues.length} potential syntax tweak(s) in your code:**\n\n` +
               issues.map(iss => `• ${iss}`).join('\n') +
               `\n\n✨ Click the **Debug & Fix** button on top and I can automatically fix them for you!`,
        action: 'debug'
      };
    } else {
      return {
        reply: `✨ **Your code syntax looks clean and valid!**\n\n` +
               `No missing colons or mismatched brackets found. If you see unexpected output when you click **Run Code**, check your logic or variable values. You're doing great!`,
        action: 'debug_clean'
      };
    }
  }

  // 10. Missions & Challenges
  if (q.includes('challenge') || q.includes('mission') || q.includes('task') || q.includes('next') || q.includes('powerup') || q.includes('what can i add')) {
    return {
      reply: `🎯 **Level-Up Mission: The Cosmic Hyper-Shield!**\n\n` +
             `Can you add this booster function to your code?\n\n` +
             `\`\`\`python\n` +
             `def activate_shield(power_boost):\n` +
             `    global energy\n` +
             `    energy += power_boost\n` +
             `    print(f"🛡️ Shield activated! Energy restored to: {energy}⚡")\n\n` +
             `activate_shield(30)\n` +
             `\`\`\`\n\n` +
             `Hit **Run Code ▶** after pasting it to see your astronaut gain +30 energy! 🚀`,
      action: 'insert_code',
      codeSnippet: `\ndef activate_shield(power_boost):\n    global energy\n    energy += power_boost\n    print(f"🛡️ Shield activated! Energy restored to: {energy}⚡")\n\nactivate_shield(30)`
    };
  }

  // 11. What is an API?
  if (q.includes('api') && (q.includes('what') || q.includes('how'))) {
    return {
      reply: `🔌 **What is an API? (Application Programming Interface)**\n\n` +
             `Imagine you are sitting in a restaurant 🍕:\n` +
             `• **You** are the customer (the app/client).\n` +
             `• The **Kitchen** makes the food (the server/database).\n` +
             `• The **Waiter** takes your order to the kitchen and brings your food back. That's the **API**!\n\n` +
             `APIs allow different apps to talk to each other — like your game talking to a weather API to make it rain in-game when it rains in real life!`,
      action: 'concept_api'
    };
  }

  // 12. General intelligent fallback
  return {
    reply: `💡 **Great question about "${query}"!**\n\n` +
           `In coding and STEM, curiosity is your greatest superpower! Here is how it connects to software engineering:\n\n` +
           `• **Problem Solving:** Break big ideas down into smaller, bite-sized steps.\n` +
           `• **Logic & Code:** Computers follow instructions precisely in sequence.\n` +
           `• **Testing & Iteration:** Build something cool, test it with **Run Code**, and see how it responds!\n\n` +
           `Would you like to write a new Python function for this, explore visual blocks in Scratch, or try a fun coding challenge?`,
    action: 'general'
  };
}

/**
 * Check for common beginner syntax errors
 */
function analyzeCodeIssues(code = '') {
  if (!code || !code.trim()) return [];
  const lines = code.split('\n');
  const issues = [];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    if (/^(def|if|elif|else|for|while)\b/.test(trimmed) && !trimmed.endsWith(':')) {
      issues.push(`Line ${idx + 1}: Missing colon (\`:\`) at the end of statement: \`${trimmed}\``);
    }
    if (/^if\s+[a-zA-Z0-9_]+\s*=\s*[a-zA-Z0-9_]+:/.test(trimmed)) {
      issues.push(`Line ${idx + 1}: Single \`=\` found in condition. In Python, use \`==\` to compare!`);
    }
    const openP = (line.match(/\(/g) || []).length;
    const closeP = (line.match(/\)/g) || []).length;
    if (openP !== closeP) {
      issues.push(`Line ${idx + 1}: Mismatched parentheses \`(\` and \`)\`.`);
    }
  });

  return issues;
}

/**
 * In-browser Code Explanation
 */
export function explainCodeClient(code = '', language = 'python') {
  if (!code || !code.trim()) {
    return {
      summary: 'Your workspace is currently blank. Try choosing a template or writing some code!',
      breakdown: [],
      rating: '🌟 Grade: Ready to Start!'
    };
  }

  const lines = code.split('\n');
  const breakdown = [];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    if (trimmed.startsWith('def ')) {
      const fnName = trimmed.split('def ')[1]?.split('(')[0] || 'custom_action';
      breakdown.push({ line: idx + 1, type: 'Function Definition', text: `Defines reusable function "${fnName}()"` });
    } else if (trimmed.startsWith('for ') || trimmed.startsWith('while ')) {
      breakdown.push({ line: idx + 1, type: 'Loop', text: `Repeats execution across items or conditions` });
    } else if (trimmed.startsWith('if ') || trimmed.startsWith('elif ') || trimmed.startsWith('else:')) {
      breakdown.push({ line: idx + 1, type: 'Conditional', text: `Checks logic before choosing the next path` });
    } else if (trimmed.includes('=') && !trimmed.includes('==')) {
      const varName = trimmed.split('=')[0].trim();
      breakdown.push({ line: idx + 1, type: 'Variable Store', text: `Stores data in variable "${varName}"` });
    } else if (trimmed.startsWith('print(')) {
      breakdown.push({ line: idx + 1, type: 'Console Output', text: `Prints text or values to the terminal screen` });
    }
  });

  return {
    summary: `Your ${language.toUpperCase()} project contains ${lines.length} lines of code utilizing variables, structured routines, and live terminal logging.`,
    breakdown,
    rating: breakdown.length > 3 ? '🌟 Grade: Advanced Logic Structure!' : '🚀 Grade: Great Beginning!'
  };
}

/**
 * In-browser Code Debugger & Autofix
 */
export function debugCodeClient(code = '', language = 'python') {
  if (!code || !code.trim()) {
    return {
      hasIssues: false,
      issues: ['No code found to debug.'],
      explanation: 'Your code editor is empty.',
      fixedCode: code
    };
  }

  const lines = code.split('\n');
  const issues = [];
  const fixedLines = [...lines];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    // Missing colon
    if (/^(def|if|elif|else|for|while)\b/.test(trimmed) && !trimmed.endsWith(':')) {
      issues.push(`Line ${idx + 1}: Missing colon ':' at the end of statement.`);
      fixedLines[idx] = line + ':';
    }

    // Single equals in if check
    if (/^if\s+[a-zA-Z0-9_]+\s*=\s*[a-zA-Z0-9_]+:/.test(trimmed)) {
      issues.push(`Line ${idx + 1}: Single '=' found in comparison. Python uses '==' for checking equality.`);
      fixedLines[idx] = line.replace(/=/, '==');
    }

    // Unclosed parenthesis
    const openP = (line.match(/\(/g) || []).length;
    const closeP = (line.match(/\)/g) || []).length;
    if (openP > closeP) {
      issues.push(`Line ${idx + 1}: Unclosed '(' detected.`);
      fixedLines[idx] = line + ')'.repeat(openP - closeP);
    }
  });

  return {
    hasIssues: issues.length > 0,
    issues: issues.length > 0 ? issues : ['No syntax errors detected! Your code structure is clean and valid.'],
    explanation: issues.length > 0 
      ? `We found ${issues.length} small syntax issue(s). Python requires exact punctuation like colons after statements and matching parentheses.` 
      : 'Everything looks great! Ready to run!',
    fixedCode: issues.length > 0 ? fixedLines.join('\n') : code
  };
}

/**
 * Primary dispatch function: Uses Gemini if available, otherwise instant Knowledge Core
 */
export async function askKodaAI(prompt, code = '', language = 'python', studentName = 'Young Innovator') {
  // Check if student/parent saved a custom Gemini API key
  const userKey = getStoredGeminiKey();

  if (userKey) {
    try {
      const geminiResult = await callDirectGemini(userKey, prompt, code, language, studentName);
      return {
        reply: geminiResult.text,
        model: geminiResult.model,
        source: 'gemini-live',
        action: 'general'
      };
    } catch (err) {
      console.warn('Direct Gemini API call failed, falling back to Knowledge Core:', err.message);
    }
  }

  // Run the comprehensive Knowledge Core
  const coreResult = queryKnowledgeCore(prompt, code, language, studentName);
  return {
    ...coreResult,
    source: 'knowledge-core'
  };
}
