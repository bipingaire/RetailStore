'use client';
import { useState, ChangeEvent } from 'react';

export default function TestParser() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  // 1. Handle File Selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert file to Base64 so we can send it to the API
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string); // Show the image on screen
    };
    reader.readAsDataURL(file);
  };

  // 2. Send to AI
  async function handleScan() {
    if (!preview) {
      alert("Please select a file first!");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/parse-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: preview }), // Send the Base64 string
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      setResult({ error: "Failed to fetch" });
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-10 font-sans">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">🧾 Invoice Scanner</h1>
        
        {/* File Input */}
        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700">Upload Receipt/Invoice</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        {/* Image Preview */}
        {preview && (
          <div className="mb-6">
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Preview</p>
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full max-h-64 object-contain border-2 border-dashed border-gray-200 rounded-lg p-2" 
            />
          </div>
        )}

        {/* Action Button */}
        <button 
          onClick={handleScan}
          disabled={loading || !preview}
          className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Scanning with AI..." : "Extract Data"}
        </button>

        {/* Results Area */}
        {result && (
          <div className="mt-8 pt-8 border-t border-gray-100">
            <h3 className="font-bold text-lg mb-4 text-gray-800">
              {result.success ? "✅ Extracted Items:" : "❌ Error:"}
            </h3>
            
            {result.success ? (
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-96 font-mono text-sm shadow-inner">
                <pre>{JSON.stringify(result.data, null, 2)}</pre>
              </div>
            ) : (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                {JSON.stringify(result)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}