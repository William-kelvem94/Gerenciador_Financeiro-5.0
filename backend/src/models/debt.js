export default (sequelize, DataTypes) => {
  const Debt = sequelize.define('Debt', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    creditor: { type: DataTypes.STRING, allowNull: false },
    value: { type: DataTypes.DECIMAL(15,2), allowNull: false },
    startDate: { type: DataTypes.DATEONLY },
    dueDate: { type: DataTypes.DATEONLY },
    interestRate: { type: DataTypes.DECIMAL(5,2) },
    paid: { type: DataTypes.BOOLEAN, defaultValue: false },
    description: { type: DataTypes.STRING }
  });
  return Debt;
};
