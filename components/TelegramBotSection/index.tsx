import React from 'react';
import useTranslation from 'next-translate/useTranslation';

const TelegramBotSection = () => {
  const { t } = useTranslation('common');
  
  return (
    <div className="container mx-auto px-3 md:mb-12 mb-7">
      <div className="bg-[#f3f4f6] rounded-lg py-12 lg:py-16 px-6 lg:px-12">
        <div className="flex justify-between items-center flex-col lg:flex-row gap-8 lg:gap-0">
          <div className="text-center lg:text-left">
            <h2 
              className="text-2xl lg:text-4xl font-bold text-black leading-tight"
              dangerouslySetInnerHTML={{ __html: t('telegramBotTitle') }}
            />
          </div>
          
          <a href="https://t.me/gutenbergnu_bot" target="_blank" rel="noopener noreferrer"
            className="group flex items-center border-3 border-[#a62929] rounded-[60px] py-5 px-8 lg:py-6 lg:px-10 text-black text-xl lg:text-2xl font-medium no-underline hover:bg-[#a62929] hover:text-white transition-colors duration-200"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" width="16" height="16"
              viewBox="0 0 35 35" 
              className="w-12 h-12 lg:w-14 lg:h-14 mr-4 lg:mr-5 fill-[#a62929] group-hover:fill-white transition-colors duration-200"
            >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09"/>
            </svg>
            {t('telegramBotButton')}
          </a>
        </div>
      </div>
    </div>
  );
};

export default TelegramBotSection; 