# DKP-BUDDY

Pour tester en local, vous devez ajoutez dans le dossier config un fichier json qui correspond à vos variables d'environnement et les
parametrer selon votre configuration.

Ce fichier est comme ceci :

{
  "port": "",
  "session_secret": "",
  "bdd_host": "",
  "bdd_username": "",
  "bdd_password": "",
  "bdd_name": "",
  "bdd_dialect": "mariadb",
  "bdd_operator_alias": false
}

Vous devez créer la base de donnée qui s'apelle DKP.

Pour créer les tables automatiquement, décommenter la ligne 47 du fichier models/index.js "sequelize.sync()" et 
lancer la commande : node models/index.js

Recommentez la ligne ensuite avant de lancer l'application.

Ici les items sont stocker dans un fichier json donc vous devez les importez manuellement.

Bien évidemment, il faut que sequilize puisse se connecter à votre BDD donc bien configurer le fichier de config.

Une fois que votre BDD est paramétré avec vos tables lancer la commande node : src/test_data/insert_test_data.js pour pouvoir insérer les items.

Puis vous pouvez lancer l'app avec la commande : node src/app.js



