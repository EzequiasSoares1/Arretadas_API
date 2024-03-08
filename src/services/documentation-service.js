const swagger = require('swagger-ui-express');

exports.documentationService = (app) => {

    const doc = require('../../documentation/swaggerConfig.json');

    //Mapping
    const alert = require('../../documentation/modules/alert.json');
    const complaint = require('../../documentation/modules/complaint.json');
    const auth = require('../../documentation/modules/auth.json');
    const friendContact = require('../../documentation/modules/friendContacts.json')
    const protectiveMeasure = require('../../documentation/modules/protectiveMeasure.json')
    const useFulContacts = require('../../documentation/modules/useFulContacts.json')
    const user = require('../../documentation/modules/user.json')
    const userAdm = require('../../documentation/modules/userAdm.json')
    const report = require('../../documentation/modules/reports.json')


    //Login
    doc['paths']['/user/authenticate'] = auth['/authenticate']

    //UserAdm
    doc['paths']['/userAdm/authenticate'] = userAdm['/userAdm/authenticate']
    doc['paths']['/userAdm/valid-token'] = userAdm['/userAdm/valid-token']
    doc['paths']['/userAdm'] = userAdm['/userAdm']
    doc['paths']['/userAdm/{id}'] = userAdm['/userAdm/{id}']

    //User
    doc['paths']['/user/{name}'] = user['/user/{name}']
    doc['paths']['/user/city/{city}'] = user['/user/city/{city}']
    doc['paths']['/user/id/{id}'] = user['/user/id/{id}']
    doc['paths']['/user/update-password'] = user['/user/update-password']
    doc['paths']['/user/recover-password'] = user['/user/recover-password']
    doc['paths']['/user/recover-questions'] = user['/user/recover-questions']
    doc['paths']['/user/{id}'] = user['/user/{id}']
    doc['paths']['/user/refresh-token'] = user['/user/refresh-token']


    //UseFulContacts
    doc['paths']['/usefulcontacts'] = useFulContacts['/usefulcontacts']
    doc['paths']['/usefulcontacts/{name}'] = useFulContacts['/usefulcontacts/{name}']
    doc['paths']['/usefulcontacts/{id}'] = useFulContacts['/usefulcontacts/{id}']
    doc['paths']['/usefulcontacts/id/{id}'] = useFulContacts['/usefulcontacts/id/{id}']

    //friendContact
    doc['paths']['/friendcontact'] = friendContact['/friendcontact']
    doc['paths']['/friendcontact/{name}'] = friendContact['/friendcontact/{name}']
    doc['paths']['/friendcontact/id/{id}'] = friendContact['/friendcontact/id/{id}']
    doc['paths']['/friendcontact/user/{id}'] = friendContact['/friendcontact/user/{id}']
    doc['paths']['/friendcontact/{id}'] = friendContact['/friendcontact/{id}']

    //complaint
    doc['paths']['/complaint'] = complaint['/complaint']
    doc['paths']['/complaint/{id}'] = complaint['/complaint/{id}']
    doc['paths']['/complaint/user/{id}'] = complaint['/complaint/user/{id}']


    //alert
    doc['paths']['/alert'] = alert['/alert']
    doc['paths']['/alert/{id}'] = alert['/alert/{id}']
    doc['paths']['/alert/id/{id}'] = alert['/alert/id/{id}']
    doc['paths']['/alert/user/{id}'] = alert['/alert/user/{id}']


    //protectiveMeasure
    doc['paths']['/protective-measure'] = protectiveMeasure['/protective-measure']

    //ReportsBI

    //usersAdm
    doc['paths']['/reports/usersAdm'] = report['/reports/usersAdm'];

    //users
    doc['paths']['/reports/users'] = report['/reports/users'];
    doc['paths']['/reports/users/:city'] = report['/reports/users/:city'];

    //usefulcontacts
    doc['paths']['/reports/usefulcontacts'] = report['/reports/usefulcontacts'];

    // friendcontacts
    doc['paths']['/reports/friendcontacts'] = report['/reports/friendcontacts'];

    //complaints
    doc['paths']['/reports/complaints'] = report['/reports/complaints'];
    doc['paths']['/reports/complaints/city/{city}'] = report['/reports/complaints/city/{city}'];
    doc['paths']['/reports/complaints/{type}/city/{city}'] = report['/reports/complaints/{type}/city/{city}'];
    doc['paths']['/reports/complaints/localization'] = report['/reports/complaints/localization'];
    doc['paths']['/reports/complaints/period'] = report['/reports/complaints/period'];

    //alerts
    doc['paths']['/reports/alerts'] = report['/reports/alerts'];
    doc['paths']['/reports/alerts/period'] = report['/reports/alerts/period'];
    doc['paths']['/reports/alerts/city/{city}'] = report['/reports/alerts/city/{city}'];

    app.use('/documentation', swagger.serve, swagger.setup(doc))
}