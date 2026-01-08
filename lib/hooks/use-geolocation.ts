import { useState, useEffect } from 'react';
import { requestUserLocation, checkLocationPermission, GeolocationPosition, GeolocationError } from '../geolocation/browser-location';

export function useGeolocation() {
    const [position, setPosition] = useState<GeolocationPosition | null>(null);
    const [error, setError] = useState<GeolocationError | null>(null);
    const [loading, setLoading] = useState(false);
    const [permission, setPermission] = useState<PermissionState>('prompt');

    useEffect(() => {
        checkLocationPermission().then(setPermission);
    }, []);

    const getLocation = async () => {
        setLoading(true);
        setError(null);
        try {
            const pos = await requestUserLocation();
            setPosition(pos);
            return pos;
        } catch (err: any) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { position, error, loading, permission, getLocation };
}
