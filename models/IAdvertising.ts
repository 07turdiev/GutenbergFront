export interface IAdvertising{
    id: string;
    from_day: string;
    to_day: string;
    img: {
        src: string;
        width: number;
        height: number;
    };
    text: string;
    link: string;
    color: string;
    is_active: boolean;
}