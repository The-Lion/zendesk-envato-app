var client = ZAFClient.init();
var token;

client.on('app.registered', function () {
  client.invoke('resize', {width: '100%', height: '40px'});
  init();
});

function init() {
  client.metadata().then(function (metadata) {

    token = metadata.settings.token;
    var purchase_code_field = "ticket.customField:custom_field_" + metadata.settings['purchasecode_field_id'];
    var purchase_code;

    client.get(purchase_code_field).then(function (data) {

      purchase_code = data[purchase_code_field];
      $('#app_envato_licenses #purchase_code').val(purchase_code);

      if (purchase_code !== '') {
        check_purchase_code(purchase_code);
      }
    });
  });
}

function check_purchase_code(purchase_code) {

  if (purchase_code && purchase_code !== '') {

    client.invoke('resize', {width: '100%', height: '110px'});

    $('#app_envato_licenses .loading').slideDown();
    $('#app_envato_licenses .verify_failed').hide();
    $('#app_envato_licenses .verify-purchase-code-result').hide();
    $('#app_envato_licenses .check_purchase_code').val(purchase_code);

    var api_request = {
      url: 'https://api.envato.com/v3/market/author/sale?code=' + purchase_code,
      type: 'GET',
      dataType: 'json',
      secure: true,
      headers: {"Authorization": "Bearer " + token},
      cors: true
    };

    client.request(api_request).then(
            function (api_response) {
              $('#app_envato_licenses .loading').hide();
              return verify_purchase(api_response);
            },
            function (api_response) {
              $('#app_envato_licenses .loading').hide();
              return render_error('Invalid Purchase code or unable to contact API.');
            }
    );
  }
}

function verify_purchase(api_response) {
  if (false === api_response.hasOwnProperty('item')) {
    if (api_response.hasOwnProperty('error')) {
      return render_error(api_response.error);
    } else {
      return render_error('Invalid Purchase code or unable to contact API.');
    }
  }

  if (false === (api_response['item'].hasOwnProperty('id'))) {
    return render_error('Invalid purchase code');
  }

  render_license(api_response);
}

function render_license(api_response) {

  // {"api_response":{}}
  // {"api_response":{"item_name":"NAME","item_id":"ID","created_at":"Tue Feb 26 18:51:02 +1100 2013","buyer":"USERNAME","licence":"Regular License","supported_until":""}}

  $('#app_envato_licenses .item_name').html('<a href="' + api_response['item'].url + '" target="_blank">' + api_response['item'].name + '</a>');
  $('#app_envato_licenses .item_thumbnail').attr('src', api_response['item'].previews.landscape_preview.landscape_url);
  $('#app_envato_licenses .license_type').html(api_response.license);
  $('#app_envato_licenses .license_created_at').html(moment(api_response.sold_at).format('LLL'));
  $('#app_envato_licenses .buyer_name').html(api_response.buyer);
  $('#app_envato_licenses .purchase_count').html(api_response.purchase_count);
  $('#app_envato_licenses .buyer_url').attr('href', 'http://themeforest.net/user/' + api_response.buyer);

  var support_date = api_response.supported_until;

  $('#app_envato_licenses .support').removeClass('c-callout--error c-callout--success');
  if (support_date === "" || support_date === null) {
    $('#app_envato_licenses .support_status').html("NO SUPPORT PACKAGE");
    $('#app_envato_licenses .support').addClass('c-callout--error');
  } else if (new Date(support_date) < new Date()) {
    $('#app_envato_licenses .support_status').html("EXPIRED SUPPORT PACKAGE");
    $('#app_envato_licenses .support_till').html('Expired on ' + moment(support_date).format('LL'));
    $('#app_envato_licenses .support').addClass('c-callout--error');
  } else {
    $('#app_envato_licenses .support_status').html("VALID SUPPORT PACK");
    $('#app_envato_licenses .support_till').html('Valid till ' + moment(support_date).format('LL'));
    $('#app_envato_licenses .support').addClass('c-callout--success');
  }

  client.invoke('resize', {width: '100%', height: '500px'});

  $('.verify-purchase-code-result').slideDown();
}

function render_error(error) {
  client.invoke('resize', {width: '100%', height: '145px'});
  $('#app_envato_licenses .verify_failed').addClass('c-callout--error').html('<p class="c-callout__title">' + error + '</p>');
  $('#app_envato_licenses .verify_failed').slideDown();
}


$('#app_envato_licenses #purchase_code').on('keypress', function (e) {
  if (e.which === 13) {
    event.preventDefault();
    var purchase_code = $(this).val();
    check_purchase_code(purchase_code);
  } else {
    render_error('Please type purchase code.');
  }

  return;
});