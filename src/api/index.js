const FEEDS_URL = "http://172.29.1.1:5000/"
const WEBSITES_URL = "http://172.29.1.5:5000/"
const FILE_URL = "http://172.29.1.6/"

export const accessURL = async (url) => {
    let promise = null;

    try{
        response = await fetch(url, { method: "GET" })
        if (response.ok){
            promise = Promise.resolve(response.json())
        } else {
            promise = Promise.reject(response)
        }
    } catch (error) {
        promise = Promise.reject(error)
    }

    return promise
}

export const getFeeds = async (page) => {  
    return accessURL(FEEDS_URL + "feeds/" + page)
}

export const getFeedsPerName = async (course_name, page) => {
    return accessURL(FEEDS_URL + "feeds_per_course/" + course_name + "/" + page)
}

export const getFeedsPerWebsite = async (websiteId, page) => {
    return accessURL(FEEDS_URL + "feeds_per_website/" + websiteId + "/" + page)
}

export const getWebsites = async () => {
    return accessURL(WEBSITES_URL + "websites/")
}

export const getImage = (imageName) => {
    return { uri: FILE_URL + "/" + imageName }
}
// 1:57:00