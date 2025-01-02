const {JSDOM}  = require('jsdom');
/**
 * 
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
    getUrlFromHtml
} 