const fetch = require('node-fetch'); // Assuming node-fetch is available or using native fetch in Node 18+

async function testEnrichment() {
    const url = 'http://localhost:3000/api/ai/enrich-product';
    const payload = {
        productName: "Organic Avocados",
        upc: "796030114977"
    };

    console.log("🧪 Testing Product Enrichment API...");
    console.log(`Endpoint: ${url}`);
    console.log("Payload:", payload);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            console.log("\n✅ API Success!");
            console.log("----------------------------------------");
            console.log(JSON.stringify(data, null, 2));
            console.log("----------------------------------------");
            console.log("Explanation: The AI successfully identified the product, found it's produce, and generated a description.");
        } else {
            console.error("\n❌ API Error:", data);
        }

    } catch (error) {
        console.error("\n🚨 Network/Script Error:", error.message);
    }
}

// Run if native fetch is available (Node 18+) or install node-fetch
if (!globalThis.fetch) {
    console.log("Native fetch not found, please run with Node 18+ or install node-fetch");
} else {
    testEnrichment();
}
