export default (sequelize, DataTypes) => {
  const ERPExport = sequelize.define('ERPExport', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    exportDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    data: { type: DataTypes.JSONB },
    status: { type: DataTypes.STRING, defaultValue: 'pending' } // pending, sent, error
  });
  return ERPExport;
};
