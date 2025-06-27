export default (sequelize, DataTypes) => {
  const Approval = sequelize.define('Approval', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    transactionId: { type: DataTypes.INTEGER, allowNull: false },
    approverId: { type: DataTypes.INTEGER, allowNull: false },
    level: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'pending' }, // pending, approved, rejected
    notes: { type: DataTypes.STRING }
  });
  return Approval;
};
