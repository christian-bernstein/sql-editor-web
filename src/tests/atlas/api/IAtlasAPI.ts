import {Folder} from "../data/Folder";
import {AtlasDocument} from "../data/AtlasDocument";
import {Category} from "../data/Category";
import {IPredicate} from "./IPredicate";
import {FormDataHub} from "../../epicure/components/FormDataHub";
import {AtlasDB} from "./AtlasDB";

export interface IAtlasAPI {
    getFolder(id: string): Folder;
    getDocument(id: string): AtlasDocument;
    getCategory(id: string): Category;

    deleteFolder(id: string): boolean;
    deleteCategory(id: string): boolean;
    deleteDocument(id: string): boolean;

    getAllDocuments(...predicates: Array<IPredicate<AtlasDocument>>): Array<AtlasDocument>;
    getAllFolders(...predicates: Array<IPredicate<Folder>>): Array<Folder>;
    getAllCategories(...predicates: Array<IPredicate<Category>>): Array<Category>;

    createDocument(data: AtlasDocument): boolean;
    createCategory(data: Category): boolean;
    createFolder(data: Folder): boolean;

    updateFolder(id: string, updater: (folder: Folder) => Folder): IAtlasAPI;
    updateCategory(id: string, updater: (category: Category) => Category): IAtlasAPI;
    updateDocument(id: string, updater: (document: AtlasDocument) => AtlasDocument): IAtlasAPI;

    linkCategoryToFolder(categoryID: string, folderID: string): void;
    linkDocumentToCategory(documentID: string, categoryID: string): void;

    db(): FormDataHub;
    clear(): IAtlasAPI;

    persistentDB(): AtlasDB;
}
