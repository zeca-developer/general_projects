const {crawlPage} = require("./crawl.js");  // import function


async function main()
{
    if (process.argv.length < 3) 
    {
        console.log("no website provided");
        process.exit(1);
    }
    else if (process.argv.length > 3) 
    {
        console.log("too many command line inputs");
        process.exit(1);
    }
    const baseUrl = process.argv[2];

    console.log(`starting crawl ${baseUrl}`);
    
    const pages = await crawlPage(baseUrl, baseUrl, {});

    for(const page of Object.entries(pages))
        console.log(page)
}


main()