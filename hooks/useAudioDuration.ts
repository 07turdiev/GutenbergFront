import { useState, useEffect } from 'react';
import { getAudioDurationCached, formatDuration } from '../utils/audioUtils';

/**
 * Custom hook for loading and formatting audio duration
 * @param audioUrl - The URL of the audio file
 * @param format - The format for duration display ('mm:ss', 'hh:mm:ss', 'mm')
 * @returns Object with duration, loading state, and error state
 */
export const useAudioDuration = (audioUrl: string | null, format: 'mm:ss' | 'hh:mm:ss' | 'mm' = 'mm:ss') => {
    const [duration, setDuration] = useState<string>('00:00');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!audioUrl) {
            setDuration(format === 'mm' ? '0' : '00:00');
            return;
        }

        const loadDuration = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                const durationSeconds = await getAudioDurationCached(audioUrl);
                setDuration(formatDuration(durationSeconds, format));
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to load duration';
                setError(errorMessage);
                console.error('Failed to load audio duration:', err);
                setDuration(format === 'mm' ? '0' : '00:00');
            } finally {
                setIsLoading(false);
            }
        };

        loadDuration();
    }, [audioUrl, format]);

    return { duration, isLoading, error };
};

/**
 * Hook specifically for novels with multiple possible audio sources
 * @param novel - The novel object
 * @param format - The format for duration display
 * @returns Object with duration, loading state, and error state
 */
export const useNovelAudioDuration = (novel: any, format: 'mm:ss' | 'hh:mm:ss' | 'mm' = 'mm:ss') => {
    const audioUrl = getNovelAudioUrl(novel);
    return useAudioDuration(audioUrl, format);
};

/**
 * Helper function to extract audio URL from novel object
 * @param novel - The novel object
 * @returns The audio URL or null if not available
 */
const getNovelAudioUrl = (novel: any): string | null => {
    if (!novel) return null;
    
    // Check for audio_list (preferred)
    if (novel.audio_list && novel.audio_list.length > 0 && novel.audio_list[0].file) {
        return novel.audio_list[0].file;
    }
    
    // Check for direct audio file (new API structure)
    if (novel.audio?.url) {
        return novel.audio.url.startsWith('http') 
            ? novel.audio.url 
            : `http://localhost:1337${novel.audio.url}`;
    }
    
    return null;
}; 