export default (sequelize, DataTypes) => {
  const Settings = sequelize.define('Settings', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    allowUserRegistration: { type: DataTypes.BOOLEAN, defaultValue: true },
    defaultUserRole: { type: DataTypes.STRING, defaultValue: 'user' },
    enableSharedAccounts: { type: DataTypes.BOOLEAN, defaultValue: false },
    sharedAccountInviteOnly: { type: DataTypes.BOOLEAN, defaultValue: true },
    // Integração com IA
    aiIntegrationEnabled: { type: DataTypes.BOOLEAN, defaultValue: false },
    aiProvider: { type: DataTypes.STRING }, // ex: 'openai', 'azure', 'outro'
    aiApiKey: { type: DataTypes.STRING }, // chave da API (opcional)
    aiChatEnabled: { type: DataTypes.BOOLEAN, defaultValue: false },
    aiChatWelcomeMessage: { type: DataTypes.STRING, defaultValue: 'Olá! Sou a IA do seu financeiro.' },
    // Outros campos de configuração podem ser adicionados aqui
    extra: { type: DataTypes.JSONB }
  });
  return Settings;
};
