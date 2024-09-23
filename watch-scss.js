import chokidar from 'chokidar';
import { spawn } from 'child_process';

// Watcher
chokidar.watch('src/styles/**/*.scss').on('change', (event, path) => {
  console.log(`File ${event} has been changed. Compiling...`);
  const process = spawn('pnpm', ['scss'], { shell: true });

  process.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  process.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  process.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
});

console.log('Watching SCSS files for changes...');