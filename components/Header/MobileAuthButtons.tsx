import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { useAppSelector } from '../../hooks/reducer';
import { selectAuth } from '../../store/selectors/auth';
import { checkCurrentUser, logoutUser } from '../../store/actions/auth';
import LoginModal from '../LoginModal';
import ThemeButton from '../Ui/ThemeButton';

interface MobileAuthButtonsProps {
  onClose?: () => void;
}

const MobileAuthButtons: React.FC<MobileAuthButtonsProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation('common');
  const { currentUser, isLogin, loading } = useAppSelector(selectAuth);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    if (isLogin === null) {
      dispatch(checkCurrentUser({}));
    }
  }, [dispatch, isLogin]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    if (onClose) onClose();
    router.push('/');
  };

  const handleProfileClick = () => {
    if (onClose) onClose();
    router.push('/profile');
  };

  const handleBookmarksClick = () => {
    if (onClose) onClose();
    router.push('/bookmarks');
  };

  if (loading && isLogin === null) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isLogin && currentUser) {
    return (
      <div className="w-full">
        {/* User Info Section */}
        <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-100">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            {currentUser.img ? (
              <img
                src={currentUser.img}
                alt={currentUser.first_name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <span className="text-white text-lg font-medium">
                {currentUser.first_name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">{currentUser.first_name || currentUser.username}</p>
            <p className="text-sm text-gray-500">{currentUser.email}</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          <button
            onClick={handleProfileClick}
            className="w-full text-left px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-md transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {t('profile')}
          </button>

          <button
            onClick={handleBookmarksClick}
            className="w-full text-left px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-md transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            {t('bookmarks')}
          </button>

          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-3 text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {t('logout')}
          </button>
        </div>
      </div>
    );
  }

  // Not logged in - show login button
  return (
    <>
      <ThemeButton
        onClick={() => setShowLoginModal(true)}
        block
        size="xl"
      >
        {t('toLogin')}
      </ThemeButton>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          // Handle registration modal here later
          console.log(t('switchToRegistration'));
        }}
      />
    </>
  );
};

export default MobileAuthButtons; 