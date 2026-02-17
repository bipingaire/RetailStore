
try {
    const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
    console.log('✅ pdfjs-dist loaded successfully!');
    console.log('Version:', pdfjsLib.version);
} catch (error) {
    console.error('❌ Failed to load pdfjs-dist:', error.message);
    try {
        console.log('Trying standard require...');
        const pdfjsLib2 = require('pdfjs-dist');
        console.log('✅ Loaded via standard require!');
    } catch (e2) {
        console.error('❌ Standard require failed too:', e2.message);
    }
}
