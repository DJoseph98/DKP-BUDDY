/* Inclusion des lib à utiliser */
const express = require('express')
const router = new express.Router()
const db = require('../../models/index')
const { passport, loggedIn, /* loggedInForUpdate */ } = require('../middleware/passport')
const multer  = require('multer')
const utils = require('../utils/parserLua')

// SET STORAGE MULTER
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './files')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + '.lua')
    }
  })
  
const upload = multer({ storage })

/* Création instance User */
const User = db.sequelize.models.User

/* Création instance Item */
const Item = db.sequelize.models.Item

/* GET route homepage */
router.get('/home', async function (req, res) {

    try {
        listeDKP = await db.sequelize.models.Personnage.findAll({
            attributes:['nom', 'dkp']
        })
        
        listeHistorique = await db.sequelize.models.Historique.findAll({
            attributes:['id_wowhead', 'date_loot', 'dkp_lost'],
            include: [{
                model: db.sequelize.models.Personnage,
                attributes:['nom']
            }],
            order: [['createdAt', 'DESC']]
        })
        
    } catch (error) {
        throw new Error(error)
    }

    res.render('home', {
        listeDKP: listeDKP,
        listeHistorique: listeHistorique,
        layout: 'layout'
    })
})

/* GET route page admin */
router.get('/admin', loggedIn, function (req, res) {
    res.render('gestion', {
        layout: 'layout'
    })
})

/* GET route login page admin */
/* Utilisation de la fonction loggedIn comme middleware */
router.get('/login', function (req, res) {
    res.render('login', {
        layout: 'layout'
    })
})

/* POST route login page admin */
/* Utilisation de la fonction loggedIn comme middleware */
router.post('/import', upload.single('monoliteFile'), async function (req, res) {
    
    const file = req.file
    try {
        await utils.ImportDataDkp(file)
        await utils.ImportDateHistorique(file)
    } catch (error) {
        throw new Error("Probleme import", error)
    }
    
    res.render('gestion', {
        layout: 'layout'
    })
})

/* POST route login page admin*/
router.post('/login',
    /* Utilisation passport pour s'hautentifier */
    passport.authenticate('local', { failureRedirect: '/login' }),
    function (req, res) { // si authentification OK on redirige vers page gestion
        /* Render la vue items */
        res.render('gestion', {
            layout: 'layout'
        })
    
    })

/* GET route items page */
router.get('/items', async (req, res) => {

    let isModifiable = false
    if(req.user)
        isModifiable = true

    console.log(isModifiable)
    /* Création instance Raid */
    let Raid = db.sequelize.models.Raid
    let listeAllItemByRaid
    try {
        listeAllItemByRaid = await Raid.findAll({  // construit la requete pour récupérer les donnnées depuis  table Raid
            attributes: ['nom'],  // SELECT  Raid.nom
            include: [{                 // JOIN 
                model: db.sequelize.models.Boss,  // table BOSS
                attributes: ['nom'],    // SELECT Boss.nom
                include: [{             // JOIN
                    model: db.sequelize.models.Item, // table Item
                    attributes: ['id_wowhead', 'prix'],  // SELECT Item.id_wowhead
                    required: true
                }],
    
                required: true
            }],
            required: true // permet de forcer l'association avec un INNER JOIN, de base utilise LEFT JOIN
        })
    } catch (error) {
        throw new Error ('Problème récupération items',error)
    }
    /* Render la vue items */   
    res.render('items', {
        layout: 'layout',
        listeAllItemByRaid: listeAllItemByRaid,
        isModifiable: isModifiable
    })
})

/* POST route update Prix */
router.post('/updatePrice', loggedIn, async (req, res) => {

        let id_wowhead = req.body.id
        let newPrice = req.body.newPrice

        try {
            await Item.update({ prix: newPrice }, {
                where: {
                    id_wowhead: id_wowhead
                }
              });
              res.send(200)
        } catch (error) {
            throw new Error('Erreur update prix')
        }
    });

module.exports = router // pour pouvoir utiliser la lib en dehors de ce fichier