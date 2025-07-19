export interface IAbout{
    description: string;
}

export interface ISocial{
    social: [string, string][];
}

export interface IContacts{
    address: string;
    email: string;
    phone: string;
    lng: string;
    ltd: string;
}

export interface IStatistics{
    authors: number;
    novels: number;
    users: number;
    readers: number;
}