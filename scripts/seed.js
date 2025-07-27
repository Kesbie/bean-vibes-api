#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

const scripts = {
  'categories': 'seedCategories.js',
  'places': 'seedPlaces.js', 
  'users': 'seedUsers.js',
  'restricted-words': 'seedRestrictedWords.js',
  'all': ['categories', 'places', 'users', 'restricted-words']
};

function runScript(scriptName) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, scriptName);
    const child = spawn('node', [scriptPath], {
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'development' }
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Script ${scriptName} exited with code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: npm run seed <script-name>');
    console.log('Available scripts:');
    Object.keys(scripts).forEach(script => {
      if (script !== 'all') {
        console.log(`  - ${script}`);
      }
    });
    console.log('  - all (runs all scripts in sequence)');
    process.exit(1);
  }

  const scriptName = args[0];

  if (scriptName === 'all') {
    console.log('Running all seeding scripts...\n');
    for (const script of scripts.all) {
      console.log(`\n=== Running ${script} ===`);
      try {
        await runScript(scripts[script]);
        console.log(`✓ ${script} completed successfully`);
      } catch (error) {
        console.error(`✗ ${script} failed:`, error.message);
        process.exit(1);
      }
    }
    console.log('\n🎉 All seeding scripts completed successfully!');
  } else if (scripts[scriptName]) {
    console.log(`Running ${scriptName}...`);
    try {
      await runScript(scripts[scriptName]);
      console.log(`\n🎉 ${scriptName} completed successfully!`);
    } catch (error) {
      console.error(`\n✗ ${scriptName} failed:`, error.message);
      process.exit(1);
    }
  } else {
    console.error(`Unknown script: ${scriptName}`);
    console.log('Available scripts:', Object.keys(scripts).join(', '));
    process.exit(1);
  }
}

main().catch(console.error); 