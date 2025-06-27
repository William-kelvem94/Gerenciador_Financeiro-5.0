export default (sequelize, DataTypes) => {
  const Budget = sequelize.define('Budget', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    categoryId: { type: DataTypes.INTEGER, allowNull: false },
    limit: { type: DataTypes.DECIMAL(15,2), allowNull: false },
    period: { type: DataTypes.STRING, allowNull: false } // ex: '2024-06'
  });
  return Budget;
};
