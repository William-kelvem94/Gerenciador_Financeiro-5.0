export default (sequelize, DataTypes) => {
  const SharedExpense = sequelize.define('SharedExpense', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    description: { type: DataTypes.STRING, allowNull: false },
    totalValue: { type: DataTypes.DECIMAL(15,2), allowNull: false },
    payerId: { type: DataTypes.INTEGER, allowNull: false },
    participants: { type: DataTypes.JSONB, allowNull: false } // [{userId, share}]
  });
  return SharedExpense;
};
