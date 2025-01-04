const {JSDOM}  = require('jsdom');


async function crawlPage(baseUrl, currentUrl, pages)
{
    console.log(`Crawling URL ${currentUrl}`);
    const baseUrlObj = new URL(baseUrl);
    const currentUrlObj = new URL(currentUrl);

    if (baseUrlObj.hostname !== currentUrlObj.hostname) 
    {
        return pages;
    }

    const normalizedCurrentUrl = normalizeUrl(currentUrl);
    

    if (pages[normalizedCurrentUrl] > 0) 
    {
        pages[normalizedCurrentUrl]++;
        return pages;
    }
    pages[normalizedCurrentUrl] = 1;
    
    try 
    {
        const response = await fetch(currentUrl); 
        // Valid page
        if (response.status > 399) 
        {
            console.log(`error in fetching url with status code: ${response.status }`)
            return pages;
        }

        // Verify if we are receiving valid HTML
        const contentType = response.headers.get("content-type");
        if (!contentType.includes("text/html")) 
        {
            console.log(`No HTML response, content type = ${contentType}`);    
        }
        const htmlBody = await response.text();


        const nextUrls = getUrlFromHtml(htmlBody, baseUrl);
        for(const nextUrl of nextUrls)
        {
            pages = await crawlPage(baseUrl, nextUrl, pages);      
        } 
    } 
    catch (error) 
    {
        console.log(`error in fetching url: ${error.message}`)
    }

    return pages;
}



/**
 * This function retrieves all links (both relative and absolute) from an HTML
 * @param {*} htmlBody - HTML 
 * @param {*} baseUrl - Base URL 
 * @returns array of URLs in the HTML
 */
function getUrlFromHtml(htmlBody, baseUrl)
{
    const urls = [];
    const dom = new JSDOM(htmlBody)
    const linkElements = dom.window.document.querySelectorAll('a'); // this will return all <a> elements
    for (const linkElement of linkElements)
    {
        // relative URL 
        if (linkElement.href.slice(0, 1) === '/') 
        {
            try 
            {
                const urlObj = new URL(`${baseUrl}${linkElement.href}`);
                urls.push(urlObj.href);
            } 
            catch (error) 
            {
                console.log(`error with relative url: ${error.message}`)
            }
            
        }
        // absolute URL
        else
        {
            try 
            {
                const urlObj = new URL(linkElement.href);
                urls.push(linkElement.href);
            } 
            catch (error) 
            {
                console.log(`error with absolute url: ${error.message}`)
            }
            
        } 
        
    }
 
    return urls;  
}

/*
 * Normalize different URL strings that point to the same page
 */
function normalizeUrl(urlString)
{
    const urlObj = new URL(urlString);
    let hostPath = `${urlObj.hostname}${urlObj.pathname}`;
    
    if (hostPath.length > 0 && hostPath.slice(-1) === '/') 
    {
        hostPath = hostPath.slice(0,-1);
    }
    return hostPath;
}

// this will make available the functions to another files that want to use it
module.exports = 
{
    normalizeUrl,
    getUrlFromHtml,
    crawlPage
} 