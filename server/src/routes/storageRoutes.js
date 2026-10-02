import express from 'express';
import { store } from '../data/store.js';

const router = express.Router();

router.get('/storage/items', (req, res) => {
  res.json({ success: true, data: store.getStorageItems(req.query.parentId || null) });
});

router.post('/storage/folders', (req, res) => {
  const name = String(req.body?.name || '').trim();
  if (!name) return res.status(400).json({ success: false, error: 'FOLDER_NAME_REQUIRED' });
  res.status(201).json({ success: true, data: store.addStorageItem({ name, type: 'folder', parentId: req.body.parentId || null }) });
});

router.post('/storage/files', (req, res) => {
  const { name, size = 0, type = 'document', parentId = null } = req.body || {};
  if (!name) return res.status(400).json({ success: false, error: 'FILE_NAME_REQUIRED' });
  res.status(201).json({ success: true, data: store.addStorageItem({ name, size, type, parentId }) });
});

router.patch('/storage/items/:id', (req, res) => {
  const name = String(req.body?.name || '').trim();
  if (!name) return res.status(400).json({ success: false, error: 'NAME_REQUIRED' });
  const item = store.renameStorageItem(req.params.id, name);
  if (!item) return res.status(404).json({ success: false, error: 'ITEM_NOT_FOUND' });
  res.json({ success: true, data: item });
});

router.delete('/storage/items/:id', (req, res) => {
  if (!store.removeStorageItem(req.params.id)) return res.status(404).json({ success: false, error: 'ITEM_NOT_FOUND' });
  res.json({ success: true });
});

export default router;
