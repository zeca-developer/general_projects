const {normalizeUrl, getUrlFromHtml} = require("./crawl.js");  // import function
const {test, expect} = require("@jest/globals"); 

test("normalizeUrl strip protocol", () => 
{
    const input = "https://blog.boot.dev/path";
    const actual_output = normalizeUrl(input);
    const expected = "blog.boot.dev/path";

    expect(actual_output).toEqual(expected)
})

test("normalizeUrl trim trailing slashes", () => 
{
    const input = "https://blog.boot.dev/path/";
    const actual_output = normalizeUrl(input);
    const expected = "blog.boot.dev/path";

    expect(actual_output).toEqual(expected)
})

//URL object constructor already deals with this
test("normalizeUrl capitals", () => 
{
    const input = "https://BLOG.boot.dev/path/";
    const actual_output = normalizeUrl(input);
    const expected = "blog.boot.dev/path";

    expect(actual_output).toEqual(expected)
})

test("normalizeUrl strip http", () => 
{
    const input = "http://BLOG.boot.dev/path/";
    const actual_output = normalizeUrl(input);
    const expected = "blog.boot.dev/path";

    expect(actual_output).toEqual(expected)
})
    
    
test("getUrlFromHtml, absolute URL", () => 
{
    const inputHtmlBody = `
    <html>
        <body>
            <a href="https://blog.boot.dev">
                Boot.dev Blog
            </a>
        </body>
    </html>
    `;
    const inputBaseUrl = "https://blog.boot.dev"
    const actual_output = getUrlFromHtml(inputHtmlBody, inputBaseUrl);
    const expected = ["https://blog.boot.dev/"];

    expect(actual_output).toEqual(expected)
})
        
    
test("getUrlFromHtml, relative URL", () => 
{
    const inputHtmlBody = `
    <html>
        <body>
            <a href="/relativepath/">
                Boot.dev Blog
            </a>
        </body>
    </html>
    `;
    const inputBaseUrl = "https://blog.boot.dev"
    const actual_output = getUrlFromHtml(inputHtmlBody, inputBaseUrl);
    const expected = ["https://blog.boot.dev/relativepath/"];

    expect(actual_output).toEqual(expected)
})
    
test("getUrlFromHtml, both relative and absolute URL", () => 
{
    const inputHtmlBody = `
    <html>
        <body>
             <a href="https://blog.boot.dev">
                Boot.dev Blog 1
            </a>
            <a href="/relativepath/">
                Boot.dev Blog 2
            </a>
        </body>
    </html>
    `;
    const inputBaseUrl = "https://blog.boot.dev"
    const actual_output = getUrlFromHtml(inputHtmlBody, inputBaseUrl);
    const expected = ["https://blog.boot.dev/", "https://blog.boot.dev/relativepath/"];

    expect(actual_output).toEqual(expected)
})

test("getUrlFromHtml, invalid URL", () => 
    {
        const inputHtmlBody = `
        <html>
            <body>
                 <a href="invalid>
                    Boot.dev Blog invalid
                </a>
            </body>
        </html>
        `;
        const inputBaseUrl = "https://blog.boot.dev"
        const actual_output = getUrlFromHtml(inputHtmlBody, inputBaseUrl);
        const expected = [];
    
        expect(actual_output).toEqual(expected)
    })