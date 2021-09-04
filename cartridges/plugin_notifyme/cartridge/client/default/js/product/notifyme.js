'use strict';

function initSizeSelect($selectSize, selectSizeClasses, isRenderNotifyMe, notifymeText) {
    $selectSize.select2({
        width: 'auto',
        selectionCssClass: selectSizeClasses,
        dropdownCssClass: `js-selectSizeDropdown ${isRenderNotifyMe ? 'b-ondisabled-notify-me' : ''}`,
        templateResult: (state) => {
            if (state.disabled && isRenderNotifyMe) {
                return $(`<div class="b-ondisabled-notify-me-option js-ondisabled-notify-me" data-id="${state.id}">
                                <span class="b-size crossed">${state.text}</span> <span>${notifymeText}</span>
                            </div>`);
            }

            return $(`<div><span="b-size">${state.text}</size></div>`);
        }
    });
    $selectSize.on('select2:open', () => {
        $('.js-selectSizeDropdown').parent().width($selectSize.next().width());
    });
}


function showModal(productURL) {
    $('#notifyMe-form').find('input[name="dwfrm_notifyme_product"]').val(productURL);
    $('#notifyMeModal').modal('show');

    $('.modal-backdrop.show').click(function() {
        $('#notifyMeModal').modal('hide');
    })
}

function showModalResult(email) {
    $('#notifyMeModalResult .modal-body span').html(email);
    $('#notifyMeModalResult').modal('show');
}

module.exports = {
    init: () => {
        const $selectSize = $('#maincontent select.select-size');
        const selectSizeClasses = $selectSize.attr('class');
        const isRenderNotifyMe = $selectSize.data('notifyme');
        const notifymeText = $selectSize.data('notifyme-text');

        initSizeSelect($selectSize, selectSizeClasses, isRenderNotifyMe, notifymeText);

        $('body').on('product:afterAttributeSelect', () => {
            initSizeSelect($selectSize, selectSizeClasses, isRenderNotifyMe, notifymeText);
        });

        if (isRenderNotifyMe) {
            $('body').on('click', '.js-ondisabled-notify-me', function() {
                const productURL = $(this).data('id');

                showModal(productURL);
                $selectSize.select2('close');
            });
            $('#notifyMe-form').on('submit', function() {
                const form = $(this);
                const data = form.serialize();
                const action = form.attr('action');

                $.ajax({
                    url: action,
                    type: 'post',
                    data: data,
                    success: function(data) {
                        $('#notifyMeModal').modal('hide');
                        showModalResult(data.email);
                    },
                    error: function(error) {
                        $('#notifyMeModal').modal('hide');
                        alert(JSON.stringify(error));
                    }
                });

                return false;
            });
        }
    }
}