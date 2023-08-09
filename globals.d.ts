declare module 'getFrameworkViews' {
    export function getFrameworkViews(): Promise<{
        name: string;
        path: string;
    }>
}

// declare process.env with the framework var
declare namespace NodeJS {
    interface ProcessEnv {
        FRAMEWORK: string;
    }
}