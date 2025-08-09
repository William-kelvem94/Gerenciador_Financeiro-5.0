import { Request, Response } from 'express';
import { ResponseHelper } from '../../../shared/utils/response.util';

/**
 * Controller de notificações (push, alertas, etc)
 */
export class NotificationController {
  static async sendNotification(req: Request, res: Response) {
    // TODO: Implementar envio de notificação
    return res.json(ResponseHelper.success({ sent: true }, 'Notificação enviada'));
  }
}
