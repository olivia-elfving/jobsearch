import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { FiTrash2 } from 'react-icons/fi';

export default function FileHandler({ session, userId }) {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        fetchFiles();
    }, [session]);

    const changeHandler = async (e) => {
        try {
            const pdfFile = e.target.files[0];
            const { data, error } = await supabase
                .storage
                .from('pdfs')
                .upload(`${userId}/${pdfFile.name}`, pdfFile, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) {
                throw error;
            }
            
            if (data) {
                fetchFiles();
            }
        } catch (error) {
            alert(error.message);
        }
    }

    const fetchFiles = async () => {
        try {
            const { data, error } = await supabase
                .storage
                .from('pdfs')
                .list(`${userId}`, {
                    limit: 100,
                    offset: 0,
                    sortBy: { column: 'name', order: 'asc' },
                });

            if (error) {
                throw error;
            }
            
            if (data) {
                setFiles(data);
            }
        } catch (error) {
            alert(error.message);
        }
    }

    const goToFile = async (filename) => {
        try {
            const { data, error } = await supabase
                .storage
                .from('pdfs')
                .getPublicUrl(`${userId}/${filename}`)

            if (error) {
                throw error;
            }
            
            if (data) {
                window.open(data.publicURL, '_blank').focus();
            }
        } catch (error) {
            alert(error.message);
        }
    }

    const deleteFile = async (filename) => {
        try {
            const { data, error } = await supabase
                .storage
                .from('pdfs')
                .remove([`${userId}/${filename}`]);

            if (error) {
                throw error;
            }
            
            if (data) {
                fetchFiles();
            }
        } catch (error) {
            alert(error.message);
        }
    }
    
    return (
        <>
            <input type="file" name="file" onChange={changeHandler} accept="application/pdf, application/msword, .docx, .doc" />
            {files.map(file => {
                return (
                    <li key={file.id} style={{ cursor: 'pointer' }}>
                        <span onClick={() => goToFile(file.name)}>{file.name}</span> <FiTrash2 onClick={() => deleteFile(file.name)} />
                    </li>
                )
            })}
        </>
    )
}