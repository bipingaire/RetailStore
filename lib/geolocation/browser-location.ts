/**
 * Browser geolocation utilities
 * Wrapper around the Geolocation API with permission handling
 */

export interface GeolocationPosition {
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: number;
}

export interface GeolocationError {
    code: number;
    message: string;
}

/**
 * Request user's current location
 * @returns Promise resolving to coordinates or error
 */
export async function requestUserLocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
        if (!('geolocation' in navigator)) {
            reject({
                code: 0,
                message: 'Geolocation is not supported by this browser'
            });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: position.timestamp
                });
            },
            (error) => {
                reject({
                    code: error.code,
                    message: getErrorMessage(error.code)
                });
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
            }
        );
    });
}

/**
 * Check if geolocation permission is granted
 */
export async function checkLocationPermission(): Promise<PermissionState> {
    if (!('permissions' in navigator)) {
        return 'prompt';
    }

    try {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        return result.state;
    } catch {
        return 'prompt';
    }
}

/**
 * Get user-friendly error message
 */
function getErrorMessage(code: number): string {
    switch (code) {
        case 1:
            return 'Location access denied. Please enable location permissions.';
        case 2:
            return 'Unable to determine location. Please try again.';
        case 3:
            return 'Location request timed out. Please try again.';
        default:
            return 'An unknown error occurred while getting your location.';
    }
}

/**
 * Watch user's location for continuous updates
 */
export function watchUserLocation(
    onUpdate: (position: GeolocationPosition) => void,
    onError: (error: GeolocationError) => void
): () => void {
    if (!('geolocation' in navigator)) {
        onError({
            code: 0,
            message: 'Geolocation is not supported'
        });
        return () => { };
    }

    const watchId = navigator.geolocation.watchPosition(
        (position) => {
            onUpdate({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                timestamp: position.timestamp
            });
        },
        (error) => {
            onError({
                code: error.code,
                message: getErrorMessage(error.code)
            });
        },
        {
            enableHighAccuracy: true,
            maximumAge: 60000 // 1 minute
        }
    );

    // Return cleanup function
    return () => {
        navigator.geolocation.clearWatch(watchId);
    };
}
