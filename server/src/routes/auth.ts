import { Router } from 'express';
import { UserModel } from '../models/user';

const router = Router();

router.get('/', (_request, response) => {
  response.send('Welcome to Auth');
});

router.get('/me', async (request, response) => {
    const userId = request.session.userId;
    if (!userId) {
        const guest = await UserModel.create({ isAnonymous: true });
        request.session.userId = guest.id;
        return response.json({
            authenticated: true,
            user: {
                id: guest.id,
                username: guest.username ?? null,
                isAnonymous: guest.isAnonymous,
                newUser: true
            }
        });
    }

    const user = await UserModel.findById(userId).select('username isAnonymous');

    if (!user) {
                const guest = await UserModel.create({ isAnonymous: true });
        request.session.userId = guest.id;
        return response.json({
            authenticated: true,
            user: {
                id: guest.id,
                username: guest.username ?? null,
                isAnonymous: guest.isAnonymous,
                newUser: true
            }
        });
    }

    return response.json({
        authenticated: true,
        user: {
            id: user.id,
            username: user.username ?? null,
            isAnonymous: user.isAnonymous,
            newUser: false
        }
    });
});

export default router;
