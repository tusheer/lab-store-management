import { getGeneralStoreNotes } from '../action';
import NoteCard from './NoteCard.client';

type NoteCardServerProps = {
    id: number;
};

const NoteCardServer: React.FC<NoteCardServerProps> = async ({ id }) => {
    const notes = await getGeneralStoreNotes(id);

    return (
        <div className="mt-6">
            <NoteCard data={notes} />
        </div>
    );
};

export default NoteCardServer;
