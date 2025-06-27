export default (sequelize, DataTypes) => {
  const Inheritance = sequelize.define('Inheritance', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    assetId: { type: DataTypes.INTEGER, allowNull: false },
    beneficiary: { type: DataTypes.STRING, allowNull: false },
    share: { type: DataTypes.DECIMAL(5,2), allowNull: false }, // percentual
    status: { type: DataTypes.STRING, defaultValue: 'pending' } // pending, completed
  });
  return Inheritance;
};
