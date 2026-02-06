export default function TestTailwind() {
    return (
        <div>
            {/* Inline styles - these work */}
            <div style={{ backgroundColor: '#3b82f6', color: 'white', padding: '20px', marginBottom: '20px' }}>
                ✅ INLINE STYLES (should be BLUE)
            </div>

            {/* Tailwind classes - let's test if these work */}
            <div className="bg-green-600 text-white p-5 mb-5">
                🎨 TAILWIND CLASSES (should be GREEN if Tailwind works)
            </div>

            <div className="bg-red-600 text-white p-5 rounded-lg">
                🔴 Another Tailwind test (should be RED with rounded corners)
            </div>
        </div>
    );
}
