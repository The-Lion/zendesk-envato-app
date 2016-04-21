# Zendesk Envato Integration

Easily query the [Envato API](http://marketplace.envato.com/api/documentation) for license keys.

![Zendesk Envato Integration](https://raw.githubusercontent.com/The-Lion/zendesk-envato-app/master/screenshot_small.png "Zendesk Envato Integration")

### Installation
1. In Zendesk go to Admin -> Apps -> Manage -> Upload App
2. Upload the downloaded zip file (zendesk-envato-app-master.zip) and set an App name, e.g. Envato - Verify Purchase & Support 
3. [Create your personal token](https://build.envato.com/create-token/) for the Envato API. Select **View your items' sales history** and **Verify purchases of your items**. Insert the created token into the `Personal Token` setting of the uploaded App
4. If you want to check the purchase code of your tickets automatically checks, enter the `Field ID` of the corresponding purchase code field. If you don't have such a ticket field yet, see below.


### Create Purchase Code ticket field
1. Go to Admin -> Ticket Fields and click on `add custom field`
2. Select a `Regular Expression field`
3. Make the field visible and editable for end-users. Add a description like: `Format: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX. If you have a pre-sale questions, just leave it empty.`
4. Under `Field options` set the following expression: `^([a-z0-9]{8})-?([a-z0-9]{4})-?([a-z0-9]{4})-?([a-z0-9]{4})-?([a-z0-9]{12})$`
5. After saving the purchase field you can find the Field ID on top of its edit page. You can insert this ID in the settings of this App.


App based on https://github.com/mattes/zendesk-envato-app

Have a question? Feel free to let me know.

[Send me a beer!](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=CR7G44T9WPZAA&lc=US&item_name=Florisdeleeuw%2enl&item_number=Zendesk%20App%20Envato&currency_code=EUR&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHosted)

Cheers.
