export default (sequelize, DataTypes) => {
  const CreditLimit = sequelize.define('CreditLimit', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    limit: { type: DataTypes.DECIMAL(15,2), allowNull: false },
    used: { type: DataTypes.DECIMAL(15,2), defaultValue: 0 },
    score: { type: DataTypes.INTEGER, defaultValue: 0 },
    riskAlert: { type: DataTypes.BOOLEAN, defaultValue: false }
  });
  return CreditLimit;
};
