/**
 * Security Check Script for VEK ProofGate
 * This script scans the codebase to ensure no real API keys, PEM files, 
 * or un-ignored env files are checked into the repository.
 */
import fs from 'fs';
import path from 'path';

const IGNORED_DIRS = ['node_modules', 'dist', '.git', 'coverage', '.vite', '.output'];
const FORBIDDEN_EXTENSIONS = ['.pem', '.key', '.pfx', '.p12'];

// RegExp patterns without /g to avoid stateful lastIndex pitfalls
const KEY_PATTERNS = [
  /sk-[a-zA-Z0-9]{32,}/, // Generic OpenAI key pattern
  /AIzaSy[a-zA-Z0-9_-]{33}/ // Google API key pattern
];

// File extensions we should skip scanning content of (binary formats)
const BINARY_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.pdf', '.woff', '.woff2', '.ttf', '.eot', '.zip', '.tar', '.gz'];

let issuesFound = 0;

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (IGNORED_DIRS.includes(file)) continue;
      scanDirectory(fullPath);
    } else {
      // Check forbidden file extensions
      const ext = path.extname(file).toLowerCase();
      if (FORBIDDEN_EXTENSIONS.includes(ext)) {
        console.error(`[SEC-ERR] Forbidden file extension detected: ${fullPath}`);
        issuesFound++;
      }

      // Check for un-ignored env files (anything starting with .env except .env.example)
      if (file.startsWith('.env') && file !== '.env.example') {
        console.error(`[SEC-ERR] Un-ignored environment file detected: ${fullPath}`);
        issuesFound++;
      }

      // Scan file content for key patterns (skip binaries)
      if (!BINARY_EXTENSIONS.includes(ext)) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          
          for (const pattern of KEY_PATTERNS) {
            const match = pattern.exec(content);
            if (match) {
              const matchedSecret = match[0];
              // Ensure we aren't flagging standard placeholder strings
              if (
                matchedSecret !== 'your_openai_api_key_here' && 
                matchedSecret !== 'your_openai_api_key' &&
                !content.includes('your_openai_api_key_here')
              ) {
                // Redact the match for output reporting
                const redacted = matchedSecret.substring(0, 4) + '...' + matchedSecret.substring(matchedSecret.length - 4);
                console.error(`[SEC-ERR] Potential API Key / Secret detected in file: ${fullPath} (Matches pattern: ${pattern}, Value redacted: ${redacted})`);
                issuesFound++;
              }
            }
          }
        } catch (err) {
          // Skip unreadable or system files safely
        }
      }
    }
  }
}

console.log('--- STARTING SECURITY COMPLIANCE SCAN ---');
try {
  scanDirectory(process.cwd());
  if (issuesFound === 0) {
    console.log('✓ SUCCESS: No credentials, PEM keys, or un-ignored environment files detected!');
    process.exit(0);
  } else {
    console.error(`\n✗ FAILED: Detected ${issuesFound} security issues.`);
    process.exit(1);
  }
} catch (error) {
  console.error('Scan error:', error);
  process.exit(1);
}
