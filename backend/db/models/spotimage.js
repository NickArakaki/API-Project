'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

/****************************** Associations **************************************/
    static associate(models) {
      // SpotImage -> Spot
      SpotImage.belongsTo(models.Spot, { foreignKey: 'spotId' });
    }
  }
  SpotImage.init({
    spotId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Spots',
        key: 'id'
      }
    },
    url: DataTypes.TEXT,
    preview: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'SpotImage',
  });
  return SpotImage;
};
