import React, { useEffect, useState } from 'react';
import { useParams, Link } from "react-router-dom";
import MarkdownFileReader from '../components/MarkdownFileReader';

import { NOMENU_URLS } from '../settings';
import Content from "../components/Content";

const Docs = () => {
    const { file } = useParams();
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/fileList.json');
                const data = await response.json();
                setFileList(data);
            } catch (error) {
                console.error('Error fetching file list:', error);
            }
        };

        fetchData();
    }, []);

    if (file !== undefined && file !== null) {
        return (
            <Content style={{ width: "100%" }}>
                <MarkdownFileReader filePath={"/docs/" + file} />
            </Content>
        );
    } else {
        return (<Content >
            <ul>
                {fileList.map((element) => (
                    <li>
                        <Link to={NOMENU_URLS.docs + element}>{element}</Link>
                    </li>
                ))}
            </ul>
        </Content >
        )
    }

};

export default Docs;
