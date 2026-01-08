/**
 * Google Maps Loader
 * Dynamically loads the Google Maps JavaScript API
 */

let googleMapsScriptLoaded = false;

export function loadGoogleMapsScript(): Promise<void> {
    return new Promise((resolve, reject) => {
        if (googleMapsScriptLoaded) {
            resolve();
            return;
        }

        if (window.google?.maps) {
            googleMapsScriptLoaded = true;
            resolve();
            return;
        }

        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
            reject(new Error('Google Maps API key not found in environment variables'));
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
            googleMapsScriptLoaded = true;
            resolve();
        };

        script.onerror = () => {
            reject(new Error('Failed to load Google Maps script'));
        };

        document.head.appendChild(script);
    });
}

/**
 * Generate a Google Maps directions URL
 */
export function createDirectionsUrl(
    destinationLat: number,
    destinationLng: number,
    originLat?: number,
    originLng?: number
): string {
    const destination = `${destinationLat},${destinationLng}`;
    let url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;

    if (originLat && originLng) {
        url += `&origin=${originLat},${originLng}`;
    }

    return url;
}
