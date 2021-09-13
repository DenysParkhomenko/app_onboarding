'use strict';

var server = require('server');

server.post('Subscribe', server.middleware.https, function(req, res, next) {
    var notifymeFrom = server.forms.getForm('notifyme');

    if (!notifymeFrom.valid) {
        res.json({
            'result': 'ERROR'
        });
        next();

        return;
    }

    var CustomObjectMgr = require('dw/object/CustomObjectMgr');
    var Transaction = require('dw/system/Transaction');

    var email = notifymeFrom.email.value;
    var name = notifymeFrom.name.value;
    var product = notifymeFrom.product.value;

    var customer = JSON.stringify({name: name, email: email});
    var newCustomers = [customer];
    var customObject = CustomObjectMgr.getCustomObject('testNotifyMe', product);

    Transaction.wrap(function() {
        if (empty(customObject)) {
            customObject = CustomObjectMgr.createCustomObject('testNotifyMe', product);
            customObject.custom.customers = newCustomers;
        } else {
            var customers = customObject.custom.customers;
            var currentCustomer = null;

            for (var i = 0, length = customers.length; i < length; i++) {
                currentCustomer = customers[i];

                if (currentCustomer !== customer) {
                    newCustomers.push(currentCustomer);
                }
            }

            customObject.custom.customers = newCustomers;
        }
    });

    res.json({
        'email': email,
        'result': 'OK'
    });
    next();
});

module.exports = server.exports();
