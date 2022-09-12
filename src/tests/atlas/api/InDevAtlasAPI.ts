import {IAtlasAPI} from "./IAtlasAPI";
import {Folder} from "../data/Folder";
import {AtlasDocument} from "../data/AtlasDocument";
import {Category} from "../data/Category";
import {IPredicate} from "./IPredicate";
import {FormDataHub} from "../../epicure/components/FormDataHub";

enum DBAddresses {
    DOCUMENTS = "documents",
    FOLDERS = "folders",
    CATEGORIES = "categories"
}

export class InDevAtlasAPI implements IAtlasAPI {

    private database: FormDataHub = new FormDataHub("InDevAtlasAPI").loadFromLocalStore();

    createDocument(data: AtlasDocument): boolean {
        try {
            const documents: Array<AtlasDocument> = this.database.get(DBAddresses.DOCUMENTS, []);
            documents.push(data);
            this.database.set(DBAddresses.DOCUMENTS, documents, true);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    createFolder(data: Folder): boolean {
        try {
            const folders: Array<Folder> = this.database.get(DBAddresses.FOLDERS, []);
            folders.push(data);
            this.database.set(DBAddresses.FOLDERS, folders, true);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    createCategory(data: Category): boolean {
        try {
            const categories: Array<Category> = this.database.get(DBAddresses.CATEGORIES, []);
            categories.push(data);
            this.database.set(DBAddresses.CATEGORIES, categories, true);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    getAllCategories(...predicates: Array<IPredicate<Category>>): Array<Category> {
        let categories: Array<Category> = this.database.get(DBAddresses.CATEGORIES, []);
        predicates.forEach(predicate => {
            categories = categories.filter(category => predicate.test(category));
        });
        return categories;
    }

    getCategory(id: string): Category {
        return this.getAllCategories({
            test(obj: Category): boolean {
                return obj.id === id;
            }
        })[0];
    }

    getAllFolders(...predicates: Array<IPredicate<Folder>>): Array<Folder> {
        let folders: Array<Folder> = this.database.get(DBAddresses.FOLDERS, []);
        predicates.forEach(predicate => {
            folders = folders.filter(folders => predicate.test(folders));
        });
        return folders;
    }

    getFolder(id: string): Folder {
        return this.getAllFolders({
            test(obj: Folder): boolean {
                return obj.id === id;
            }
        })[0];
    }

    getAllDocuments(...predicates: Array<IPredicate<AtlasDocument>>): Array<AtlasDocument> {
        let documents: Array<AtlasDocument> = this.database.get(DBAddresses.DOCUMENTS, []);
        predicates.forEach(predicate => {
            documents = documents.filter(document => predicate.test(document));
        });
        return documents;
    }

    getDocument(id: string): AtlasDocument {
        return this.getAllDocuments({
            test(obj: AtlasDocument): boolean {
                return obj.id === id;
            }
        })[0];
    }

    linkCategoryToFolder(categoryID: string, folderID: string): void {
        this.updateFolder(folderID, folder => {
            const categories = folder.categories;
            categories.push(categoryID);
            folder.categories = categories;
            return folder;
        });
    }

    linkDocumentToCategory(documentID: string, categoryID: string) {
        this.updateCategory(categoryID, category => {
            const documents = category.documents;
            documents.push(documentID);
            category.documents = documents;
            return category;
        });
    }

    updateCategory(id: string, updater: (category: Category) => Category): IAtlasAPI {
        const updated = updater(this.getCategory(id));
        let categories = this.getAllCategories();
        categories = categories.filter(category => category.id !== id);
        categories.push(updated);
        this.database.set(DBAddresses.CATEGORIES, categories, true);
        return this;
    }

    updateDocument(id: string, updater: (document: AtlasDocument) => AtlasDocument): IAtlasAPI {
        const updated = updater(this.getDocument(id));
        let documents = this.getAllDocuments();
        documents = documents.filter(document => document.id !== id);
        documents.push(updated);
        this.database.set(DBAddresses.DOCUMENTS, documents, true);
        return this;
    }

    updateFolder(id: string, updater: (folder: Folder) => Folder): IAtlasAPI {
        const updated = updater(this.getFolder(id));
        let folders = this.getAllFolders();
        folders = folders.filter(folder => folder.id !== id);
        folders.push(updated);
        this.database.set(DBAddresses.FOLDERS, folders, true);
        return this;
    }
}
