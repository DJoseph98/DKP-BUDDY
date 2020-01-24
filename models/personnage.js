'use strict';
module.exports = (sequelize, DataTypes) => {
  const Personnage = sequelize.define('Personnage', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    dkp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    actif: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    classe: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    }
  }, {});
  Personnage.associate = function(models) {
    // associations can be defined here
  };
  return Personnage;
};