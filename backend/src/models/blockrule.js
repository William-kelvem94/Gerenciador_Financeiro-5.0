export default (sequelize, DataTypes) => {
  const BlockRule = sequelize.define('BlockRule', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    type: { type: DataTypes.STRING, allowNull: false }, // 'category' ou 'account'
    referenceId: { type: DataTypes.INTEGER, allowNull: false }, // categoryId ou accountId
    limit: { type: DataTypes.DECIMAL(15,2), allowNull: false },
    period: { type: DataTypes.STRING, allowNull: false }, // ex: '2024-06'
    active: { type: DataTypes.BOOLEAN, defaultValue: true }
  });
  return BlockRule;
};
