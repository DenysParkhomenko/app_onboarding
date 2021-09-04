'use strict';

var server = require('server');
var Resource = require('dw/web/Resource');

server.extend(module.superModule);

server.append('Show', function (req, res, next) {
    var viewData = res.getViewData();

    addNotifyMeData(viewData);
    res.setViewData(viewData);
    next();
});

server.append('Variation', function (req, res, next) {
    var viewData = res.getViewData();

    addNotifyMeData(viewData);
    res.setViewData(viewData);
    next();
});

function addNotifyMeData(viewData) {
    viewData.isRenderNotifyMe = dw.system.Site.current.getCustomPreferenceValue('test_isRenderNotifyMe');

    if (viewData.isRenderNotifyMe) {
        viewData.notifyMeForm = server.forms.getForm('notifyme');
    }
}

module.exports = server.exports();
