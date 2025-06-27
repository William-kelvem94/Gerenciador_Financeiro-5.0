export default (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    description: { type: DataTypes.STRING, allowNull: false }, // nome
    value: { type: DataTypes.DECIMAL(15,2), allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false }, // entrada, saída, transferência
    categoryId: { type: DataTypes.INTEGER },
    accountId: { type: DataTypes.INTEGER },
    goalType: { type: DataTypes.STRING }, // economia, max_gasto, etc
    goalValue: { type: DataTypes.DECIMAL(15,2) }, // valor da meta
    bankName: { type: DataTypes.STRING }, // banco de origem
    extra: { type: DataTypes.JSONB } // campos extras flexíveis
  });
  return Transaction;
};
