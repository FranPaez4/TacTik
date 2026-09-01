
interface ClubBadgeProps {
  badgeUrl?: string;
  clubName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showName?: boolean;
}

export default function ClubBadge({ 
  badgeUrl, 
  clubName = 'TacTik', 
  size = 'md', 
  showName = true 
}: ClubBadgeProps) {
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className="flex items-center gap-3">
      {badgeUrl ? (
        <img 
          src={badgeUrl} 
          alt={`Escudo de ${clubName}`} 
          className={`${sizeClasses[size]} object-contain drop-shadow-md`} 
        />
      ) : (
        <div className={`${sizeClasses[size]} flex items-center justify-center bg-slate-800 rounded-full border border-slate-700 shadow-inner`}>
          <span className="text-emerald-500 font-bold">🛡️</span>
        </div>
      )}
      
      {showName && (
        <span className="font-bold tracking-wider text-emerald-400 truncate">
          {clubName}
        </span>
      )}
    </div>
  );
}