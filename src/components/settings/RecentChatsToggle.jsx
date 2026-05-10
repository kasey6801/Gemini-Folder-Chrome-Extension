import { Switch } from 'antd';
import { useStorage } from '../../hooks/useStorage';

export default function RecentChatsToggle() {
  const [show, setShow] = useStorage('showRecentChats', true);
  return (
    <div className="settings-row recent-chats-toggle">
      <span>Show Recent Chats</span>
      <Switch checked={!!show} onChange={setShow} />
    </div>
  );
}
