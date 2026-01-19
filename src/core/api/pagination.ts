export type PageRequest = {
    page: number;
    size: number;
    q?: string;
};

export type Page<T> = {
     items: T[];
     total: number;
     page: number;
     size: number;
}