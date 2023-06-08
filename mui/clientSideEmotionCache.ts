import createCache from "@emotion/cache";

const clientSideEmotionCache = () => createCache({key:'css'})
export default clientSideEmotionCache