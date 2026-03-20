"use client";

import { useState, useEffect, useCallback } from "react";
import AvatarStack from "./AvatarStack";

interface MockUser {
  name: string;
  initials: string;
  color: string;
  statuses: string[];
  online: boolean;
}

const MOCK_USERS: MockUser[] = [
  {
    name: "Sarah Chen",
    initials: "SC",
    color: "bg-indigo-500",
    statuses: ["Generating a post", "Browsing templates", "Editing a draft", "Reviewing analytics"],
    online: true,
  },
  {
    name: "Alex Rivera",
    initials: "AR",
    color: "bg-emerald-500",
    statuses: ["Browsing templates", "Adjusting tone", "Generating hooks", "Idle"],
    online: true,
  },
  {
    name: "Jordan Lee",
    initials: "JL",
    color: "bg-amber-500",
    statuses: ["Reviewing analytics", "Generating a post", "Idle", "Browsing templates"],
    online: true,
  },
  {
    name: "Maya Patel",
    initials: "MP",
    color: "bg-pink-500",
    statuses: ["Editing a draft", "Generating hashtags", "Idle", "Generating a post"],
    online: false,
  },
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function CollabPresence() {
  const [users, setUsers] = useState(() =>
    MOCK_USERS.map((u) => ({
      name: u.name,
      initials: u.initials,
      color: u.color,
      status: u.statuses[0],
      online: u.online,
    }))
  );

  const refreshStates = useCallback(() => {
    setUsers(
      MOCK_USERS.map((u) => ({
        name: u.name,
        initials: u.initials,
        color: u.color,
        status: pickRandom(u.statuses),
        online: Math.random() > 0.2, // 80% chance online
      }))
    );
  }, []);

  // Refresh mock states every 30s
  useEffect(() => {
    const interval = setInterval(refreshStates, 30000);
    return () => clearInterval(interval);
  }, [refreshStates]);

  const onlineCount = users.filter((u) => u.online).length;

  return (
    <div className="collab-presence flex items-center gap-3">
      <AvatarStack users={users} maxVisible={4} />
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-emerald-400 presence-pulse" aria-hidden="true" />
        <span className="text-[10px] text-zinc-500 font-medium">
          {onlineCount} online
        </span>
      </div>
    </div>
  );
}
