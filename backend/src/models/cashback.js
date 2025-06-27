export default (sequelize, DataTypes) => {
  const Cashback = sequelize.define('Cashback', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    transactionId: { type: DataTypes.INTEGER },
    points: { type: DataTypes.INTEGER, defaultValue: 0 },
    cashbackValue: { type: DataTypes.DECIMAL(15,2), defaultValue: 0 },
    program: { type: DataTypes.STRING }, // nome do programa de fidelidade
    status: { type: DataTypes.STRING, defaultValue: 'pending' } // pending, credited, expired
  });
  return Cashback;
};
