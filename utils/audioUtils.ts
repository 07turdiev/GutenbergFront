/**
 * Extracts audio duration from an audio file URL
 * @param audioUrl - The URL of the audio file
 * @returns Promise<number> - Duration in seconds
 */
export const getAudioDuration = (audioUrl: string): Promise<number> => {
    return new Promise((resolve, reject) => {
        const audio = new Audio();
        audio.preload = 'metadata'; // Only load metadata, not the full file
        
        audio.onloadedmetadata = () => {
            const duration = audio.duration;
            // Clean up the audio element
            audio.src = '';
            audio.load();
            resolve(duration);
        };
        
        audio.onerror = (error) => {
            reject(new Error(`Failed to load audio metadata: ${error}`));
        };
        

        
        // Set a timeout to avoid hanging requests
        const timeout = setTimeout(() => {
            audio.src = '';
            audio.load();
            reject(new Error('Audio metadata loading timed out'));
        }, 10000); // 10 second timeout
        
        audio.onloadedmetadata = () => {
            clearTimeout(timeout);
            const duration = audio.duration;
            // Clean up the audio element
            audio.src = '';
            audio.load();
            resolve(duration);
        };
        
        try {
            audio.src = audioUrl;
        } catch (error) {
            clearTimeout(timeout);
            reject(new Error(`Invalid audio URL: ${error}`));
        }
    });
};

/**
 * Extracts audio duration with caching to avoid repeated requests
 * @param audioUrl - The URL of the audio file
 * @returns Promise<number> - Duration in seconds
 */
const durationCache = new Map<string, number>();

export const getAudioDurationCached = async (audioUrl: string): Promise<number> => {
    if (durationCache.has(audioUrl)) {
        return durationCache.get(audioUrl)!;
    }
    
    try {
        const duration = await getAudioDuration(audioUrl);
        durationCache.set(audioUrl, duration);
        return duration;
    } catch (error) {
        throw error;
    }
};

/**
 * Formats duration in seconds to human readable format
 * @param seconds - Duration in seconds
 * @param format - Format string ('mm:ss', 'hh:mm:ss', 'mm')
 * @returns Formatted duration string
 */
export const formatDuration = (seconds: number, format: 'mm:ss' | 'hh:mm:ss' | 'mm' = 'mm:ss'): string => {
    if (!seconds || isNaN(seconds) || seconds < 0) {
        return format === 'mm' ? '0' : '00:00';
    }
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    switch (format) {
        case 'mm':
            return Math.ceil(seconds / 60).toString();
        case 'hh:mm:ss':
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        case 'mm:ss':
        default:
            return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
};

/**
 * Clears the duration cache
 */
export const clearDurationCache = (): void => {
    durationCache.clear();
}; 