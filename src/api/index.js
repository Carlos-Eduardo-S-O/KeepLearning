import SyncStorage from "sync-storage"

const FEEDS_URL = "http://172.29.1.1:5000/"
const WEBSITES_URL = "http://172.29.1.5:5000/"
const FILE_URL = "http://172.29.1.6/"
const DETAILS_URL = "http://172.29.1.2:5000/"
const COMMENTS_URL = "http://172.29.1.4:5000/"

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

export const getFeedForDetails = async (feedId) => {  
    return accessURL(DETAILS_URL + "feedDetails/" + feedId)
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

// This part of the code I haven't tested, so I don't know this is right.
export const getComments = async (feedId, page) => {
    return accessURL(COMMENTS_URL + "comments/" + feedId + "/" + page)
}

export const addComment = async (courseId, comment) => {
    let promise = null
    
    const user = SyncStorage.get("user")

    if (user) {
        promise = accessURL(COMMENTS_URL + "add/" + courseId + "/" + user.name + "/" + user.account + "/" + comment)
    }

    return promise
}

export const deleteComment = async (commentId) => {
    return accessURL(COMMENTS_URL + "delete/" + commentId)
}
// 3:21:00