const FEEDS_URL = "http://172.29.1.1:5000/"

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
// 1:33:00