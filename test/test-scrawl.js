var fs = require('fs'),
    scrawl = require('../lib/scrawl');


var fix_dir = __dirname + '/fixtures';


function test_basic_js(result, test) {
    test.equal(result.length, 6);
    test.same(result[0], {
            description: 'Single line comment with no tags',
            description_html: '<p>Single line comment with no tags</p>'
    });
    test.same(result[1], {
        description: 'Multi-line comment\nalso with no tags',
        description_html: '<p>Multi-line comment<br />also with no tags</p>'
    });
    test.same(result[2], {
        description: 'Multi-line\nwith some single-line tags',
        description_html: '<p>Multi-line<br />with some single-line ' +
                          'tags</p>',
        'tag_1': 'some value',
        'tag2': 'test',
        'tag-3': true
    });
    test.same(result[3], {
        description: '*Markdown* inside description tags ' +
                     '<div>test</div>\nanother paragraph',
        description_html: '<p><em>Markdown</em> inside description '+
                          'tags <div>test</div><br />another ' +
                          'paragraph</p>',
        'tag_1': 'some value',
        'tag2': 'test',
        'tag-3': true
    });
    test.same(result[4], {
        description: 'Duplicate tags test',
        description_html: '<p>Duplicate tags test</p>',
        tag: ['one', 'two']
    });
    test.same(result[5], {
        description: 'Parameters and return test',
        description_html: '<p>Parameters and return test</p>',
        param: ['{String} one', '{Boolean} two (optional)'],
        params: {
            one: {type: 'String', description: undefined},
            two: {type: 'Boolean', description: '(optional)'}
        },
        returns: 'Array'
    });
};


exports['parse basic.js'] = function (test) {
    fs.readFile(fix_dir + '/basic.js', function (err, content) {
        if (err) {
            return test.done(err);
        }
        var result = scrawl.parse(content.toString());
        test_basic_js(result, test);
        test.done();
    });
};

exports['parse_modules basic.js, basic2.js'] = function (test) {
    var modules = [fix_dir + '/basic.js', fix_dir + '/basic2.js'];
    scrawl.parseModules(fix_dir, function (err, results) {
        if (err) {
            return test.done(err);
        }
        test_basic_js(results[modules[0]], test);
        test_basic_js(results[modules[1]], test);
        test.done();
    });
};