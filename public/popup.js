document.addEventListener('DOMContentLoaded', () => {
    const statusEl = document.getElementById('statusMessage');

    function setStatus(msg, color) {
        statusEl.textContent = msg;
        statusEl.style.color = color || '#a0a0a0';
    }

    document.getElementById('exportBtn').addEventListener('click', async () => {
        const data = await chrome.storage.local.get(null);
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'gemini-folders-backup.json';
        a.click();
        URL.revokeObjectURL(url);
        setStatus('Exported successfully.', '#4caf50');
    });

    document.getElementById('importFile').addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            const data = JSON.parse(text);
            if (typeof data !== 'object' || Array.isArray(data)) {
                throw new Error('Expected a JSON object');
            }
            await chrome.storage.local.set(data);
            chrome.runtime.sendMessage({ action: 'foldersUpdated', folders: data.folders || [] });
            setStatus('Imported. Refresh Gemini to see changes.', '#4caf50');
        } catch {
            setStatus('Import failed: invalid JSON file.', '#e53935');
        }

        e.target.value = '';
    });
});
