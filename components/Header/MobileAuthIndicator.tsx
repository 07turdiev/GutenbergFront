import React from 'react';
import { useAppSelector } from '../../hooks/reducer';
import { selectAuth } from '../../store/selectors/auth';

const MobileAuthIndicator: React.FC = () => {
  const { currentUser, isLogin } = useAppSelector(selectAuth);

  if (isLogin && currentUser) {
    return (
      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
        {currentUser.img ? (
          <img
            src={currentUser.img}
            alt={currentUser.first_name}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <span className="text-white text-xs font-medium">
            {currentUser.first_name?.charAt(0)?.toUpperCase() || 'U'}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center">
      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    </div>
  );
};

export default MobileAuthIndicator; 