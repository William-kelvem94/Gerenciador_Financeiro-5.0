export default (sequelize, DataTypes) => {
  const Card = sequelize.define('Card', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false }, // crédito, débito
    limit: { type: DataTypes.DECIMAL(15,2) },
    closingDay: { type: DataTypes.INTEGER }, // dia de fechamento da fatura
    dueDay: { type: DataTypes.INTEGER }, // dia de vencimento
    currentInvoice: { type: DataTypes.DECIMAL(15,2), defaultValue: 0 }
  });
  return Card;
};
