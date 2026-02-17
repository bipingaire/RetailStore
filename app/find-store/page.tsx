export default function FindStorePage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="text-4xl font-bold mb-8">Find Your Nearest Store</h1>
            <p className="text-xl mb-4">Welcome to InduMart.us!</p>
            <div className="p-6 border rounded-lg shadow-lg">
                <p>Please enter your zip code or enable location services to find a store near you.</p>
                <div className="mt-4">
                    {/* Placeholder for location logic */}
                    <input type="text" placeholder="Zip Code" className="border p-2 rounded mr-2" />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded">Search</button>
                </div>
            </div>
        </div>
    );
}
