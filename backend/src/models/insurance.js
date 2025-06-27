export default (sequelize, DataTypes) => {
  const Insurance = sequelize.define('Insurance', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    policyNumber: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING }, // vida, auto, residencial, etc
    insuredValue: { type: DataTypes.DECIMAL(15,2) },
    startDate: { type: DataTypes.DATEONLY },
    endDate: { type: DataTypes.DATEONLY },
    provider: { type: DataTypes.STRING },
    status: { type: DataTypes.STRING, defaultValue: 'active' }, // active, expired, canceled
    notes: { type: DataTypes.STRING }
  });
  return Insurance;
};
