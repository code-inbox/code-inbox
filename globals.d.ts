// declare process.env with the framework var
declare namespace NodeJS {
    interface ProcessEnv {
        FRAMEWORK: "react" | "svelte";
    }
}