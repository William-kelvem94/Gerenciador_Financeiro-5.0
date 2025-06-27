export default (sequelize, DataTypes) => {
  const TaxProfile = sequelize.define('TaxProfile', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    regime: { type: DataTypes.STRING, allowNull: false }, // simples, lucro real, etc
    rules: { type: DataTypes.JSONB }, // regras fiscais customizadas
    active: { type: DataTypes.BOOLEAN, defaultValue: true }
  });
  return TaxProfile;
};
