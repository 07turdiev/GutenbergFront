# Audio Duration Extraction System

This system allows you to extract audio duration directly from audio files instead of relying on API data.

## Files Created/Modified

### 1. `utils/audioUtils.ts` - Core Audio Utilities
Contains the main functions for extracting audio duration:

```typescript
import { getAudioDuration, getAudioDurationCached, formatDuration } from '../utils/audioUtils';

// Basic usage
const duration = await getAudioDuration('https://example.com/audio.mp3');
console.log(duration); // Duration in seconds

// With caching (recommended)
const duration = await getAudioDurationCached('https://example.com/audio.mp3');

// Format duration
const formatted = formatDuration(3665, 'hh:mm:ss'); // "01:01:05"
const formatted2 = formatDuration(125, 'mm:ss'); // "02:05"
const formatted3 = formatDuration(125, 'mm'); // "3" (minutes rounded up)
```

### 2. `hooks/useAudioDuration.ts` - React Hooks
Convenient React hooks for components:

```typescript
import { useAudioDuration, useNovelAudioDuration } from '../hooks/useAudioDuration';

// Basic hook
const { duration, isLoading, error } = useAudioDuration(audioUrl, 'mm:ss');

// Novel-specific hook (handles multiple audio sources)
const { duration, isLoading } = useNovelAudioDuration(novel, 'hh:mm:ss');
```

## How to Use

### In Novel Cards
```typescript
import { useNovelAudioDuration } from "../../hooks/useAudioDuration";

const NovelCard = ({ novel }) => {
    const { duration, isLoading } = useNovelAudioDuration(novel, 'mm');
    
    return (
        <div>
            <span>{isLoading ? '...' : `${duration} мин`}</span>
        </div>
    );
};
```

### In Audio Cards
```typescript
import { useAudioDuration } from "../../hooks/useAudioDuration";

const AudioCard = ({ audio }) => {
    const { duration } = useAudioDuration(audio.file, 'mm:ss');
    
    return (
        <div>
            <span>{duration}</span>
        </div>
    );
};
```

### In Novel Detail Pages
```typescript
import { useNovelAudioDuration } from '../../../hooks/useAudioDuration';

const NovelDetail = () => {
    const { duration: durationH, isLoading } = useNovelAudioDuration(novel, 'hh:mm:ss');
    
    return (
        <div>
            {isLoading ? '...' : durationH}
        </div>
    );
};
```

## Benefits

1. **No API Dependency**: Extracts duration directly from audio files
2. **Caching**: Avoids repeated requests for the same audio file
3. **Multiple Formats**: Support for mm:ss, hh:mm:ss, and mm formats
4. **Error Handling**: Graceful fallbacks when audio can't be loaded
5. **Performance**: Only loads metadata, not the full audio file
6. **React Integration**: Easy-to-use hooks for React components

## Migration from API-based Duration

### Before (API-based)
```typescript
// Duration came from API
const duration = novel.duration_uz || novel.duration_ru;
const formatted = moment.duration(duration, "second").format("mm:ss");
```

### After (Audio-based)
```typescript
// Duration extracted from actual audio file
const { duration } = useNovelAudioDuration(novel, 'mm:ss');
```

## Error Handling

The system includes comprehensive error handling:
- Network timeouts (10 second limit)
- Invalid audio files
- Missing audio URLs
- CORS issues

When errors occur, it falls back to default values:
- `'00:00'` for mm:ss and hh:mm:ss formats
- `'0'` for mm format

## Performance Considerations

1. **Metadata Only**: Uses `preload="metadata"` to avoid downloading full audio files
2. **Caching**: Results are cached to prevent repeated requests
3. **Lazy Loading**: Duration is only loaded when component mounts or audio URL changes
4. **Cleanup**: Audio elements are properly cleaned up to prevent memory leaks

## Removing API Duration Fields

After implementing this system, you can safely remove these fields from your API:
- `duration_uz`
- `duration_ru` 
- `audio_davomiyligi`
- Any other duration-related fields in the novel/audio models

The system will automatically extract duration from the actual audio files. 