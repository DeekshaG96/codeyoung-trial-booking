import { describe, expect, it } from 'vitest';

// Test code execution simulation logic
function simulatePython(code) {
  const lines = code.split('\n');
  const variables = {};
  const logs = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('#')) continue;

    if (/^(def|if|elif|else|for|while)\b/.test(line) && !line.endsWith(':')) {
      throw new Error(`SyntaxError: line ${i + 1}: expected ':' at end of line`);
    }

    if (line.includes('=') && !line.startsWith('print') && !line.startsWith('if') && !line.startsWith('for')) {
      const [varName, valExpr] = line.split('=').map(s => s.trim());
      if (varName && valExpr) {
        if ((valExpr.startsWith('"') && valExpr.endsWith('"')) || (valExpr.startsWith("'") && valExpr.endsWith("'"))) {
          variables[varName] = valExpr.slice(1, -1);
        } else if (!isNaN(Number(valExpr))) {
          variables[varName] = Number(valExpr);
        } else {
          variables[varName] = valExpr;
        }
      }
    }

    if (line.startsWith('print(') && line.endsWith(')')) {
      let inner = line.slice(6, -1).trim();
      if ((inner.startsWith('f"') && inner.endsWith('"')) || (inner.startsWith("f'") && inner.endsWith("'"))) {
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
  }

  return { logs, variables };
}

// In-engine debugger autofix logic
function debugCode(code) {
  const lines = code.split('\n');
  const issues = [];
  const fixedLines = [...lines];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    if (/^(def|if|elif|else|for|while)\b/.test(trimmed) && !trimmed.endsWith(':')) {
      issues.push(`Line ${idx + 1}: Missing colon ':' at the end of statement.`);
      fixedLines[idx] = line + ':';
    }

    if (/^if\s+[a-zA-Z0-9_]+\s*=\s*[a-zA-Z0-9_]+:/.test(trimmed)) {
      issues.push(`Line ${idx + 1}: Single '=' found in comparison. In Python, use '==' to check equality.`);
      fixedLines[idx] = line.replace(/=/, '==');
    }

    const openP = (line.match(/\(/g) || []).length;
    const closeP = (line.match(/\)/g) || []).length;
    if (openP > closeP) {
      issues.push(`Line ${idx + 1}: Unclosed '(' detected.`);
      fixedLines[idx] = line + ')'.repeat(openP - closeP);
    }
  });

  return { hasIssues: issues.length > 0, issues, fixedCode: fixedLines.join('\n') };
}

describe('Virtual Classroom Code Sandbox & AI Logic Tests', () => {
  it('correctly executes Python variables and f-string printing', () => {
    const code = `
player = "Leo"
score = 100
print(f"Astronaut {player} has score {score}")
    `;
    const res = simulatePython(code);
    expect(res.variables.player).toBe('Leo');
    expect(res.variables.score).toBe(100);
    expect(res.logs[0]).toBe('Astronaut Leo has score 100');
  });

  it('detects syntax error when colon is missing after function or loop', () => {
    const brokenCode = `
def explore_planet()
    print("Exploring...")
    `;
    expect(() => simulatePython(brokenCode)).toThrow("SyntaxError: line 2: expected ':' at end of line");
  });

  it('autofixes missing colons in Python statements', () => {
    const code = 'def launch_rocket()\n    print("Lift off!")';
    const result = debugCode(code);
    expect(result.hasIssues).toBe(true);
    expect(result.issues[0]).toContain("Missing colon ':'");
    expect(result.fixedCode).toContain('def launch_rocket():');
  });

  it('autofixes single = to == in conditionals', () => {
    const code = 'if energy = 0:\n    print("Game Over")';
    const result = debugCode(code);
    expect(result.hasIssues).toBe(true);
    expect(result.issues[0]).toContain("Single '=' found in comparison");
    expect(result.fixedCode).toContain('if energy == 0:');
  });

  it('detects and balances unclosed parentheses', () => {
    const code = 'print("Hello Space Cadet"';
    const result = debugCode(code);
    expect(result.hasIssues).toBe(true);
    expect(result.fixedCode).toBe('print("Hello Space Cadet")');
  });
});
