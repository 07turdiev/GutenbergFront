import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { useAppSelector } from '../../hooks/reducer';
import { selectAuth } from '../../store/selectors/auth';
import { checkCurrentUser, logoutUser } from '../../store/actions/auth';
import LoginModal from '../LoginModal';
import ThemeButton from '../Ui/ThemeButton';

const AuthButtons: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation('common');
  const { currentUser, isLogin, loading } = useAppSelector(selectAuth);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    if (isLogin === null) {
      dispatch(checkCurrentUser({}));
    }
  }, [dispatch, isLogin]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    setShowProfileMenu(false);
    router.push('/');
  };

  const handleProfileClick = () => {
    setShowProfileMenu(false);
    router.push('/profile');
  };

  if (loading && isLogin === null) {
    return (
      <div className="flex items-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isLogin && currentUser) {
    return (
      <div className="relative">
        {/* User Profile Button */}
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
        >
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            {currentUser.img ? (
              <img
                src={currentUser.img}
                alt={currentUser.first_name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <span className="text-white text-sm font-medium">
                {currentUser.first_name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            )}
          </div>
          <span className="hidden md:block text-sm font-medium text-gray-700">
            {currentUser.first_name || currentUser.username}
          </span>
          <svg 
            className={`w-4 h-4 text-gray-500 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Profile Dropdown Menu */}
        {showProfileMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
            <div className="py-1">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{currentUser.first_name || currentUser.username}</p>
                <p className="text-xs text-gray-500">{currentUser.email}</p>
              </div>
              
              <button
                onClick={handleProfileClick}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {t('profile')}
                </div>
              </button>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  router.push('/bookmarks');
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  {t('bookmarks')}
                </div>
              </button>

              <div className="border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    {t('logout')}
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Click outside to close menu */}
        {showProfileMenu && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowProfileMenu(false)}
          />
        )}
      </div>
    );
  }

  // Not logged in - show login button
  return (
    <>
      <ThemeButton
        onClick={() => setShowLoginModal(true)}
        size="sm"
        className="whitespace-nowrap"
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

export default AuthButtons; 