'use strict';

var server = require('server');
var Transaction = require('dw/system/Transaction');
var CustomObjectMgr = require('dw/object/CustomObjectMgr');

server.post('Subscribe', server.middleware.https, function(req, res, next) {
    if (!validateForm(req.form)) {
        res.json({
            'result': 'ERROR'
        });
        next();
    }

    var email = req.form.dwfrm_notifyme_email;
    var name = req.form.dwfrm_notifyme_name;
    var product = req.form.dwfrm_notifyme_product;

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

function validateForm(form) {
    return validateEmail(form.dwfrm_notifyme_email) && form.dwfrm_notifyme_name && form.dwfrm_notifyme_product;
}

function validateEmail(email) {    
    var regex = /^[\w.%+-]+@[\w.-]+\.[\w]{2,6}$/;
    return regex.test(email);
}

module.exports = server.exports();
