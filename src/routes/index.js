const { Router } = require('express');
const router = Router();
const admin = require('firebase-admin');
require('dotenv').config()


var serviceAccount = require(process.env.CREDENTIAL_GOOGLE_APPLICATION);

//configuracion firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://app-contactos-example-default-rtdb.firebaseio.com/'
});

const db = admin.database();

//RUTAS
router.get('/', (req, res) => {
    db.ref('contacts').once('value', (snapshot) => {
        const data = snapshot.val();
        res.render('index', { contacts: data });
    });

});
router.post('/new-contact', (req, res) => {
    const { firstname, lastname, email, phone } = req.body;

    const newContact = {
        firstname: firstname,
        lastname: lastname,
        email: email,
        phone: phone
    }
    if (firstname && lastname && email && phone) {
        db.ref('contacts').push(newContact)
        res.redirect('/');
    } else {
        res.redirect('/');

    }

});

router.get("/delete-contact/:id", (req, res) => {
    db.ref('contacts/' + req.params.id).remove();
    res.redirect('/')
})



module.exports = router;