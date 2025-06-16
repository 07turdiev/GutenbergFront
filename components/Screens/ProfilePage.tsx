import React, {useEffect, useRef, useState} from 'react';
import Image from "next/image";
import ImageUploading from "react-images-uploading";
import ThemeButton from "../Ui/ThemeButton";
import {Field, Formik} from "formik";
import SectionTitle from "../SectionTitle";
import classNames from "classnames";
import {useAppSelector} from "../../hooks/reducer";
import {selectAuth} from "../../store/selectors/auth";
import useTranslation from "next-translate/useTranslation";
import {useDispatch} from "react-redux";
import {changeProfile, changeProfilePassword} from "../../store/actions/auth";
import * as Yup from "yup";

const ProfilePage = () => {

    const {currentUser, loading, loadingPhoto, error: userError} = useAppSelector(selectAuth)
    const [images, setImages] = useState([]);

    const [editName, setEditName] = useState(false)
    const [editLogin, setEditLogin] = useState(false)
    const inputName = useRef(null);
    const inputLogin = useRef(null);

    const {t} = useTranslation('fields');


    const dispatch = useDispatch();

    const onChange = (imageList, addUpdateIndex) => {
        const formDate = new FormData();
        formDate.append('img', imageList[0].file)
        dispatch(changeProfile(formDate))
    };

    const onSubmit = (values) => {
        const {username, first_name} = values

        if(username === currentUser.username && first_name === currentUser.first_name ){
            return
        }

        if(values.username === currentUser.username){
            dispatch(changeProfile({first_name}));
        }else{
            dispatch(changeProfile(values));
        }

    }

    const formSchema = Yup.object().shape({
        username: Yup.string().required(t('requiredField')),
    });

    const changePassword = Yup.object().shape({
        old_password: Yup.string().required(t('requiredField')),
        new_password: Yup.string().required(t('requiredField')).min(6, 'минимум 6 симвволов'),
        confirm_password: Yup.string()
            .oneOf([Yup.ref('new_password'), null], 'Passwords must match')
    });

    useEffect(()=>{
        if(editName){
            inputName.current.focus();
        }
        if(editLogin){
            inputLogin.current.focus();
        }
    }, [editName, editLogin])


    const onSubmitPassword = async (values, {resetForm}) => {
        await dispatch(changeProfilePassword(values))
        resetForm();
    }

    useEffect(()=>{
        if(!userError){
            return
        }

    }, [userError])
    return (
        <>
            {
                !currentUser ?
                    'Loading'
                    :
                    <>
                        <div className="grid md:grid-cols-2 col-span-1 items-center gap-2 mb-10">
                            <div className="col-span-1">
                                <div className='flex items-center '>

                                    <div className='rounded-full w-16 h-16 bg-slate-200 flex items-center justify-center border border-gray-300 overflow-hidden'>
                                        {
                                            currentUser.img
                                                ?
                                                <Image src={`http://akback.technocorp.uz/${currentUser.img}`} width={90} height={90} objectFit='cover' objectPosition='top center'/>
                                                :
                                                <span className='text-2xl font-bold text-black uppercase'>{currentUser.username[0]}</span>
                                        }
                                    </div>

                                    <div className='pl-2'>
                                        <div className='font-bold text-xl'>{currentUser.first_name}</div>
                                        <div className='text-lg'>{currentUser.username}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-1 text-right">

                                <ImageUploading
                                    value={images}
                                    onChange={onChange}
                                    dataURLKey="data_url"
                                >
                                    {({
                                          onImageUpload,
                                          dragProps,
                                      }) => (
                                        <ThemeButton
                                            rounded
                                            size='sm'
                                            onClick={onImageUpload}
                                            loading={loadingPhoto}
                                            disabled={loadingPhoto}
                                            {...dragProps}
                                        >
                                            <div className='flex items-center'>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {t('uploadPhoto')}
                                            </div>
                                        </ThemeButton>
                                    )}
                                </ImageUploading>
                            </div>
                        </div>

                        <Formik
                            initialValues={{
                                first_name: currentUser.first_name,
                                username: currentUser.username,
                            }}
                            onSubmit={onSubmit}
                            validationSchema={formSchema}
                        >
                            {
                                ( {
                                      values,
                                      errors,
                                      touched,
                                      handleSubmit,
                                      handleChange,
                                      setFieldValue
                                  })=>(
                                    <form onSubmit={handleSubmit} className='grid grid-cols-12 lg:gap-6 gap-6 lg:mb-20 mb-10'>

                                        <div className="col-span-12 sm:col-span-6 ">
                                            <label htmlFor="first_name" className='font-medium mb-1'>{t('name')}</label>
                                            <div className='relative'>
                                                <Field
                                                    handleChange={handleChange}
                                                    name='first_name'
                                                    id='first_name'
                                                    render={({ field, form: { isSubmitting } }) => (
                                                        <input
                                                            {...field}
                                                            disabled={!editName}
                                                            type="text"
                                                            placeholder={t('name')}
                                                            className='border border-gray-200 px-3 py-2 rounded w-full focus:border-primary outline-none'
                                                            ref={inputName}
                                                            onBlur={()=>setEditName(false)}
                                                        />
                                                    )}
                                                />
                                                {
                                                    !editName &&
                                                    <span className='absolute right-2 top-2 text-gray-500 cursor-pointer transition hover:text-primary' onClick={()=>setEditName(true)}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                            </svg>
                                                        </span>
                                                }
                                            </div>
                                        </div>

                                        <div className=" col-span-12 sm:col-span-6">
                                            <label htmlFor="username" className='font-medium mb-1'>{t('login')}</label>
                                            <div className='relative'>
                                                <Field
                                                    handleChange={handleChange}
                                                    name='username'
                                                    id='username'
                                                    render={({ field, form: { isSubmitting } }) => (
                                                        <input
                                                            {...field}
                                                            disabled={!editLogin}
                                                            type="text"
                                                            placeholder={t('login')}
                                                            className='border border-gray-200 px-3 py-2 rounded w-full focus:border-primary outline-none'
                                                            ref={inputLogin}
                                                            onBlur={()=>setEditLogin(false)}
                                                        />
                                                    )}
                                                />
                                                {
                                                    errors.username && touched.username ?
                                                        <span className='text-red-500 text-xs'>
                                                            {errors.username}
                                                        </span>
                                                        : null
                                                }
                                                {
                                                    userError.username ?
                                                        <span className='text-red-500 text-xs'>
                                                                {userError.username}
                                                        </span>
                                                        : null
                                                }
                                                {
                                                    !editLogin &&
                                                    <span className='absolute right-2 top-2 text-gray-500 cursor-pointer transition hover:text-primary' onClick={()=>setEditLogin(true)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                        </svg>
                                                    </span>
                                                }
                                            </div>
                                        </div>
                                        <div className="md:col-span-4 col-span-12">
                                            <ThemeButton size='xl' color='white' disabled={loading} loading={loading}>
                                                {t('saveChanges')}
                                            </ThemeButton>
                                        </div>
                                    </form>
                                )
                            }
                        </Formik>


                        <SectionTitle>
                            {t('changePassword')}
                        </SectionTitle>

                        <Formik
                            initialValues={{
                                old_password: '',
                                new_password: '',
                                confirm_password: '',
                            }}
                            onSubmit={onSubmitPassword}
                            validationSchema={changePassword}
                        >
                            {
                                ( {
                                      values,
                                      errors,
                                      touched,
                                      handleSubmit,
                                      handleChange,
                                      setFieldValue,
                                      isSubmitting
                                  })=>(
                                    <form onSubmit={handleSubmit} className='grid grid-cols-12 lg:gap-6 gap-6 lg:mb-20 mb-10'>
                                        <div className="sm:col-span-6 md:col-span-4  col-span-12">
                                            <Field
                                                handleChange={handleChange}
                                                name='old_password'
                                                type='password'
                                                placeholder={t('currentPassword')}
                                                className={classNames('border border-gray-200 px-3 py-2 rounded w-full focus:border-primary outline-none', {
                                                    'border-red-300': errors.old_password && touched.old_password
                                                })}
                                            />
                                            {errors.old_password && touched.old_password ? (
                                                <div className='text-red-400 text-sm mt-1'>{errors.old_password}</div>
                                            ) : null}
                                        </div>
                                        <div className="sm:col-span-6 md:col-span-4  col-span-12">
                                            <Field
                                                handleChange={handleChange}
                                                name='new_password'
                                                type='password'
                                                placeholder={t('newPassword')}
                                                className={classNames('border border-gray-200 px-3 py-2 rounded w-full focus:border-primary outline-none', {
                                                    'border-red-300': errors.new_password && touched.new_password
                                                })}
                                            />
                                            {errors.new_password && touched.new_password ? (
                                                <div className='text-red-400 text-sm mt-1'>{errors.new_password}</div>
                                            ) : null}
                                        </div>
                                        <div className="sm:col-span-6 md:col-span-4  col-span-12">
                                            <Field
                                                handleChange={handleChange}
                                                name='confirm_password'
                                                type='password'
                                                placeholder={t('confirmPassword')}
                                                className={classNames('border border-gray-200 px-3 py-2 rounded w-full focus:border-primary outline-none', {
                                                    'border-red-300': errors.confirm_password && touched.confirm_password
                                                })}
                                            />
                                            {errors.confirm_password && touched.confirm_password ? (
                                                <div className='text-red-400 text-sm mt-1'>{errors.confirm_password}</div>
                                            ) : null}
                                        </div>
                                        <div className="md:col-span-4 col-span-12">
                                            <ThemeButton size='xl' color='white' loading={isSubmitting} disabled={isSubmitting}>
                                                {t('change')}
                                            </ThemeButton>
                                        </div>
                                    </form>
                                )
                            }
                        </Formik>

                    </>


            }
        </>
    );
};

export default ProfilePage;