const {sortPages} = require("./report.js"); 
const {test, expect} = require("@jest/globals"); 

test("normalizeUrl strip protocol", () => 
{
    const input = 
    {
        "https://blog.boot.dev/path" : 3,
        "https://blog.boot.dev" : 4

    };
    const actual_output = sortPages(input);
    const expected = 
    [ 
        ["https://blog.boot.dev", 4],
        ["https://blog.boot.dev/path", 3]
    ];
    expect(actual_output).toEqual(expected)
})
