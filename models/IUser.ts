export interface IUser{
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    has_subscription: boolean;
    img: string;
}

export interface UserToken {
    access_token: string;
}
