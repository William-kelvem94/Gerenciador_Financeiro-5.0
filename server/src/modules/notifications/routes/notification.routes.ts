import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';

const router = Router();

router.post('/send', NotificationController.sendNotification);

export default router;
