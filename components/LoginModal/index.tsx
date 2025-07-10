import React, { useState } from 'react';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import useTranslation from 'next-translate/useTranslation';
import classNames from 'classnames';
import { useAppSelector } from '../../hooks/reducer';
import { selectAuth } from '../../store/selectors/auth';
import { loginUser } from '../../store/actions/auth';
import ThemeButton from '../Ui/ThemeButton';
import { useRouter } from 'next/router';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister?: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToRegister }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation('common');
  const { t: tFields } = useTranslation('fields');
  const { loading, error } = useAppSelector(selectAuth);
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object().shape({
    username: Yup.string().required(tFields('requiredField')),
    password: Yup.string().required(tFields('requiredField')).min(6, tFields('passwordMinLength')),
  });

  const handleSubmit = async (values: { username: string; password: string }) => {
    try {
      await dispatch(loginUser(values));
      onClose();
      // Optionally redirect after successful login
      // router.push('/profile');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto max-h-[90vh] overflow-y-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Modal Content */}
          <div className="p-4 sm:p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t('toLogin')}
              </h2>
              <p className="text-gray-600 text-sm">
                {t('loginSubtitle')}
              </p>
            </div>

            <Formik
              initialValues={{
                username: '',
                password: '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ handleSubmit, handleChange, values, errors, touched }) => (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Username Field */}
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                      {tFields('login')}
                    </label>
                    <Field
                      name="username"
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          placeholder={tFields('login')}
                          className={classNames(
                            'w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
                            {
                              'border-red-400': errors.username && touched.username,
                              'border-gray-300': !(errors.username && touched.username),
                            }
                          )}
                        />
                      )}
                    />
                    {errors.username && touched.username && (
                      <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('userPassword')}
                    </label>
                    <div className="relative">
                      <Field
                        name="password"
                        render={({ field }) => (
                          <input
                            {...field}
                            type={showPassword ? 'text' : 'password'}
                            placeholder={t('userPassword')}
                            className={classNames(
                              'w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-10',
                              {
                                'border-red-400': errors.password && touched.password,
                                'border-gray-300': !(errors.password && touched.password),
                              }
                            )}
                          />
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.632 13.124M13.121 14.122l3.246 3.246M13.121 14.122L14.122 13.12" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.password && touched.password && (
                      <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                    )}
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <ThemeButton
                    type="submit"
                    block
                    size="xl"
                    loading={loading}
                    disabled={loading}
                    className="mt-6"
                  >
                    {t('toLogin')}
                  </ThemeButton>

                  {/* Forgot Password */}
                  <div className="text-center">
                    <button
                      type="button"
                      className="text-primary hover:text-accent text-sm transition-colors"
                    >
                      {t('loginToReset')}
                    </button>
                  </div>

                  {/* Switch to Registration */}
                  {onSwitchToRegister && (
                    <div className="text-center pt-4 border-t border-gray-200">
                      <p className="text-gray-600 text-sm">
                        {t('loginToReg')}{' '}
                        <button
                          type="button"
                          onClick={onSwitchToRegister}
                          className="text-primary hover:text-accent font-medium transition-colors"
                        >
                          {t('toReg')}
                        </button>
                      </p>
                    </div>
                  )}
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal; 