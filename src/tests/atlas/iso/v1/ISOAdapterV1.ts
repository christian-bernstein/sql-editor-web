import {IISOAdapter} from "../IISOAdapter";
import {ISOBase} from "../ISOBase";
import {ISOInstallMethod} from "../ISOInstallMethod";
import {v4} from "uuid";
import {Folder} from "../../data/Folder";
import {AtlasMain} from "../../AtlasMain";
import {IAtlasAPI} from "../../api/IAtlasAPI";
import {Category} from "../../data/Category";
import {AtlasDocument} from "../../data/AtlasDocument";
import {AtlasDB} from "../../api/AtlasDB";
import {DBDocumentAttachment} from "../../data/DBDocumentAttachment";
import {FormDataHub} from "../../../epicure/components/FormDataHub";
import {ISOV1Data} from "./ISOV1Data";

export class ISOAdapterV1 implements IISOAdapter {

    async createISO(): Promise<ISOBase> {
        const api: IAtlasAPI = AtlasMain.atlas().api();

        // Load all data from local storage
        const db: FormDataHub = AtlasMain.atlas().api().db();
        const folders: Array<Folder> = api.getAllFolders();
        const categories: Array<Category> = api.getAllCategories();
        const documents: Array<AtlasDocument> = api.getAllDocuments();

        // Load all data from indexeddb
        const persistentDB: AtlasDB = api.persistentDB();
        const documentAttachments: Array<DBDocumentAttachment> = await persistentDB.documentAttachments.toArray();

        const v1: ISOV1Data = {
            folders: folders,
            documents: documents,
            categories: categories,
            documentAttachments: documentAttachments
        }

        return {
            timestamp: new Date().toISOString(),
            version: "v1",
            id: v4(),
            data: v1
        };
    }

    install(method: ISOInstallMethod, iso: ISOBase): void {
        const api: IAtlasAPI = AtlasMain.atlas().api();
        const data: ISOV1Data = iso.data

        function install() {
            // Install data to local store
            api.createDocument(...data.documents);
            api.createCategory(...data.categories);
            api.createFolder(...data.folders);

            // Install data to indexeddb (persistent store)
            const persistentDB: AtlasDB = api.persistentDB();
            persistentDB.documentAttachments.bulkAdd(data.documentAttachments);
        }

        switch (method) {
            case ISOInstallMethod.MERGE:
                install();
                break;
            case ISOInstallMethod.REPLACE:
                api.clear().then(() => install());
                break;
        }
    }
}
