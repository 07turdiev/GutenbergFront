import React from 'react';
import useTranslation from 'next-translate/useTranslation';

const Index = ({children}) => {
    const { t } = useTranslation('common');
    
    // Maqolalar uchun SVG icon ko'rsatish
    const isBlogTitle = children === t('blogPostsTitle');
    
    return (
        <h2 className='font-bold text-base sm:text-xl lg:text-2xl mb-3 sm:mb-5 flex items-center gap-1 sm:gap-2 min-w-0'>
            <span className="truncate">{children}</span>
            {isBlogTitle && (
                <svg 
                    width="20" 
                    height="20" 
                    className="sm:w-[30px] sm:h-[30px] flex-shrink-0"
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg" 
                    color="#cd1b17"
                >
                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 2V8H20" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 13H8" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 17H8" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 9H9H8" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )}
        </h2>
    );
};

export default Index;