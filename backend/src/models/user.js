export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: 'user' }, // admin, user, etc
    familyId: { type: DataTypes.INTEGER }, // para contas compartilhadas
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
  });
  return User;
};
