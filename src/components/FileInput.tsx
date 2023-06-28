import {type FunctionComponent, useState} from 'react';
import {useUploadThing} from "~/utils/uploadthing";
import {toast} from "react-hot-toast";
import {Group, rem, Text, useMantineTheme} from '@mantine/core';
import {IconPhoto, IconUpload, IconX} from '@tabler/icons-react';
import {Dropzone, type DropzoneProps, type FileWithPath} from '@mantine/dropzone';
import Image from "next/image";

const FileInput: FunctionComponent<Partial<DropzoneProps>> = (props) => {
    const theme = useMantineTheme();
    const [files, setFiles] = useState<FileWithPath[]>([])
    const {isUploading, startUpload} = useUploadThing('imageUploader', {
        onUploadError: err => toast.error(err.message)
    })

    return <Dropzone {...props} loading={isUploading}
                     onDrop={(files: FileWithPath[]) => setFiles(f => [...files, ...f])}>
        <Group position="center" spacing="xl" style={{minHeight: rem(220), pointerEvents: 'none'}}>
            <Dropzone.Accept>
                <IconUpload
                    size="3.2rem"
                    stroke={1.5}
                    color={theme.colors[theme.primaryColor]![theme.colorScheme === 'dark' ? 4 : 6]}
                />
            </Dropzone.Accept>
            <Dropzone.Reject>
                <IconX
                    size="3.2rem"
                    stroke={1.5}
                    color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
                />
            </Dropzone.Reject>
            <Dropzone.Idle>
                {
                    !files && <IconPhoto size="3.2rem" stroke={1.5}/>
                }
                {
                    files && files.map(file => (
                        <div key={file.path}
                             className='flex flex-row items-center justify-start py-2 px-4 border-dotted border-2 border-gray-300 my-2 rounded-lg'>
                            <Image src={URL.createObjectURL(file)} alt='' width={64} height={64}/>
                            <h2 className='mx-4'>{file.name}</h2>
                            {/*<div className='text-red-600 bg-gray-200 p-4 rounded-md hover:bg-purple-400 pointer-events-none' onClick={e=>{*/}
                            {/*    e.stopPropagation()*/}
                            {/*}}>*/}
                            {/*    <IconX/>*/}
                            {/*</div>*/}
                        </div>
                    ))
                }
            </Dropzone.Idle>

            <div className='flex flex-col space-y-2'>
                <Text size="xl" inline>
                    Drag images here or click to select files
                </Text>
                <Text size="sm" color="dimmed" inline mt={7} className='text-center'>
                    Attach as many files as you like
                </Text>
            </div>
        </Group>
    </Dropzone>
}

export default FileInput;