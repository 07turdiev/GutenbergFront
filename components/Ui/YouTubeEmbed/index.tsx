import React from 'react';
import { extractYouTubeVideoId, isYouTubeIframe } from '../../../utils/strapiAdapter';

interface YouTubeEmbedProps {
    content: string;
    title?: string;
    className?: string;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ content, title = "YouTube video player", className = "" }) => {
    if (!content) return null;

    const videoId = extractYouTubeVideoId(content);

    // If we successfully extracted a video ID, render our controlled iframe
    if (videoId) {
        return (
            <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}`}
                title={title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className={className}
            />
        );
    }

    // If it's an iframe HTML string, render it with responsive dimensions
    if (isYouTubeIframe(content)) {
        // Replace width and height to make it responsive
        const responsiveIframe = content
            .replace(/width="\d+"/, 'width="100%"')
            .replace(/height="\d+"/, 'height="100%"')
            .replace(/style="[^"]*"/, '') // Remove any inline styles
            .replace(/<iframe/, `<iframe class="${className}"`);

        return (
            <div 
                dangerouslySetInnerHTML={{ __html: responsiveIframe }}
                style={{ width: '100%', height: '100%' }}
            />
        );
    }

    // Fallback for unrecognized formats
    return (
        <div className="flex items-center justify-center h-full bg-gray-100 rounded">
            <a 
                href={content} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-accent flex items-center"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
                YouTube'da ko'rish
            </a>
        </div>
    );
};

export default YouTubeEmbed; 