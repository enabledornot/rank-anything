import { Router } from 'express';
import { ListModel } from '../models/list';
import { Types } from 'mongoose';

const router = Router();

router.get('/', (_request, response) => {
  response.send('Welcome to Auth');
});

router.get('/user', async (request, response) => {
    const userId = request.session.userId;
    if (!userId) {
        return response.status(401).json({ error: 'Not Signed In' });
    }
    const lists = await ListModel.find({ creatorId: userId });
    return response.json({ lists })
});

router.post('/', async (request, response) => {
    const userId = request.session.userId;
    if (!userId) {
        return response.status(401).json({ error: 'Not Signed In' });
    }
    const list = await ListModel.create({
        creatorId: userId,
        title: 'Untitled list',
        description: '',
        items: [],
    });
    return response.status(201).json({ list });
});

router.patch('/:listId', async (request, response) => {
    const userId = request.session.userId;
    if (!userId) {
        return response.status(401).json({ error: 'Not Signed In' });
    }

    const { listId } = request.params;

    if (!Types.ObjectId.isValid(listId)) {
        return response.status(400).json({ error: 'Invalid list ID' });
    }

    const { title, description, items } = request.body;

    const updates: Record<string, unknown> = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (items !== undefined) updates.items = items;

    if (Object.keys(updates).length === 0) {
        return response.status(400).json({ error: 'No fields specified' });
    }

    const list = await ListModel.findOneAndUpdate(
        { _id: listId, creatorId: userId },
        { $set: updates },
        { new: true, runValidators: true },
    );

    if (!list) {
        return response.status(404).json({ error: 'List not found' });
    }

    return response.json({ list });
})

router.delete('/:listId', async (request, response) => {
        const userId = request.session.userId;
    if (!userId) {
        return response.status(401).json({ error: 'Not Signed In' });
    }

    const { listId } = request.params;

    if (!Types.ObjectId.isValid(listId)) {
        return response.status(400).json({ error: 'Invalid list ID' });
    }

    const list = await ListModel.findOneAndDelete(
        { _id: listId, creatorId: userId }
    );

    if (!list) {
        return response.status(404).json({ error: 'list not found' });
    }
    return response.json({ list });
})

export default router;
