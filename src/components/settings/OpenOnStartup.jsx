import { Switch } from 'antd';
import { useStorage } from '../../hooks/useStorage';

export default function OpenOnStartup() {
  const [openOnStartup, setOpenOnStartup] = useStorage('isOpenOnStartup', false);
  return (
    <div className="settings-row">
      <span>Open Sidebar on Startup</span>
      <Switch checked={!!openOnStartup} onChange={setOpenOnStartup} />
    </div>
  );
}
