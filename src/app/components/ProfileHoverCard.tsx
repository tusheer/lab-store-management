'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { getUserAvatar } from '@/lib/utils';
import { Prisma } from '@prisma/client';
import { AvatarFallback } from '@radix-ui/react-avatar';
import React from 'react';

interface ProfileHoverCardProps {
    user?:
        | {
              id: number;
              email: string;
              name?: string | null | undefined;
              department?: string | null | undefined;
              designation?: string | null | undefined;
              avatar?: string | null | undefined | Prisma.JsonValue;
          }
        | null
        | undefined;
    children: React.ReactNode;
}

const ProfileHoverCard: React.FC<ProfileHoverCardProps> = ({ user, children }) => {
    if (!user) {
        return <div>no user found</div>;
    }

    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <button>{children}</button>
            </HoverCardTrigger>
            <HoverCardContent>
                <div className="flex flex-col items-center gap-1.5">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={getUserAvatar(user.avatar)} />
                        <AvatarFallback className="h-16 w-16 text-xs">
                            {user.name
                                ?.split(' ')
                                .map((name: string) => name[0])
                                .join('')}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-center gap-1">
                        <h4 className="text-lg font-semibold text-gray-800">{user.name}</h4>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-sm text-gray-800">
                            <span className="font-semibold">Department: </span>
                            {user.department}
                        </p>
                        <p className="text-sm text-gray-800">
                            <span className="font-semibold">Designation: </span>
                            {user.designation}
                        </p>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
};

export default ProfileHoverCard;
