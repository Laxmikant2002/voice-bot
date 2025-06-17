#!/usr/bin/env node

/**
 * Pre-deployment script for Render.com
 * This script checks for common issues before deploying
 */

const fs = require('fs');
const { execSync } = require('child_process');

console.log('🚀 Running pre-deployment checks for Render.com');

// Check if package.json exists
if (!fs.existsSync('package.json')) {
  console.error('❌ package.json is missing!');
  process.exit(1);
}

// Check for required scripts
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
if (!packageJson.scripts || !packageJson.scripts.start || !packageJson.scripts.build) {
  console.error('❌ Missing required scripts in package.json: "start" and/or "build"');
  process.exit(1);
}

// Check for render.yaml
if (!fs.existsSync('render.yaml')) {
  console.error('⚠️ render.yaml is missing! This is recommended for Render.com deployments.');
}

// Check for .env file
if (!fs.existsSync('.env')) {
  console.warn('⚠️ No .env file found. Make sure to set environment variables in Render.com dashboard.');
} else {
  console.log('✅ .env file found. Remember to transfer these variables to Render.com dashboard.');
}

// Try a test build
try {
  console.log('📦 Running test build...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build successful!');
} catch (error) {
  console.error('❌ Build failed!');
  process.exit(1);
}

console.log('\n✅ All pre-deployment checks passed!');
console.log('\n📝 Deployment Instructions:');
console.log('1. Push your code to a Git repository (GitHub, GitLab, etc.)');
console.log('2. Sign up or log in to Render.com: https://render.com');
console.log('3. Create a new Web Service and connect your Git repository');
console.log('4. Configure the following:');
console.log('   - Build Command: npm install && npm run build');
console.log('   - Start Command: npm start');
console.log('5. Add your environment variables from .env');
console.log('6. Deploy your application');
console.log('\n🎉 Good luck with your deployment!');
