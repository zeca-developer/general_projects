const {normalizeUrl} = require("./crawl.js");  // import function
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
    
    