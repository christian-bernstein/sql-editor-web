import {Editor} from "../../pages/editor/Editor";
import {SessionCommandType} from "../data/SessionCommandType";
import {App, utilizeGlobalTheme} from "../app/App";
import {ProjectInfoData} from "../data/ProjectInfoData";
import {SQLCommandQueryResponsePacketData} from "../../packets/in/SQLCommandQueryResponsePacketData";
import {ScriptResult} from "../../pages/editor/tabs/scripting/ScriptResult";
import {SimpleInputConfig} from "../../pages/editor/tabs/scripting/SimpleInputConfig";
import {Screen} from "../../components/lo/Page";
import {Box} from "../../components/lo/Box";
import {percent, px} from "../style/DimensionalMeasured";
import {Flex} from "../../components/lo/FlexBox";
import {Justify} from "../style/Justify";
import {Text, TextType} from "../../components/lo/Text";
import {Input} from "../../components/lo/Input";
import {InformationBox} from "../../components/ho/informationBox/InformationBox";
import {ObjectVisualMeaning} from "../style/ObjectVisualMeaning";
import {LiteGrid} from "../../components/lo/LiteGrid";
import {Button} from "../../components/lo/Button";
import {getOr} from "../Utils";
import {If} from "../../components/logic/If";

export class ScriptingAPI {

    private editor: Editor;

    private project: ProjectInfoData

    private _result?: ScriptResult;

    constructor(editor: Editor, project: ProjectInfoData) {
        this.editor = editor;
        this.project = project;
    }

    public push(sql: string, internal: boolean = false): ScriptingAPI {
        if (internal) {
            App.app().net().intrinsicSQLUpdate({
                packet: {
                    type: SessionCommandType.PUSH,
                    raw: sql,
                    attributes: new Map<string, string>(),
                    dbID: this.project.id
                }
            });
        } else {
            this.editor.sendCommand(SessionCommandType.PUSH, sql).then(() => {});
        }
        return this;
    }

    public pull(sql: string, internal: boolean = false): Promise<SQLCommandQueryResponsePacketData> {
        return new Promise<SQLCommandQueryResponsePacketData>((resolve, reject) => {
            if (internal) {
                App.app().net().intrinsicSQLQuery({
                    packet: {
                        type: SessionCommandType.PULL,
                        raw: sql,
                        attributes: new Map<string, string>(),
                        dbID: this.project.id
                    },
                    onCallback: data => {
                        resolve(data);
                    }
                });
            } else {
                this.editor.sendCommand(SessionCommandType.PULL, sql).then(() => {});
            }
        });
    }

    public yield(result: ScriptResult): ScriptingAPI {
        this._result = result;
        return this;
    }

    public input(config: SimpleInputConfig): Promise<string> {
        const t = utilizeGlobalTheme();
        return new Promise((resolve, reject) => {
            let value = config.defaultValue;
            this.editor._openLocalDialog(
                <Screen style={{backgroundColor: "transparent"}} deactivatePadding children={
                    <Flex height={percent(100)} justifyContent={Justify.FLEX_END}>
                        <Box borderless width={percent(100)} borderRadiiConfig={{
                            enableCustomBorderRadii: true,
                            bottomRight: px(),
                            bottomLeft: px()
                        }}>
                            <Flex>
                                <Text text={"Script-generated input"} type={TextType.smallHeader}/>
                                <InformationBox width={percent(100)} visualMeaning={ObjectVisualMeaning.WARNING} children={
                                    <Text text={"**Never** enter sensitive information into a script-generated input! This data could be exploited by the script creator!"}/>
                                }/>

                                <Flex gap={t.gaps.smallGab} width={percent(100)} margin={{top: px(50)}}>
                                    <If condition={config.title !== undefined} ifTrue={
                                        <Text text={config.title as string} type={TextType.smallHeader}/>
                                    }/>

                                    <If condition={config.description !== undefined} ifTrue={
                                        <Text text={config.description as string} type={TextType.secondaryDescription} fontSize={px(12)}/>
                                    }/>
                                    <Input defaultValue={getOr(config.defaultValue, "")} placeholder={config.placeholder} onChange={ev => {
                                        value = ev.target.value;
                                    }}/>
                                </Flex>

                                <LiteGrid gap={t.gaps.smallGab} columns={2}>
                                    <Button text={"Cancel"} onClick={() => {
                                        this.editor.closeLocalDialog();
                                        reject();
                                    }}/>
                                    <Button text={"Done"} opaque visualMeaning={ObjectVisualMeaning.SUCCESS_DEFAULT} onClick={() => {
                                        this.editor.closeLocalDialog();
                                        resolve(getOr(value, ""));
                                    }}/>
                                </LiteGrid>
                            </Flex>
                        </Box>
                    </Flex>
                }/>
            )
        });


    }

    get result(): ScriptResult | undefined {
        return this._result;
    }
}
