export default function TestPage() {
    return (
        <div style={{
            backgroundColor: '#10b981',
            color: 'white',
            padding: '40px',
            textAlign: 'center',
            fontFamily: 'Arial, sans-serif'
        }}>
            <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>
                ✅ INLINE STYLES WORK!
            </h1>
            <p style={{ fontSize: '24px' }}>
                If you can see this GREEN background and WHITE text, then inline styles are working.
            </p>
            <div style={{
                backgroundColor: 'white',
                color: 'black',
                padding: '20px',
                marginTop: '20px',
                borderRadius: '10px'
            }}>
                This is a white box with black text
            </div>
        </div>
    );
}
