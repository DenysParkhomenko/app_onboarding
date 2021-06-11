'use strict';

var base = module.superModule;

function ColorRefinementValueWrapper(productSearch, refinementDefinition, refinementValue) {
    base.call(this, productSearch, refinementDefinition, refinementValue);

    this.hitCount = refinementValue.hitCount;
}

module.exports = ColorRefinementValueWrapper;