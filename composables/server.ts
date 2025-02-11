
export const useServerUrl = () => {
    const runtimeConfig = useRuntimeConfig();
    const url = runtimeConfig.public.SERVER_URL;
    console.log(url);
    return url;
}