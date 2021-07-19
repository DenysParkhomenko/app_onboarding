'use strict';

var base = module.superModule;

function productListItem(productListItemObject) {
	base.call(this, productListItemObject);

	if (productListItemObject) {
		var dayInMs = 86400000;
		var msLasts = Date.now() - productListItemObject.lastModified.getTime();
		var wishlistExpiryMs = dw.system.Site.current.getCustomPreferenceValue('wishlistExpiryDays') * dayInMs;
		var expirationDays = (wishlistExpiryMs - msLasts) / dayInMs;

		if (expirationDays > 0) {
			this.productListItem.expirationDays = expirationDays;
		} else {
			this.productListItem = null;

			dw.system.Transaction.wrap(function() {
				productListItemObject.list.removeItem(productListItemObject);
			});
		}
	}
}

module.exports = productListItem;