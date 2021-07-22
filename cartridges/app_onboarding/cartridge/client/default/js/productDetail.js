'use strict';

var processInclude = require('base/util');

$(document).ready(function () {
    processInclude(require('base/product/detail'));
    processInclude(require('plugin_wishlists/product/wishlist'));
    processInclude(require('plugin_giftregistry/product/giftRegistry'));
});
