import {IAtlasAPI} from "./IAtlasAPI";
import {Folder} from "../data/Folder";
import {AtlasDocument} from "../data/AtlasDocument";
import {v4} from "uuid";

export class InDevAtlasAPI implements IAtlasAPI {

    getDocument(id: string): AtlasDocument {
        const found = this.getAllDocuments().find(doc => doc.id === id);

        if (found === undefined) {
            throw new Error(`No document with id ${id} found.`);
        } else {
            return found;
        }
    }

    createDocument(data: AtlasDocument): boolean {
        return false;
    }

    createFolder(data: Folder): boolean {
        return false;
    }

    getAllDocuments(): Array<AtlasDocument> {
        return [
            {
                id: "1",
                title: "A document",
            }
        ];
    }

    getAllFolders(): Array<Folder> {
        return [{
            id: v4(),
            title: "A title",
            creator: "Andrea",
            creationDate: new Date(),
            note: "A quick note was written here.",
            tags: ["Development", "Test", "123"],
            description: "A description",
            categories: [
                {
                    id: v4(),
                    title: "Category 1",
                    documents: []
                },
                {
                    id: v4(),
                    title: "Category 2",
                    documents: ["1", "2"]
                }
            ]
        }, {
            id: v4(),
            title: "Great title",
            creator: "Christian",
            creationDate: new Date(),
            note: "A quick note was written here.",
            tags: ["Development", "Test", "123"],
            description: "A description",
            categories: [
                {
                    id: v4(),
                    title: "Category 1, 1",
                    documents: ["1", "2", "3"]
                },
                {
                    id: v4(),
                    title: "Category 2, 2",
                    documents: ["1", "2", "3"]
                }
            ]
        }];
    }
}
