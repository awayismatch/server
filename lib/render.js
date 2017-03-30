var views = require('co-views');

var render = views('views', {
    map: { html: 'ejs' },
    default:'ejs'
});
module.exports = render