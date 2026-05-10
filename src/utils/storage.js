export function get(keys) {
  return new Promise(resolve => chrome.storage.local.get(keys, resolve));
}

export function set(data) {
  return new Promise(resolve => chrome.storage.local.set(data, resolve));
}

export function getAll() {
  return new Promise(resolve => chrome.storage.local.get(null, resolve));
}

export async function getFolders() {
  const { folders = {}, folderOrder = [] } = await get(['folders', 'folderOrder']);
  return { folders, folderOrder };
}

export async function saveFolders(folders, folderOrder) {
  await set({ folders, folderOrder });
  chrome.runtime.sendMessage({ action: 'foldersUpdated', folders }).catch(() => {});
}
