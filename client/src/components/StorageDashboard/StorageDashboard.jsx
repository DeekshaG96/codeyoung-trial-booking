import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Archive, ChevronRight, Cloud, Download, File, FileText, Folder, FolderPlus,
  Grid2X2, List, MoreHorizontal, Pencil, Plus, Search, Share2, Sparkles, Trash2,
  Upload, X
} from 'lucide-react';
import { api } from '../../services/api';
import './StorageDashboard.css';

const STORAGE_LIMIT = 15 * 1024 * 1024 * 1024;

function formatSize(bytes = 0) {
  if (!bytes) return '—';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / (1024 ** index)).toFixed(index ? 1 : 0)} ${units[index]}`;
}

function iconFor(item) {
  if (item.type === 'folder') return <Folder size={22} fill="currentColor" />;
  if (item.type === 'pdf') return <FileText size={22} />;
  if (item.type === 'archive') return <Archive size={22} />;
  return <File size={22} />;
}

export default function StorageDashboard() {
  const [items, setItems] = useState([]);
  const [breadcrumbs, setBreadcrumbs] = useState([{ id: null, name: 'My Drive' }]);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [menuId, setMenuId] = useState(null);
  const [modal, setModal] = useState(null);
  const [draftName, setDraftName] = useState('');
  const fileRef = useRef(null);

  const parentId = breadcrumbs[breadcrumbs.length - 1].id;

  const loadItems = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await api.getStorageItems(parentId);
      setItems(result.data || []);
    } catch (loadError) {
      setError(loadError.message || 'Unable to load your files.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadItems(); }, [parentId]);

  const visibleItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return query ? items.filter(item => item.name.toLowerCase().includes(query)) : items;
  }, [items, search]);

  const allItems = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('codeyoung_storage_items_v1') || '[]');
    } catch {
      return [];
    }
  }, [items]);
  const usedBytes = allItems.reduce((total, item) => total + (item.size || 0), 0);
  const percentUsed = Math.max(1, Math.min(100, (usedBytes / STORAGE_LIMIT) * 100));

  const openFolder = (item) => {
    setSearch('');
    setBreadcrumbs(current => [...current, { id: item.id, name: item.name }]);
  };

  const createFolder = async () => {
    if (!draftName.trim()) return;
    await api.createStorageFolder(draftName, parentId);
    setDraftName('');
    setModal(null);
    loadItems();
  };

  const renameItem = async (item) => {
    if (!draftName.trim()) return;
    await api.renameStorageItem(item.id, draftName);
    setDraftName('');
    setModal(null);
    loadItems();
  };

  const deleteItem = async (item) => {
    if (!window.confirm(`Delete ${item.name}?`)) return;
    await api.deleteStorageItem(item.id);
    setMenuId(null);
    loadItems();
  };

  const uploadFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    await Promise.all(files.map(file => api.uploadStorageFile(file, parentId)));
    event.target.value = '';
    loadItems();
  };

  return (
    <section className="storage-shell">
      <aside className="storage-sidebar">
        <div className="storage-sidebar-brand"><div className="storage-drive-mark"><Cloud size={18} /></div><span>Cloudspace</span></div>
        <button className="storage-new-button" onClick={() => setModal('folder')}><Plus size={18} /> New</button>
        <nav className="storage-nav" aria-label="Storage navigation">
          <button className="storage-nav-item active"><Folder size={17} /> My Drive <span>{allItems.length || items.length}</span></button>
          <button className="storage-nav-item"><Share2 size={17} /> Shared with me</button>
          <button className="storage-nav-item"><Sparkles size={17} /> Starred</button>
          <button className="storage-nav-item"><Trash2 size={17} /> Trash</button>
        </nav>
        <div className="storage-sidebar-bottom">
          <div className="storage-meter-header"><span>Storage</span><span>{formatSize(usedBytes)} / 15 GB</span></div>
          <div className="storage-meter"><span style={{ width: `${percentUsed}%` }} /></div>
          <p>Files stay available across your booking and mentor workspaces.</p>
          <button className="storage-upgrade-button">Manage storage <ChevronRight size={14} /></button>
        </div>
      </aside>

      <div className="storage-main">
        <div className="storage-toolbar">
          <div className="storage-search"><Search size={18} /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search in Drive" aria-label="Search files" />{search && <button onClick={() => setSearch('')}><X size={15} /></button>}</div>
          <div className="storage-toolbar-actions"><button className="icon-button" aria-label="List view" onClick={() => setView('list')} data-active={view === 'list'}><List size={18} /></button><button className="icon-button" aria-label="Grid view" onClick={() => setView('grid')} data-active={view === 'grid'}><Grid2X2 size={17} /></button><button className="storage-avatar">SJ</button></div>
        </div>

        <div className="storage-content">
          <div className="storage-welcome"><div><p className="storage-eyebrow">YOUR WORKSPACE</p><h1>Good morning, Sarah <span>✦</span></h1><p className="storage-muted">Keep your lesson plans, project files, and creative work in one calm place.</p></div><div className="storage-quick-card"><Cloud size={22} /><div><strong>Everything synced</strong><span>Last checked just now</span></div></div></div>
          <div className="storage-actions-row"><div className="storage-breadcrumbs">{breadcrumbs.map((crumb, index) => <React.Fragment key={crumb.id || 'root'}><button onClick={() => setBreadcrumbs(current => current.slice(0, index + 1))} className={index === breadcrumbs.length - 1 ? 'current' : ''}>{crumb.name}</button>{index < breadcrumbs.length - 1 && <ChevronRight size={15} />}</React.Fragment>)}</div><div className="storage-action-buttons"><button className="outline-button" onClick={() => setModal('folder')}><FolderPlus size={16} /> New folder</button><button className="primary-button" onClick={() => fileRef.current?.click()}><Upload size={16} /> Upload <input ref={fileRef} type="file" multiple hidden onChange={uploadFiles} /></button></div></div>

          {error && <div className="storage-state storage-error">{error}<button onClick={loadItems}>Try again</button></div>}
          {loading ? <div className="storage-state"><div className="storage-spinner" /> Loading your files...</div> : !visibleItems.length ? <div className="storage-empty"><div className="storage-empty-icon"><Folder size={30} /></div><h2>{search ? 'No files found' : 'Your drive is ready'}</h2><p>{search ? 'Try a different search term.' : 'Create a folder or upload your first file to get started.'}</p><button className="primary-button" onClick={() => setModal('folder')}><FolderPlus size={16} /> Create a folder</button></div> : <div className={`storage-items ${view}`}><div className="storage-items-heading"><span>{search ? `Results for “${search}”` : 'Recent files'}</span><span>{visibleItems.length} items</span></div>{visibleItems.map(item => <div className="storage-item" key={item.id} onDoubleClick={() => item.type === 'folder' && openFolder(item)}><div className={`storage-item-icon ${item.type}`}>{iconFor(item)}</div><div className="storage-item-name"><strong>{item.name}</strong><span>{item.type === 'folder' ? 'Folder' : formatSize(item.size)}</span></div><span className="storage-item-owner">{item.owner || 'You'}</span><span className="storage-item-date">{new Date(item.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span><div className="storage-item-menu"><button className="icon-button" aria-label={`Actions for ${item.name}`} onClick={() => setMenuId(menuId === item.id ? null : item.id)}><MoreHorizontal size={18} /></button>{menuId === item.id && <div className="storage-menu"><button onClick={() => item.type === 'folder' ? openFolder(item) : null}>{item.type === 'folder' ? <><Folder size={14} /> Open</> : <><Download size={14} /> Download</>}</button><button onClick={() => { setDraftName(item.name); setModal(item); setMenuId(null); }}><Pencil size={14} /> Rename</button><button className="danger" onClick={() => deleteItem(item)}><Trash2 size={14} /> Delete</button></div>}</div></div>)}</div>}
        </div>
      </div>

      {modal && <div className="storage-modal-backdrop" onClick={() => setModal(null)}><div className="storage-modal" onClick={event => event.stopPropagation()}><div className="storage-modal-title"><div><p className="storage-eyebrow">{typeof modal === 'object' ? 'EDIT FILE' : 'NEW FOLDER'}</p><h2>{typeof modal === 'object' ? 'Rename item' : 'Create a folder'}</h2></div><button className="icon-button" onClick={() => setModal(null)}><X size={18} /></button></div><input autoFocus className="storage-modal-input" value={draftName} onChange={event => setDraftName(event.target.value)} onKeyDown={event => event.key === 'Enter' && (typeof modal === 'object' ? renameItem(modal) : createFolder())} placeholder="Folder name" /><div className="storage-modal-actions"><button className="outline-button" onClick={() => setModal(null)}>Cancel</button><button className="primary-button" onClick={() => typeof modal === 'object' ? renameItem(modal) : createFolder()}>{typeof modal === 'object' ? 'Save changes' : 'Create folder'}</button></div></div></div>}
    </section>
  );
}
