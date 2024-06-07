import { generateRandomUid } from '@/lib/utils';
import { generateReactHelpers } from '@uploadthing/react/hooks';
import { useEffect, useMemo, useState } from 'react';

const { useUploadThing } = generateReactHelpers();

// Separate File and FileWithType for clarity
export interface IFileWithType {
    key: string;
    url: string;
    uid: string;
}

export type IFile = File | IFileWithType;

interface IUseFileUploadProps {
    endpoint: string;
    previousUploadedFiles: IFile[];
    multiple?: boolean;
    onChange?: (files: IFile[]) => void;
}

export interface IUseImageUploadReturn {
    files: IFileWithType[];
    onUpload: (_files?: IFile[]) => Promise<Omit<IFileWithType, 'uid'>[]>;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    clear: () => void;
    onRemove: (index: number) => void;
    setFiles: (files: File[]) => void;
}

const useFileUpload = ({
    previousUploadedFiles,
    multiple = true,
    onChange,
    endpoint,
}: IUseFileUploadProps): IUseImageUploadReturn => {
    const [files, setFiles] = useState<IFile[]>([]);

    useEffect(() => {
        if (previousUploadedFiles.length) {
            setFiles([...previousUploadedFiles]);
        }
    }, [previousUploadedFiles]);

    const clear = () => {
        setFiles([]);
    };

    const { startUpload } = useUploadThing(endpoint, {
        onClientUploadComplete: (file) => {
            // return file;
        },
    });

    const onUpload = async (_files: IFile[] = []): Promise<Omit<IFileWithType, 'uid'>[]> => {
        const selectedFiles = _files.length ? _files : files;

        if (!selectedFiles.length) return [];

        const previousUploadedFiles = selectedFiles.filter((file) => 'url' in file) as IFileWithType[];
        const permittedFiles: IFile[] = [];

        selectedFiles.map(async (file) => {
            if ('lastModified' in file) {
                permittedFiles.push(file);
            }
        });

        const response = (await startUpload(permittedFiles as File[])) || [];

        return [...previousUploadedFiles, ...response];
    };

    const handleOnChange = ({ currentTarget: input }: React.ChangeEvent<HTMLInputElement>) => {
        if (input.files === null) return;

        const newFiles = Array.from(input.files) as IFile[];

        setFiles(multiple ? [...files, ...newFiles] : newFiles);
        onChange && onChange(multiple ? [...files, ...newFiles] : newFiles);
    };

    const onRemove = (index: number) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);
        onChange && onChange(updatedFiles);
    };

    const _setFiles = (files: File[]) => {
        setFiles(files);
    };

    const generateUrl = (file: IFile): IFileWithType => {
        if ('lastModified' in file) {
            const url = URL.createObjectURL(file);
            return {
                url,
                key: file.name,
                uid: generateRandomUid(),
            };
        } else {
            return {
                url: file.url,
                key: file.key,
                uid: file.uid,
            };
        }
    };

    const generatedSelectFilesTypeAndUrl = useMemo(() => files.map(generateUrl), [files]);

    return {
        files: generatedSelectFilesTypeAndUrl,
        onUpload,
        clear,
        onChange: handleOnChange,
        onRemove,
        setFiles: _setFiles,
    };
};

export default useFileUpload;
