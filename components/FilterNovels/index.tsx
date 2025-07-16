import React, {useEffect, useState} from 'react';
import Select from 'react-select';
import {useAppSelector} from "../../hooks/reducer";
import {useRouter} from "next/router";
import {selectAuthorsOptions} from "../../store/selectors/author";
import {selectCategoryOptions} from "../../store/selectors/category";
import ThemeButton from "../Ui/ThemeButton";
import {useDebounce} from "use-debounce";
import {useDispatch} from "react-redux";
import { selectGenreOptions } from "../../store/selectors/genre";
import useTranslation from "next-translate/useTranslation";



const customStyles = {
    control: (provided, state) => ({
        ...provided,
        borderColor: state.menuIsOpen ? '#cd1b17' : "rgb(209, 213, 219)",
        boxShadow: 'none',
        minHeight: `42px`,
        zIndex: 100,
        '&:hover': {
           // borderColor: '#E0E0E0',
           // boxShadow: 'none',
        },
        '&:focus': {
            borderColor: 'red',
        }

    }),
    indicatorSeparator:  (provided, state) => ({
        border: 'none'
    }),
    option:  (provided, {isSelected }) => ({
        ...provided,
        ':active': {
            ...provided,
            backgroundColor: isSelected ? '#ddd': 'white'
        },
    }),
    placeholder: (provided, state) => ({
        ...provided,
        color: '#9fa6b2'
    }),

}

interface Props {
    title: string;
}

interface IFilterFields {
    name?: string,
    author?: string,
    genre?: string,
    category?: string,
    lang?: string
}

const Index:React.FC<Props> = ({title}) => {
    const { t } = useTranslation('common');

    const languageOption = [{value: 'ru', label: t('langRu')}, {value: 'uz', label: t('langUz')}]


    const [showFilter, setShowFilter] = useState(false);
    const [queryName, setQueryName] = useState(null);
    const [valueName] = useDebounce(queryName, 500);

    const [filterQuery, setFilterQuery] = useState<IFilterFields>({});

    const {genresOption} = useAppSelector(selectGenreOptions);
    const {categoriesOption} = useAppSelector(selectCategoryOptions);
    const {authorsOption} = useAppSelector(selectAuthorsOptions);


    const router = useRouter();


    useEffect(()=>{

        // Only show filter if there are actual filter parameters
        if(Object.keys(router.query).length > 0 && (router.query.name || router.query.author || router.query.genre || router.query.category || router.query.lang)){
            setShowFilter(true)
        }

        if(router.query.name){
            setQueryName(router.query.name)
        }

    }, [])



    const onNameChange = (e) => {
        setQueryName(e.target.value);
    }

    useEffect(() => {
        if(queryName !== null){

            router.query.name = valueName;
            router.push(router)
        }
    }, [valueName])

    const onChange = (name, value) => {

       if(name === 'lang'){
           setFilterQuery((query)=>({
               ...query,
               [name]: value.value
           }))
           // @ts-ignore
           router.query = {
               ...router.query,
               [name]: value.value
           };
       }else{
           setFilterQuery((query)=>({
               ...query,
               [name]: value.label
           }))
           // @ts-ignore
           router.query = {
               ...router.query,
               [name]: value.label
           };
       }



        router.push(router)

    }

    const clearFilter = () => {
        router.query = {};
        router.push(router);
        setQueryName('')
        setFilterQuery({})
    }


    return (
        <div className='relative z-30'>

            <div className="grid grid-cols-12 mb-5 items-center mb-6">
                <div className="col-span-6">
                    <h2 className='font-bold text-xl '>
                        {title}
                    </h2>
                </div>
                <div className="col-span-6 text-right">
                    <div className="flex items-center justify-end">
                        {
                            showFilter ?
                                <ThemeButton  rounded onClick={clearFilter} outline className="mr-2">
                                    <span className='flex items-center'>
                                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        {t('resetFilter')}
                                    </span>
                                </ThemeButton>
                            : null
                        }


                        <ThemeButton  rounded onClick={()=>setShowFilter(!showFilter)}>
                            {t('filter')}
                        </ThemeButton>
                    </div>

                </div>
            </div>

            {
                showFilter ?
                    <div className='bg-gray-50 p-5 mb-10 rounded-md'>

                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4'>

                            <div className="col-span-1">
                                <input
                                    value={queryName ? queryName: ''}
                                    onChange={onNameChange}
                                    type="text"
                                    className='px-3 py-2 w-full border border-gray-300 rounded outline-none focus:border-primary'
                                    placeholder={t('bookTitle')}
                                />
                            </div>

                            <div className="col-span-1">
                                <Select
                                    value={authorsOption.filter(item=>item.label === router.query.author)}
                                    placeholder={t('author')}
                                    styles={customStyles}
                                    onChange={(value)=>onChange('author', value)}
                                    options={authorsOption}
                                />
                            </div>

                            <div className="col-span-1">
                                <Select
                                    value={genresOption.filter(item=>item.label === router.query.genre)}
                                    placeholder={t('genre')}
                                    styles={customStyles}
                                    onChange={(value)=>onChange('genre', value)}
                                    options={genresOption}
                                />
                            </div>

                            <div className="col-span-1">
                                <Select
                                    value={categoriesOption.filter(item=>item.label === router.query.category)}
                                    placeholder={t('category')}
                                    styles={customStyles}
                                   onChange={(value)=>onChange('category', value)}
                                    options={categoriesOption}
                                />
                            </div>

                            <div className="col-span-1">
                                <Select
                                    value={languageOption.filter(item=>item.value === router.query.lang)}
                                    placeholder={t('language')}
                                    styles={customStyles}
                                    onChange={(value)=>onChange('lang', value)}
                                    options={languageOption}
                                />
                            </div>
                        </div>
                    </div>
                : null
            }


        </div>
    );
};

export default Index;
