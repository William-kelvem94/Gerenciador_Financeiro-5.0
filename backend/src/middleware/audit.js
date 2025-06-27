import db from '../models/index.js';

export async function auditLog(req, res, next) {
  res.on('finish', async () => {
    // Só loga se for alteração relevante e usuário autenticado
    if (['POST', 'PUT', 'DELETE'].includes(req.method) && req.user) {
      const entity = req.baseUrl.replace('/api/', '').replace('s', '');
      const entityId = req.params.id || res.locals?.entityId;
      await db.AuditLog.create({
        userId: req.user.id,
        action: req.method.toLowerCase(),
        entity,
        entityId,
        before: res.locals?.before,
        after: res.locals?.after
      });
    }
  });
  next();
}
