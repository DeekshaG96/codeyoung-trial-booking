const STORAGE_KEY = 'codeyoung_storage_items_v1';

const seedItems = [
  { id: 'folder-projects', name: 'Projects', type: 'folder', parentId: null, updatedAt: '2026-09-28T10:00:00.000Z', owner: 'Sarah Jenkins' },
  { id: 'folder-resources', name: 'Learning resources', type: 'folder', parentId: null, updatedAt: '2026-09-25T12:30:00.000Z', owner: 'Sarah Jenkins' },
  { id: 'file-roadmap', name: 'Codeyoung roadmap.pdf', type: 'pdf', size: 2457600, parentId: null, updatedAt: '2026-09-30T08:15:00.000Z', owner: 'Sarah Jenkins' },
  { id: 'file-scratch', name: 'Scratch game assets.zip', type: 'archive', size: 18432000, parentId: null, updatedAt: '2026-09-29T14:45:00.000Z', owner: 'Sarah Jenkins' },
  { id: 'file-notes', name: 'Mentor session notes.docx', type: 'document', size: 786432, parentId: 'folder-projects', updatedAt: '2026-09-27T16:20:00.000Z', owner: 'Sarah Jenkins' },
  { id: 'file-brief', name: 'Parent onboarding brief.pdf', type: 'pdf', size: 1258291, parentId: 'folder-projects', updatedAt: '2026-09-26T09:10:00.000Z', owner: 'Sarah Jenkins' }
];

function readItems() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (error) {
    console.warn('[Storage] Unable to read local items:', error);
  }
  return seedItems;
}

function writeItems(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.warn('[Storage] Unable to persist local items:', error);
  }
  return items;
}

export const storageService = {
  list(parentId = null) {
    return Promise.resolve({ success: true, data: readItems().filter(item => item.parentId === parentId) });
  },
  createFolder(name, parentId = null) {
    const items = readItems();
    const folder = { id: `folder-${Date.now()}`, name: name.trim(), type: 'folder', parentId, updatedAt: new Date().toISOString(), owner: 'You' };
    writeItems([folder, ...items]);
    return Promise.resolve({ success: true, data: folder });
  },
  upload(file, parentId = null) {
    const items = readItems();
    const item = { id: `file-${Date.now()}`, name: file.name, type: file.type?.includes('pdf') ? 'pdf' : file.type?.includes('zip') ? 'archive' : 'document', size: file.size, parentId, updatedAt: new Date().toISOString(), owner: 'You' };
    writeItems([item, ...items]);
    return Promise.resolve({ success: true, data: item });
  },
  rename(id, name) {
    const items = readItems().map(item => item.id === id ? { ...item, name: name.trim(), updatedAt: new Date().toISOString() } : item);
    writeItems(items);
    return Promise.resolve({ success: true, data: items.find(item => item.id === id) });
  },
  remove(id) {
    const items = readItems();
    const ids = new Set([id]);
    let changed = true;
    while (changed) {
      changed = false;
      items.forEach(item => {
        if (ids.has(item.parentId) && !ids.has(item.id)) {
          ids.add(item.id);
          changed = true;
        }
      });
    }
    writeItems(items.filter(item => !ids.has(item.id)));
    return Promise.resolve({ success: true });
  },
  all() {
    return readItems();
  }
};
