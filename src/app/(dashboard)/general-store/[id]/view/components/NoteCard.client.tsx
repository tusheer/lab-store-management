import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Separator } from '@/components/ui/separator';
import { getUserAvatar } from '@/lib/utils';
import { format } from 'date-fns';
import { getGeneralStoreNotes } from '../action';

type NoteCardProps = {
    data: NonNullable<Awaited<ReturnType<typeof getGeneralStoreNotes>>>;
};

const NoteCard: React.FC<NoteCardProps> = ({ data }) => {
    return (
        <Card>
            <CardContent>
                {data.map(({ id, images, note, createdAt, user }, index) => (
                    <>
                        <div key={id} className="rounded-lg bg-white py-3.5">
                            <div className="flex space-x-3">
                                <HoverCard>
                                    <HoverCardTrigger asChild>
                                        <button>
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={getUserAvatar(user?.avatar)} />
                                                <AvatarFallback className="h-7 w-7 text-xs">
                                                    {user?.name
                                                        ?.split(' ')
                                                        .map((name: string) => name[0])
                                                        .join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                        </button>
                                    </HoverCardTrigger>
                                    <HoverCardContent>
                                        <div className="flex flex-col items-center gap-1.5">
                                            <Avatar className="h-16 w-16">
                                                <AvatarImage src={getUserAvatar(user?.avatar)} />
                                                <AvatarFallback className="h-16 w-16 text-xs">
                                                    {user?.name
                                                        ?.split(' ')
                                                        .map((name: string) => name[0])
                                                        .join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col items-center gap-1">
                                                <h4 className="text-lg font-semibold text-gray-800">{user?.name}</h4>
                                                <p className="text-sm text-gray-500">{user?.email}</p>
                                                <p className="text-sm text-gray-800">
                                                    <span className="font-semibold">Department: </span>
                                                    {user?.department}
                                                </p>
                                                <p className="text-sm text-gray-800">
                                                    <span className="font-semibold">Designation: </span>
                                                    {user?.designation}
                                                </p>
                                            </div>
                                        </div>
                                    </HoverCardContent>
                                </HoverCard>
                                <div>
                                    <div className="text-sm font-semibold">{user.name}</div>
                                    <div className="mt-0.5 text-sm text-gray-500">
                                        {format(new Date(createdAt), 'PP')}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2">
                                <div className="text-sm">{note}</div>
                                <div className="mt-1.5">
                                    {images.map((image) => (
                                        <div
                                            className="mt-2.5 h-40 w-40 rounded-lg border"
                                            key={(image as { key: string }).key}
                                        >
                                            <img
                                                className=" object-cover"
                                                src={(image as { url: string }).url}
                                                alt=""
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {data.length - 1 !== index && <Separator className="-mx-2 w-full" />}
                    </>
                ))}
            </CardContent>
        </Card>
    );
};

export default NoteCard;
