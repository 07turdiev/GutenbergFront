export const Routes = {
    main: '/',
    about: '/about',
    genres: '/genres',
    authors: '/authors',
    team: '/team',
    blog: '/blog',
    stock: '/stock',
}

export const Menu = {
    ru: [
        {
            title: 'Книги',
            href: Routes.genres
        },
        {
            title: 'Авторы',
            href: Routes.authors
        },
        {
            title: 'Команда',
            href: Routes.team
        },
        {
            title: 'Блог',
            href: Routes.blog
        },
        {
            title: 'О нас',
            href: Routes.about
        }
    ],
    uz: [
        {
            title: 'Kitoblar',
            href: Routes.genres
        },
        {
            title: 'Mualliflar',
            href: Routes.authors
        },
        {
            title: 'Jamoa',
            href: Routes.team
        },
        {
            title: 'Blog',
            href: Routes.blog
        },
        {
            title: 'Biz haqimizda',
            href: Routes.about
        },
    ]
} 