'use strict';

var server = require('server');
var productListHelper = require('*/cartridge/scripts/productList/productListHelpers');
server.extend(module.superModule);

server.append('RemoveProduct', function (req, res, next) {
    var viewData = res.getViewData();
    var list = productListHelper.getList(req.currentCustomer.raw, { type: 10 });

    viewData.count = list && list.items && list.items.length || 0;

    res.setViewData(viewData);
    next();
});

module.exports = server.exports();
