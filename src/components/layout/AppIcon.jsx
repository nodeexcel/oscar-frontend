import appIcon from '../../assets/appicon.jpeg';

export default function AppIcon({ className = 'w-8 h-8' }) {
  return (
    <img
      src={appIcon}
      alt=""
      className={`rounded-full object-cover ${className}`}
      width={32}
      height={32}
    />
  );
}
