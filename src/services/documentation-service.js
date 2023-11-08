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

    //Login
    doc['paths']['/user/authenticate'] = auth['/authenticate']

    //UserAdm
    doc['paths']['/userAdm/authenticate'] = userAdm['/userAdm/authenticate']
    doc['paths']['/userAdm/valid-token'] = userAdm['/userAdm/valid-token']
    doc['paths']['/userAdm'] = userAdm['/userAdm']
    doc['paths']['/userAdm/{id}'] = userAdm['/userAdm/{id}']
    doc['paths']['/userAdm/name/{name}'] = userAdm['/userAdm/name/{name}']

    //User
    doc['paths']['/user'] = user['/user']
    doc['paths']['/user/{name}'] = user['/user/{name}']
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
    doc['paths']['/friendcontact'] = friendContact['/friendcontact'],
        doc['paths']['/friendcontact/{name}'] = friendContact['/friendcontact/{name}']
    doc['paths']['/friendcontact/id/{id}'] = friendContact['/friendcontact/id/{id}']
    doc['paths']['/friendcontact/user/{id}'] = friendContact['/friendcontact/user/{id}']
    doc['paths']['/friendcontact/{id}'] = friendContact['/friendcontact/{id}']

    //complaint
    doc['paths']['/complaint'] = complaint['/complaint']

    //alert
    doc['paths']['/alert'] = alert['/alert']

    //protectiveMeasure
    doc['paths']['/protective-measure'] = protectiveMeasure['/protective-measure']

    app.use('/documentation', swagger.serve, swagger.setup(doc))
}