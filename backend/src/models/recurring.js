export default (sequelize, DataTypes) => {
  const Recurring = sequelize.define('Recurring', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    description: { type: DataTypes.STRING, allowNull: false },
    value: { type: DataTypes.DECIMAL(15,2), allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false }, // receita, despesa
    frequency: { type: DataTypes.STRING, allowNull: false }, // mensal, semanal, anual
    nextDate: { type: DataTypes.DATEONLY, allowNull: false },
    categoryId: { type: DataTypes.INTEGER },
    accountId: { type: DataTypes.INTEGER }
  });
  return Recurring;
};
