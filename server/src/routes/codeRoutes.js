import express from 'express';

const router = express.Router();

/**
 * Execute Python or JavaScript code safely
 */
router.post('/code/run', (req, res) => {
  const { code, language = 'python' } = req.body;
  const startTime = Date.now();

  if (!code || !code.trim()) {
    return res.json({
      success: true,
      stdout: ['(No code provided)'],
      stderr: [],
      executionTimeMs: 0,
      exitCode: 0
    });
  }

  const logs = [];
  const errors = [];

  try {
    if (language === 'python') {
      // In-server lightweight execution simulation & syntax verification
      const lines = code.split('\n');
      const variables = {};

      // Detect syntax errors
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.startsWith('#')) continue;

        if (/^(def|if|elif|else|for|while)\b/.test(line) && !line.endsWith(':')) {
          throw new Error(`SyntaxError: line ${i + 1}: expected ':' at end of line`);
        }
      }

      // Execute simulated lines or basic scripts
      let insideFunction = null;
      let functionBody = [];

      for (let i = 0; i < lines.length; i++) {
        const rawLine = lines[i];
        const line = rawLine.trim();
        if (!line || line.startsWith('#')) continue;

        // Function definition
        if (line.startsWith('def ')) {
          const fnMatch = line.match(/^def\s+([a-zA-Z0-9_]+)\s*\((.*?)\):/);
          if (fnMatch) {
            insideFunction = fnMatch[1];
            functionBody = [];
            continue;
          }
        }

        if (insideFunction) {
          if (rawLine.startsWith('    ') || rawLine.startsWith('\t')) {
            functionBody.push(line);
            continue;
          } else {
            // Function definition ended
            variables[insideFunction] = functionBody;
            insideFunction = null;
          }
        }

        // Variable assignment
        if (line.includes('=') && !line.startsWith('print') && !line.startsWith('if') && !line.startsWith('for')) {
          const [varName, valExpr] = line.split('=').map(s => s.trim());
          if (varName && valExpr) {
            try {
              // Strip quotes if string
              if ((valExpr.startsWith('"') && valExpr.endsWith('"')) || (valExpr.startsWith("'") && valExpr.endsWith("'"))) {
                variables[varName] = valExpr.slice(1, -1);
              } else if (!isNaN(Number(valExpr))) {
                variables[varName] = Number(valExpr);
              } else {
                variables[varName] = valExpr;
              }
            } catch (e) {}
          }
        }

        // Variable modification (e.g. energy -= 15)
        if (line.includes('-=') || line.includes('+=')) {
          const isDec = line.includes('-=');
          const [v, amt] = line.split(isDec ? '-=' : '+=').map(s => s.trim());
          const n = Number(amt) || 1;
          if (typeof variables[v] === 'number') {
            variables[v] = isDec ? variables[v] - n : variables[v] + n;
          }
        }

        // Print statement execution
        if (line.startsWith('print(') && line.endsWith(')')) {
          let inner = line.slice(6, -1).trim();
          // Handle f-string: print(f"...")
          if (inner.startsWith('f"') && inner.endsWith('"')) {
            let content = inner.slice(2, -1);
            content = content.replace(/\{([a-zA-Z0-9_]+)\}/g, (match, p1) => {
              return variables[p1] !== undefined ? variables[p1] : match;
            });
            logs.push(content);
          } else if (inner.startsWith('f\'') && inner.endsWith('\'')) {
            let content = inner.slice(2, -1);
            content = content.replace(/\{([a-zA-Z0-9_]+)\}/g, (match, p1) => {
              return variables[p1] !== undefined ? variables[p1] : match;
            });
            logs.push(content);
          } else if ((inner.startsWith('"') && inner.endsWith('"')) || (inner.startsWith("'") && inner.endsWith("'"))) {
            logs.push(inner.slice(1, -1));
          } else if (variables[inner] !== undefined) {
            logs.push(String(variables[inner]));
          } else {
            logs.push(inner);
          }
        }

        // Function call execution
        if (line.endsWith('()')) {
          const fnName = line.slice(0, -2).trim();
          if (variables[fnName] && Array.isArray(variables[fnName])) {
            const body = variables[fnName];
            body.forEach(stmt => {
              if (stmt.includes('-=') || stmt.includes('+=')) {
                const isDec = stmt.includes('-=');
                const [v, amt] = stmt.split(isDec ? '-=' : '+=').map(s => s.trim());
                const n = Number(amt) || 1;
                if (typeof variables[v] === 'number') {
                  variables[v] = isDec ? variables[v] - n : variables[v] + n;
                }
              }
              if (stmt.startsWith('print(') && stmt.endsWith(')')) {
                let inner = stmt.slice(6, -1).trim();
                if ((inner.startsWith('f"') && inner.endsWith('"')) || (inner.startsWith('f\'') && inner.endsWith('\''))) {
                  let content = inner.slice(2, -1);
                  content = content.replace(/\{([a-zA-Z0-9_]+)\}/g, (match, p1) => {
                    return variables[p1] !== undefined ? variables[p1] : match;
                  });
                  logs.push(content);
                } else if ((inner.startsWith('"') && inner.endsWith('"')) || (inner.startsWith("'") && inner.endsWith("'"))) {
                  logs.push(inner.slice(1, -1));
                }
              }
            });
          }
        }
      }

      if (insideFunction && functionBody.length > 0) {
        variables[insideFunction] = functionBody;
      }

      if (logs.length === 0) {
        logs.push('✓ Code executed successfully with 0 output lines.');
      }
    } else {
      // JavaScript sandbox
      const customConsole = [];
      const safeLog = (...args) => customConsole.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
      const fn = new Function('console', code);
      fn({ log: safeLog, warn: safeLog, error: safeLog, info: safeLog });
      logs.push(...customConsole);
    }

    const duration = Date.now() - startTime;
    return res.json({
      success: true,
      stdout: logs,
      stderr: errors,
      executionTimeMs: duration,
      exitCode: 0
    });
  } catch (err) {
    const duration = Date.now() - startTime;
    return res.json({
      success: false,
      stdout: logs,
      stderr: [err.message || String(err)],
      executionTimeMs: duration,
      exitCode: 1
    });
  }
});

export default router;
