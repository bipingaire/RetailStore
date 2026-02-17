
try {
    const pdfImgConvert = require('pdf-img-convert');
    console.log('✅ pdf-img-convert is installed and required successfully.');
    console.log('Type:', typeof pdfImgConvert);
    console.log('Functions:', Object.keys(pdfImgConvert));
} catch (error) {
    console.error('❌ Failed to require pdf-img-convert:', error.message);
}
