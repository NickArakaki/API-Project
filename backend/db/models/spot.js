'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

/****************************** Associations **************************************/
    static associate(models) {
      // Spot -> Booking
      Spot.hasMany(
        models.Booking,
        {
          foreignKey: 'spotId',
          onDelete: 'CASCADE',
          hooks: true
        });

      // Spot -> SpotImage
      Spot.hasMany(
        models.SpotImage,
        {
          foreignKey: 'spotId',
          onDelete: 'CASCADE',
          hooks: true
        });

      // Spot -> Review
      Spot.hasMany(
        models.Review,
        {
          foreignKey: 'spotId',
          onDelete: 'CASCADE',
          hooks: true
        });

      // Spot -> User
      Spot.belongsTo(
        models.User,
        {
          foreignKey: 'ownerId'
        });
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lat: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: false
    },
    lng: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        // len: [1, 49]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
