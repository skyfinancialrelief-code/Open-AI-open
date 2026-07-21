/**
 * Security Check Script for VEK ProofGate
 * This script scans the codebase to ensure no real API keys, PEM files, 
 * or un-ignored env files are checked into the repository.
 */
import fs from 'fs';
import path from 'path';

const IGNORED_DIRS = ['node_modules', 'dist', '.git', 'coverage'];
const FORBIDDEN_EXTENSIONS = ['.pem', '.key', '.pfx', '.p12'];
const KEY_PATTERNS = [
  /sk-[a-zA-Z0-9]{32,}/g, // Generic OpenAI key pattern
  /AIzaSy[a-zA-Z0-9_-]{33}/g, // Google API key pattern
];

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
      // Check file extensions
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

      // Scan file content for key patterns (only text files)
      if (['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.txt'].includes(ext)) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          for (const pattern of KEY_PATTERNS) {
            if (pattern.test(content)) {
              // Ensure we aren't flags on placeholder values
              if (!content.includes('your_openai_api_key_here') && !content.includes('MY_GEMINI_API_KEY')) {
                console.error(`[SEC-ERR] Potential API Key / Secret detected in file: ${fullPath}`);
                issuesFound++;
              }
            }
          }
        } catch (err) {
          // Skip unreadable files
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
    console.error(`✗ FAILED: Detected ${issuesFound} security issues.`);
    process.exit(1);
  }
} catch (error) {
  console.error('Scan error:', error);
  process.exit(1);
}
