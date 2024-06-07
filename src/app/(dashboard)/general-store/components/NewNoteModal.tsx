'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import useFileUpload from '@/hooks/useFileUpload';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { createNewStoreNote } from '../actions';
import { NoteCreateSchemaType, noteCreateSchema } from '../schema';

type NewNoteModalProps = {
    isOpen: boolean;
    onClose: () => void;
    selectedStoreId?: number;
};

const NoteAddModal: React.FC<NewNoteModalProps> = ({ isOpen, onClose, selectedStoreId }) => {
    const form = useForm<NoteCreateSchemaType>({
        defaultValues: {
            note: '',
        },
        resolver: zodResolver(noteCreateSchema),
    });

    const router = useRouter();

    const {
        files: noteFiles,
        onChange: noteOnChanage,
        onUpload: noteOnUpload,
        onRemove: noteOnRemove,
    } = useFileUpload({
        endpoint: 'imageUploader',
        previousUploadedFiles: [],
        multiple: true,
    });

    const onSubmit = async (data: NoteCreateSchemaType) => {
        try {
            if (selectedStoreId === undefined) throw new Error('Store id is not defined');

            const noteImages = await noteOnUpload();
            await createNewStoreNote(
                {
                    ...data,
                    images: noteImages.map((file) => ({ url: file.url, key: file.key })),
                },
                selectedStoreId,
                {
                    isGeneralStore: true,
                }
            );

            onClose();
            form.reset();
            router.refresh();

            toast.success('Created successful');
        } catch (error) {
            toast.error('error');
        }
    };
    return (
        <div>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add a new note</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div>
                                <FormField
                                    control={form.control}
                                    name="note"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Note</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Type your note here." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="mt-2.5">
                                <FormLabel className="mb-3 block">Images</FormLabel>
                                <Input
                                    type="file"
                                    onChange={noteOnChanage}
                                    multiple={true}
                                    accept="image/*"
                                    placeholder="Type your note here."
                                />
                            </div>
                            <div className="mt-2.5 flex flex-wrap gap-3">
                                {noteFiles.map((file, index) => (
                                    <div className="relative aspect-square h-20 w-20 rounded border" key={file.uid}>
                                        <button
                                            onClick={() => noteOnRemove(index)}
                                            className="absolute -right-2 -top-2 rounded-full border bg-gray-50 p-0.5"
                                        >
                                            <X className="h-4 w-4 text-gray-800" />
                                        </button>
                                        <img className="object-cover" src={file.url} alt="" />
                                    </div>
                                ))}
                            </div>
                            <DialogFooter className="mt-5">
                                <Button variant="outline" type="button" onClick={() => onClose()}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {form.formState.isSubmitting ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : null}
                                    Save
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default NoteAddModal;
