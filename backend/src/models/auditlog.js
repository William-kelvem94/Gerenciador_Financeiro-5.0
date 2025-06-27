export default (sequelize, DataTypes) => {
  const AuditLog = sequelize.define('AuditLog', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER },
    action: { type: DataTypes.STRING, allowNull: false }, // create, update, delete, login, etc
    entity: { type: DataTypes.STRING, allowNull: false }, // tabela/modelo afetado
    entityId: { type: DataTypes.INTEGER }, // id do registro afetado
    before: { type: DataTypes.JSONB }, // dados antes da alteração
    after: { type: DataTypes.JSONB }, // dados após a alteração
    timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  });
  return AuditLog;
};
