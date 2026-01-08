/**
 * Format store hours for display
 */

export interface DailyHours {
    open: string;
    close: string;
    closed?: boolean;
}

export interface StoreHours {
    [key: string]: DailyHours;
}

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export function getCurrentStatus(hours: StoreHours): { isOpen: boolean; nextStatus: string } {
    if (!hours) return { isOpen: false, nextStatus: 'Hours not available' };

    const now = new Date();
    const dayName = DAYS[now.getDay()];
    const todayHours = hours[dayName];

    if (!todayHours || todayHours.closed) {
        return { isOpen: false, nextStatus: 'Closed today' };
    }

    const currentTime = now.getHours() * 100 + now.getMinutes();
    const openTime = parseInt(todayHours.open.replace(':', ''));
    const closeTime = parseInt(todayHours.close.replace(':', ''));

    if (currentTime >= openTime && currentTime < closeTime) {
        return {
            isOpen: true,
            nextStatus: `Closes at ${formatTime(todayHours.close)}`
        };
    }

    if (currentTime < openTime) {
        return {
            isOpen: false,
            nextStatus: `Opens at ${formatTime(todayHours.open)}`
        };
    }

    return { isOpen: false, nextStatus: 'Closed now' };
}

function formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
}
