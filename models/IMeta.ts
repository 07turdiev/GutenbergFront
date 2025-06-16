export interface IMeta {
    links: {
        next: null | string;
        previous: null | string;
    },
    count: number;
    page_size: number;
    num_pages: number;
    current_page: number;
    countItemsOnPage: number;
}