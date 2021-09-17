'use strict';

var server = require('server');

server.get('Show', function (req, res, next) {
    res.render('custom');
    next();
});

module.exports = server.exports();


function getCategoryURL(category_id) {
    const catalogId = 'storefront-catalog-m-en';

    return getBaseURL() + '/catalogs/' + catalogId + '/categories/' + category_id;
}

function getBaseURL() {
    const site = 'Sites-RefArch-Site';
    const version = '20_4';

    return 'https://aaga-010.sandbox.us01.dx.commercecloud.salesforce.com/on/demandware.store/' + site + '/dw/Shop/v' + version;
}

function getDefaultHeaders() {
    const clientId = '66ebdc9a-475b-49be-beea-cbc446a202bb';

    return {
        'x-dw-client-id': clientId
    };
}