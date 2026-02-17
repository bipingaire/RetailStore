
try {
    const { createCanvas } = require('canvas');
    const canvas = createCanvas(200, 200);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, 200, 200);
    console.log('✅ Canvas module works! Created 200x200 canvas.');
    console.log('Buffer length:', canvas.toBuffer().length);
} catch (error) {
    console.error('❌ Canvas module failed:', error.message);
}
