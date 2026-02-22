const fs = require('fs').promises;
const path = require('path');

async function convertHeicToJpg() {
    const heic2any = await import('heic2any');
    const sourceDir = path.join(__dirname, 'public', 'images', 'byt');
    
    try {
        const files = await fs.readdir(sourceDir);
        const heicFiles = files.filter(f => f.toLowerCase().endsWith('.heic'));
        
        console.log(`Found ${heicFiles.length} HEIC files to convert\n`);
        
        for (const file of heicFiles) {
            const inputPath = path.join(sourceDir, file);
            const outputPath = path.join(sourceDir, file.replace(/\.heic$/i, '.jpg'));
            
            console.log(`Converting ${file}...`);
            
            try {
                const inputBuffer = await fs.readFile(inputPath);
                const outputBuffer = await heic2any.default({
                    buffer: inputBuffer,
                    format: 'JPEG',
                    quality: 0.85
                });
                
                await fs.writeFile(outputPath, Buffer.from(outputBuffer));
                console.log(`  ✓ Created ${path.basename(outputPath)}`);
            } catch (err) {
                console.error(`  ✗ Error converting ${file}:`, err.message);
            }
        }
        
        console.log('\nConversion complete!');
    } catch (err) {
        console.error('Error:', err.message);
    }
}

convertHeicToJpg();
