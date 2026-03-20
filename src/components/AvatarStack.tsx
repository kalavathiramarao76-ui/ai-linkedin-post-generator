"use client";

interface User {
  name: string;
  initials: string;
  color: string;
  status: string;
  online: boolean;
}

interface AvatarStackProps {
  users: User[];
  maxVisible?: number;
}

export default function AvatarStack({ users, maxVisible = 4 }: AvatarStackProps) {
  const visible = users.slice(0, maxVisible);
  const overflow = users.length - maxVisible;

  return (
    <div className="flex items-center -space-x-2" role="group" aria-label="Online team members">
      {visible.map((user) => (
        <div key={user.name} className="relative group">
          {/* Avatar */}
          <div
            className={`avatar-ring relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-zinc-950 text-[10px] font-bold text-white transition-transform hover:scale-110 hover:z-10 cursor-pointer ${user.color}`}
            aria-label={`${user.name}: ${user.status}`}
          >
            {user.initials}

            {/* Online dot */}
            {user.online && (
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-zinc-950 presence-pulse" aria-hidden="true" />
            )}
          </div>

          {/* Tooltip */}
          <div className="avatar-tooltip pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
            <div className="whitespace-nowrap rounded-lg bg-zinc-800 border border-white/10 px-3 py-2 text-center shadow-xl backdrop-blur-xl">
              <p className="text-xs font-medium text-white">{user.name}</p>
              <p className="text-[10px] text-zinc-400 flex items-center gap-1 justify-center mt-0.5">
                {user.online && (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" aria-hidden="true" />
                )}
                {user.status}
              </p>
            </div>
            {/* Arrow */}
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-zinc-800 border-r border-b border-white/10 rotate-45" />
          </div>
        </div>
      ))}

      {/* Overflow */}
      {overflow > 0 && (
        <div className="relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-zinc-950 bg-zinc-700 text-[10px] font-bold text-zinc-300 cursor-default">
          +{overflow}
        </div>
      )}
    </div>
  );
}
