import React from 'react';
import MainLayout from "../../layouts/MainLayout";
import DocumentsPage from "../../components/Screens/DocumentsPage";

const DocumentsRoute: React.FC = () => {
    return (
        <MainLayout>
            <DocumentsPage />
        </MainLayout>
    );
};

export default DocumentsRoute;


