import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../hooks/reducer';
import { selectAuth } from '../../store/selectors/auth';
import { checkCurrentUser } from '../../store/actions/auth';
import { wrapper } from '../../store/store';
import MainLayout from '../../layouts/MainLayout';
import ProfilePage from '../../components/Screens/ProfilePage';
import SpinnerDots from '../../components/Ui/SpinnerDots';

const Profile: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentUser, isLogin, loading } = useAppSelector(selectAuth);

  useEffect(() => {
    if (isLogin === false) {
      router.push('/');
    }
  }, [isLogin, router]);

  if (loading || isLogin === null) {
    return (
      <MainLayout>
        <div className="container mx-auto px-3 py-20">
          <div className="flex justify-center items-center min-h-96">
            <SpinnerDots />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!isLogin || !currentUser) {
    return null; // Will redirect via useEffect
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-3 py-10">
        <ProfilePage />
      </div>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    try {
      // Check if user is authenticated on server side
      await store.dispatch(checkCurrentUser({ ctx }));
    } catch (error) {
      // If not authenticated, redirect to home
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    return {
      props: {},
    };
  }
);

export default Profile; 