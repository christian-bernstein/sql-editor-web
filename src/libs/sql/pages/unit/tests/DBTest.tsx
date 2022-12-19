import {BC} from "../../../../../logic/BernieComponent";
import {UnitTestUtils} from "../UnitTestUtils";
import {Assembly} from "../../../../../logic/assembly/Assembly";
import {Themeable} from "../../../../../logic/style/Themeable";
import Dexie, {Table} from "dexie";
import {Flex} from "../../../../../components/lo/FlexBox";
import {Input} from "../../../../../components/lo/Input";
import React from "react";
import {v4} from "uuid";
import {Q, Queryable} from "../../../../../logic/query/Queryable";
import {QueryDisplay} from "../../../../../components/logic/QueryDisplay";
import {Group} from "../../../../../components/lo/Group";
import {percent} from "../../../../../logic/style/DimensionalMeasured";
import {Orientation} from "../../../../../logic/style/Orientation";
import {Button} from "../../../../../components/lo/Button";

export interface DBFile {
    id?: string
    src?: string,
    type?: string
}

export class FileDB extends Dexie {

    public files!: Table<DBFile>

    constructor() {
        super("FileDB");
        this.version(1).stores({
            files: "id,src,type"
        });
    }
}

export type DBTestLocalState = {
    files: Q<Array<DBFile>>
}

export class DBTest extends BC<any, any, DBTestLocalState> {

    private db: FileDB = new FileDB();

    public static test = UnitTestUtils.createTestConfig({
        name: "db-test",
        displayName: "DB test",
        element: DBTest,
        factory: Elem => <Elem/>
    });

    constructor() {
        super(undefined, undefined, {
            files: new Queryable<Array<DBFile>>({
                component: () => this,
                listeners: ["files"],
                fallback: [],
                process: (resolve, reject) => {
                    this.db.files.toArray().then(files => resolve(files));
                }
            })
        });
    }

    componentDidMount() {
        super.componentDidMount();
        this.local.state.files.query();
    }

    componentRender(p: any, s: any, l: DBTestLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Flex fw elements={[
                <Input autoFocus type={"file"} accept={"image/*"} onChange={ev => {
                    if (ev.target.files !== null) {
                        const file: File = ev.target.files[0];
                        const reader: FileReader = new FileReader();
                        reader.onload = async (event: ProgressEvent<FileReader>) => {
                            const src = event.target?.result;
                            this.db.files.add({
                                id: v4(),
                                src: src as string,
                                type: file.type
                            }).then(() => {
                                this.local.state.files.query();
                            });
                        }
                        reader.readAsDataURL(file);
                    }
                }}/>,

                this.component((local) => (
                    <QueryDisplay<Array<DBFile>> q={local.state.files} renderer={{
                        success: (q, data) => {
                            return (
                                <Flex elements={
                                    data.map(file => (
                                        <Group width={percent(100)} orientation={Orientation.VERTICAL} elements={[
                                            <img width={"100%"} src={file.src as string} alt={file.id}/>,
                                            <Button width={percent(100)} text={"delete"} onClick={() => {
                                                this.db.files.delete(file.id as string);
                                                this.local.state.files.query();
                                            }}/>
                                        ]} />
                                    ))
                                }/>
                            )
                        }
                    }}/>
                ), ...Q.allChannels("files"))
            ]}/>
        );
    }
}
