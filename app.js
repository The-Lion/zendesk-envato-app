(function () {

  return {
    requests: {
      verify_purchase: function (purchase_code) {
        return {
          url: 'https://api.envato.com/v3/market/author/sale?code=' + purchase_code,
          //url: 'https://api.envato.com/v1/market/private/user/verify-purchase:' + purchase_code + '.json',
          dataType: 'json',
          headers: {
            'Authorization': 'Bearer ' + this.setting('token')
          },
          cors: true
        };
      }
    },
    events: {
      'app.activated': function (event) {
        if (!event.firstLoad) {
          return;
        }
        var ticket = this.ticket();
        var purchase_code = ticket.customField("custom_field_" + this.setting('purchasecode_field_id'));
        this.$('#purchase_code').val(purchase_code);
        if (ticket.status() === 'new' || ticket.status() === 'open') {
          if (purchase_code && purchase_code !== '') {
            this.ajax('verify_purchase', purchase_code);
            this.switchTo('loading', {
              purchase_code: purchase_code,
              username: this.setting('username')
            });
          } else {
            this.switchTo('failed', {
              message: this.I18n.t('purchase_code.type_purchase_code')
            });
          }
        }
      },
      'keypress #purchase_code': function (event) {
        if (event.which == 13) {
          // enter pressed
          event.preventDefault();
          var purchase_code = this.$(event.target).val();
          if (purchase_code && purchase_code !== '') {
            this.ajax('verify_purchase', purchase_code);
            this.switchTo('loading', {
              purchase_code: purchase_code,
              username: this.setting('username')
            });
          } else {
            this.switchTo('failed', {
              message: this.I18n.t('purchase_code.type_purchase_code')
            });
          }

        }
      },
      'verify_purchase.done': function (data) {
        // example responses:
        // {"verify-purchase":{}}
        // {"verify-purchase":{"item_name":"NAME","item_id":"ID","created_at":"Tue Feb 26 18:51:02 +1100 2013","buyer":"USERNAME","licence":"Regular License","supported_until":""}}

        if (data) {

          if (data.hasOwnProperty('item')) {
            if (data['item'].hasOwnProperty('id')) {

              var support_date = data.supported_until, support_text, support_class;

              if (support_date === "" || support_date === null) {
                support_text = this.I18n.t('purchase_code.support_expired');
                support_class = 'error';
			  } else if (new Date(support_date) < new Date()) {
                support_text = this.I18n.t('purchase_code.support_expired');
				support_date = this.I18n.t('purchase_code.support_valid_till') + ' ' + new Date(support_date).toLocaleString();
                support_class = 'error';
              } else {
                support_text = this.I18n.t('purchase_code.support_valid');
                support_date = this.I18n.t('purchase_code.support_valid_till') + ' ' + new Date(support_date).toLocaleString();
                support_class = 'success';
              }

              this.switchTo('verify_purchase_code_result', {
                item_name: data['item'].name,
                item_id: data['item'].id,
                created_at: new Date(data.sold_at).toLocaleString(),
                buyer: data.buyer,
                licence: data.licence,
                support_class: support_class,
                support_text: support_text,
                support_date: support_date
              });
            }
            else {
              this.switchTo('failed', {
                message: this.I18n.t('purchase_code.invalid_purchase_code')
              });
            }
          }
          else if (data.hasOwnProperty('error')) {
            this.switchTo('failed', {
              message: data.error
            });
          }
          else {
            this.switchTo('failed', {
              message: this.I18n.t('purchase_code.no_return_no_code')
            });
          }
        } else {
          this.switchTo('failed', {
            message: this.I18n.t('purchase_code.no_data')
          });
        }
      },
      'verify_purchase.fail': function () {
        this.switchTo('failed', {
          message: this.I18n.t('purchase_code.unable_to_contact')
        });
      }

    }
  };
}());