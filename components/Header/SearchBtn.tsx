import React from 'react';
import SearchForm from '../SearchForm';
import useTranslation from 'next-translate/useTranslation';

interface SearchBtnProps {
    onClick?: () => void;
}

const SearchBtn: React.FC<SearchBtnProps> = ({ onClick }) => {
    const [showSearch, setShowSearch] = React.useState(false);
    const { t } = useTranslation('common');
    
    return (
        <>
            <div 
                className='shrink-0 text-gray-500 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition hover:bg-gray-100' 
                onClick={() => {
                    if (onClick) {
                        onClick();
                        return;
                    }
                    setShowSearch(true);
                }}
                title={t('searchTooltip')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <SearchForm open={showSearch} onClose={() => setShowSearch(false)} />
        </>
    );
};

export default SearchBtn;
