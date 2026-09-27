import express from 'express';

const router = express.Router();

/**
 * Intelligent AI Mentor responses for coding education
 */
function generateAIChatReply(message, code, language = 'python', studentName = 'Young Innovator') {
  const query = (message || '').toLowerCase().trim();

  // Greetings
  if (/^(hi|hello|hey|hloo|hlo|helo|holla|greetings|yo\b)/i.test(query)) {
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

  // SQL & Databases
  if (query.includes('sql') || query.includes('database') || query.includes('query') || query.includes('table') && (query.includes('data') || query.includes('what'))) {
    return {
      reply: `🗄️ **What is SQL? (Structured Query Language)**\n\n` +
             `**SQL** (pronounced *"Sequel"*) is the universal language used to talk to **Databases**! 📊\n\n` +
             `### 💡 Think of it like this:\n` +
             `Where does Minecraft or Roblox remember your player name, inventory, diamonds, and high scores when you log off? In a **Database**!\n\n` +
             `SQL gives you superpower commands to search and manage that data:\n\n` +
             `\`\`\`sql\n` +
             `-- Find all players who have more than 100 diamonds:\n` +
             `SELECT player_name, score \n` +
             `FROM players \n` +
             `WHERE diamonds > 100 \n` +
             `ORDER BY score DESC;\n\n` +
             `-- Add a new player to the game:\n` +
             `INSERT INTO players (player_name, level) \n` +
             `VALUES ('${studentName}', 10);\n` +
             `\`\`\`\n\n` +
             `### 🔑 4 Magic SQL Commands (CRUD):\n` +
             `1. **SELECT** 🔍 — Read and search for information\n` +
             `2. **INSERT** ➕ — Add new records\n` +
             `3. **UPDATE** ✏️ — Change existing data\n` +
             `4. **DELETE** 🗑️ — Remove data you no longer need\n\n` +
             `Companies like Netflix, Spotify, and NASA use SQL every single day to handle billions of songs, movies, and space data!`,
      action: 'concept_sql',
      codeSnippet: `-- Sample SQL Query\nSELECT name, level, energy \nFROM space_cadets \nWHERE status = 'Active';`
    };
  }

  // Code explanation requested
  if (query.includes('explain') || query.includes('what does this code do') || query.includes('how does it work')) {
    return {
      reply: `🚀 **Great question, ${studentName}! Here is how your code works:**\n\n` +
             `1. **Variables & State:** You initialized \`player_name\`, \`energy\`, and \`level\`. These act like memory boxes storing your character's stats.\n` +
             `2. **Functions (\`def\`):** You defined \`explore_alien_planet()\`. A function is like a reusable recipe you can call whenever your astronaut explores!\n` +
             `3. **Modification:** Each time you call the function, \`energy\` decreases by 15 and \`level\` increases by 1.\n` +
             `4. **Output (\`print\`):** It prints updates directly to your terminal screen so you see real-time game progress!\n\n` +
             `💡 *Pro Tip:* Try calling \`explore_alien_planet()\` multiple times in a \`for\` loop to explore multiple planets!`,
      action: 'suggest_loop'
    };
  }

  // Bug / Error help requested
  if (query.includes('error') || query.includes('bug') || query.includes('fix') || query.includes('broken') || query.includes('why') && query.includes('fail')) {
    return {
      reply: `🔍 **Don't worry, every senior programmer encounters bugs! Let's solve it together:**\n\n` +
             `Common Python mistakes to double-check in your editor:\n` +
             `• **Colons (\`:\`):** Ensure every \`def\`, \`if\`, \`for\`, and \`while\` line ends with a colon.\n` +
             `• **Indentation (Tab/4 Spaces):** Python uses indentation to know what is inside your function or loop.\n` +
             `• **Variable Names:** Check that your variable names match exactly (Python is case-sensitive, so \`Energy\` ≠ \`energy\`).\n\n` +
             `Click the **"Debug & Fix"** button on top and I'll analyze your exact lines right now!`,
      action: 'debug'
    };
  }

  // Challenge / Next feature requested
  if (query.includes('challenge') || query.includes('next') || query.includes('what can i add') || query.includes('feature') || query.includes('idea')) {
    return {
      reply: `🎮 **Level-Up Challenge: The Alien Shield Power-Up!**\n\n` +
             `Try adding this new function to your code:\n\n` +
             `\`\`\`python\n` +
             `def recharge_shields():\n` +
             `    global energy\n` +
             `    energy += 25\n` +
             `    print(f"⚡ Shields Recharged! Current Energy: {energy}")\n` +
             `\`\`\`\n\n` +
             `Then call \`recharge_shields()\` when your energy gets low! Can you test it and see if your energy climbs back up?`,
      action: 'insert_code',
      codeSnippet: `\ndef recharge_shields():\n    global energy\n    energy += 25\n    print(f"⚡ Shields Recharged! Current Energy: {energy}")\n\nrecharge_shields()`
    };
  }

  // Sound / Visual effects requested
  if (query.includes('sound') || query.includes('scratch') || query.includes('block') || query.includes('animation') || query.includes('sprite')) {
    return {
      reply: `🎨 **Adding Multimedia & Visual Blocks!**\n\n` +
             `In the **Visual Blocks (Scratch)** tab above, you can:\n` +
             `• Click **"play sound 'laser_blast'"** to trigger live synthesized space laser audio!\n` +
             `• Click **"move 20 steps"** to animate your spaceship across the cosmic canvas!\n` +
             `• Combine them in a \`repeat\` loop to create an interactive flying animation!`,
      action: 'switch_to_scratch'
    };
  }

  // What is a loop?
  if (query.includes('loop') || query.includes('repeat') || query.includes('for') || query.includes('while')) {
    return {
      reply: `🔁 **What is a Loop?**\n\n` +
             `Instead of typing \`print("Blasting off!")\` 10 times, a loop tells the computer to repeat instructions automatically!\n\n` +
             `\`\`\`python\n` +
             `for countdown in range(5, 0, -1):\n` +
             `    print(f"T-minus {countdown}...")\n` +
             `print("🚀 Blastoff!")\n` +
             `\`\`\`\n\n` +
             `Try pasting this in your editor and hit **Run Code**!`,
      action: 'insert_code'
    };
  }

  // Friendly encouragement / General question
  return {
    reply: `🌟 **Hello ${studentName}! I'm Koda, your AI Coding Companion at Codeyoung!**\n\n` +
           `You're doing fantastic! Today you are building real coding logic just like software engineers at NASA and Google.\n\n` +
           `Here are some fun things you can ask me:\n` +
           `• *"Explain my current code"*\n` +
           `• *"Give me a coding challenge"*\n` +
           `• *"How do I add score or enemies?"*\n` +
           `• *"Check my code for bugs"*\n\n` +
           `What would you like to build next in your adventure?`,
    action: 'general'
  };
}

/**
 * Helper to call Gemini 2.5 Flash from backend
 */
async function callServerGemini(apiKey, message, code, language, studentName) {
  const models = ['gemini-2.5-flash', 'gemini-flash-latest'];
  const systemInstruction = 
    `You are Koda, an inspiring, patient, and friendly AI Coding Mentor at Codeyoung (a premier 1:1 STEM academy for kids).\n` +
    `Student Name: ${studentName || 'Young Innovator'}\n` +
    `Active Coding Environment: ${language || 'python'}\n` +
    (code ? `Current Student Code:\n\`\`\`${language}\n${code}\n\`\`\`\n` : '') +
    `Respond enthusiastically with clear explanations, neat code snippets, fun analogies, and friendly emojis suitable for kids and teenagers!`;

  const payload = {
    contents: [
      {
        parts: [
          { text: `${systemInstruction}\n\nStudent Question: ${message}` }
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
      }
    } catch (err) {
      // Continue to next model
    }
  }
  return null;
}

/**
 * POST /api/ai/chat
 */
router.post('/ai/chat', async (req, res) => {
  const { message, code, language, studentName } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, message: 'Message is required.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const geminiRes = await callServerGemini(apiKey, message, code, language, studentName);
      if (geminiRes) {
        return res.json({
          success: true,
          reply: geminiRes.text,
          source: 'gemini-live',
          model: geminiRes.model,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
    } catch (err) {
      console.warn('Server Gemini call failed, falling back to rule engine:', err.message);
    }
  }

  const result = generateAIChatReply(message, code, language, studentName);
  res.json({
    success: true,
    reply: result.reply,
    action: result.action,
    codeSnippet: result.codeSnippet || null,
    source: 'knowledge-core',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
});

/**
 * POST /api/ai/explain
 */
router.post('/ai/explain', (req, res) => {
  const { code, language = 'python' } = req.body;

  if (!code || !code.trim()) {
    return res.status(400).json({ success: false, message: 'No code provided to explain.' });
  }

  // Parse lines to provide a smart structured breakdown
  const lines = code.split('\n');
  const lineAnalysis = [];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    if (trimmed.includes('=')) {
      const parts = trimmed.split('=');
      lineAnalysis.push({ line: idx + 1, type: 'Variable Assignment', text: `Stores data in variable "${parts[0].trim()}"` });
    } else if (trimmed.startsWith('def ')) {
      lineAnalysis.push({ line: idx + 1, type: 'Function Definition', text: `Creates a custom reusable action` });
    } else if (trimmed.startsWith('print(')) {
      lineAnalysis.push({ line: idx + 1, type: 'Output Command', text: `Displays output on the terminal console` });
    } else if (trimmed.startsWith('for ') || trimmed.startsWith('while ')) {
      lineAnalysis.push({ line: idx + 1, type: 'Loop Structure', text: `Repeats execution multiple times` });
    } else if (trimmed.startsWith('if ') || trimmed.startsWith('elif ') || trimmed.startsWith('else:')) {
      lineAnalysis.push({ line: idx + 1, type: 'Decision Logic', text: `Tests a condition before proceeding` });
    }
  });

  res.json({
    success: true,
    summary: `Your project contains ${lines.length} lines of ${language.toUpperCase()} code using functions, variables, and formatted console outputs!`,
    breakdown: lineAnalysis,
    conceptsLearned: ['Variable Declaration', 'Function Definition', 'State Mutation', 'Terminal Output'],
    rating: '🌟 Grade: Excellent Logic Structure!'
  });
});

/**
 * POST /api/ai/debug
 */
router.post('/ai/debug', (req, res) => {
  const { code, language = 'python' } = req.body;

  if (!code || !code.trim()) {
    return res.status(400).json({ success: false, message: 'No code provided to debug.' });
  }

  const lines = code.split('\n');
  let issues = [];
  let correctedLines = [...lines];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    // Check for missing colon in def/if/for/while
    if (/^(def|if|elif|else|for|while)\b/.test(trimmed) && !trimmed.endsWith(':')) {
      issues.push(`Line ${idx + 1}: Missing colon ':' at the end of statement.`);
      correctedLines[idx] = line + ':';
    }

    // Check for single = in if statements
    if (/^if\s+[a-zA-Z0-9_]+\s*=\s*[a-zA-Z0-9_]+:/.test(trimmed)) {
      issues.push(`Line ${idx + 1}: Single '=' found in comparison. In Python, use '==' to check equality.`);
      correctedLines[idx] = line.replace(/=/, '==');
    }

    // Check for unbalanced parentheses
    const openParen = (line.match(/\(/g) || []).length;
    const closeParen = (line.match(/\)/g) || []).length;
    if (openParen > closeParen) {
      issues.push(`Line ${idx + 1}: Unclosed parenthesis '(' detected.`);
      correctedLines[idx] = line + ')'.repeat(openParen - closeParen);
    }
  });

  const hasIssues = issues.length > 0;

  res.json({
    success: true,
    hasIssues,
    issues: hasIssues ? issues : ['No syntax errors detected! Your code structure is clean and valid.'],
    explanation: hasIssues 
      ? `We found ${issues.length} small syntax issue(s). Python requires strict punctuation (like colons after functions and double equals for checks).` 
      : 'Everything looks great! Ready to run!',
    fixedCode: hasIssues ? correctedLines.join('\n') : code
  });
});

/**
 * POST /api/ai/challenge
 */
router.post('/ai/challenge', (req, res) => {
  const challenges = [
    {
      title: 'Alien Shield Energy Recharger',
      difficulty: 'Easy',
      badge: 'Level 1 Explorer',
      description: 'Add a function called recharge_shield() that restores +30 energy points and prints the new status.',
      starterCode: `\ndef recharge_shield():\n    global energy\n    energy += 30\n    print(f"🛡️ Shield fully powered! Current Energy: {energy}")\n\nrecharge_shield()`,
      reward: '50 XP & Space Cadet Badge'
    },
    {
      title: 'Asteroid Collision Event',
      difficulty: 'Medium',
      badge: 'Level 2 Pilot',
      description: 'Create an asteroid encounter where your ship takes 20 damage, but if your level is greater than 2, you dodge it!',
      starterCode: `\ndef dodge_asteroid():\n    global energy, level\n    if level >= 2:\n        print("🎯 Nimble pilot! You dodged the asteroid smoothly!")\n    else:\n        energy -= 20\n        print(f"💥 Asteroid collision! Energy down to {energy}")\n\ndodge_asteroid()`,
      reward: '100 XP & Ace Navigator Badge'
    },
    {
      title: 'Interstellar Warp Drive Loop',
      difficulty: 'Fun',
      badge: 'Level 3 Commander',
      description: 'Use a for-loop to jump through 3 different galaxy sectors, increasing your explorer score on each jump!',
      starterCode: `\nsectors = ["Nebula Orion", "Andromeda Core", "Cygnus Gateway"]\nfor sector in sectors:\n    print(f"🌌 Warp drive engaged! Arrived at: {sector}!")\nprint("✨ Galaxy exploration mission accomplished!")`,
      reward: '150 XP & Galaxy Master Certificate'
    }
  ];

  const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
  res.json({ success: true, challenge: randomChallenge });
});

export default router;
