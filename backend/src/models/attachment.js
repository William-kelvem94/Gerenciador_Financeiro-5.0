export default (sequelize, DataTypes) => {
  const Attachment = sequelize.define('Attachment', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    transactionId: { type: DataTypes.INTEGER, allowNull: false },
    filename: { type: DataTypes.STRING, allowNull: false },
    url: { type: DataTypes.STRING, allowNull: false },
    mimetype: { type: DataTypes.STRING }
  });
  return Attachment;
};
