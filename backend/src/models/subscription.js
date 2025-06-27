export default (sequelize, DataTypes) => {
  const Subscription = sequelize.define('Subscription', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    value: { type: DataTypes.DECIMAL(15,2), allowNull: false },
    frequency: { type: DataTypes.STRING, allowNull: false }, // mensal, anual, etc
    nextRenewal: { type: DataTypes.DATEONLY, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'active' }, // active, canceled
    alertSent: { type: DataTypes.BOOLEAN, defaultValue: false }
  });
  return Subscription;
};
