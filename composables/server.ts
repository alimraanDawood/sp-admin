
export const useServerUrl = () => {
    const runtimeConfig = useRuntimeConfig();
    //const url = runtimeConfig.public.SERVER_URL;
    const url = "https://api.sportspalace.shop";
    console.log(url);
    return url;
}