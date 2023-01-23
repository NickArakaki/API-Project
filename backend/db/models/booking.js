'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

/****************************** Associations **************************************/
    static associate(models) {
      // Booking -> User
      Booking.belongsTo(
        models.User,
        {
          foreignKey: 'userId'
        });

      // Booking -> Spot
      Booking.belongsTo(
        models.Spot,
        {
          foreignKey: 'spotId'
        });
    }
  }
  Booking.init({
    spotId: DataTypes.INTEGER,
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    starteDate: DataTypes.DATE,
    endDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};
