const { url } = require("inspector");


/* Normalize different URL strings that point to the same page
**/
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
    normalizeUrl
} 