import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { socialMediaSchema } from './socialMedia.validation';
import SocialMediaController from './socialMedia.controller';

const router = express.Router();

router.post('/create-social-media', AuthMiddleware(UserRole.owner), validationMiddleware(socialMediaSchema), SocialMediaController.createSocialMedia);
router.get('/get-social-media', AuthMiddleware(UserRole.owner), SocialMediaController.getSocialMedia);
router.patch('/update-social-media', AuthMiddleware(UserRole.owner), validationMiddleware(socialMediaSchema), SocialMediaController.updateSocialMedia);
router.delete('/delete-social-media', AuthMiddleware(UserRole.owner),  SocialMediaController.deleteSocialMedia);


export const SocialMediaRoutes = router;