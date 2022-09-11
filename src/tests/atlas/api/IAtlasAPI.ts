import {Folder} from "../data/Folder";
import {AtlasDocument} from "../data/AtlasDocument";

export interface IAtlasAPI {
    getAllDocuments(): Array<AtlasDocument>;
    getDocument(id: string): AtlasDocument;
    getAllFolders(): Array<Folder>;
    createDocument(data: AtlasDocument): boolean;
    createFolder(data: Folder): boolean;
}
