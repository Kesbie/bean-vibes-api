#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

async function runCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'development' }
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command ${command} ${args.join(' ')} exited with code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  const confirm = args.includes('--confirm') || args.includes('-y');

  if (!confirm) {
    console.log('⚠️  WARNING: This will reset your database and run all seeding scripts!');
    console.log('This action cannot be undone.');
    console.log('');
    console.log('To proceed, run: npm run reset-db -- --confirm');
    console.log('Or: npm run reset-db -- -y');
    process.exit(1);
  }

  try {
    console.log('🔄 Starting database reset and seeding process...\n');

    // Run all seeding scripts
    console.log('📦 Running all seeding scripts...');
    await runCommand('node', [path.join(__dirname, 'seed.js'), 'all']);

    console.log('\n🎉 Database reset and seeding completed successfully!');
    console.log('Your database is now ready with sample data.');
  } catch (error) {
    console.error('\n❌ Error during database reset:', error.message);
    process.exit(1);
  }
}

main().catch(console.error); 