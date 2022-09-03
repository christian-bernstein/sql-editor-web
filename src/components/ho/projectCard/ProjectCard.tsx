import {BernieComponent} from "../../../logic/BernieComponent";
import {ProjectInfoData} from "../../../logic/data/ProjectInfoData";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Themeable} from "../../../logic/style/Themeable";
import {Box} from "../../lo/Box";
import {AF} from "../../logic/ArrayFragment";
import {ReactComponent as ProjectIcon} from "../../../assets/icons/ic-20/ic20-book.svg";
import {Flex} from "../../lo/FlexBox";
import {Icon} from "../../lo/Icon";
import {px} from "../../../logic/style/DimensionalMeasured";
import {Text} from "../../lo/Text";
import {Link} from "../../lo/Link";

export type ProjectCardProps = {
    data: ProjectInfoData
}

export class ProjectCard extends BernieComponent<ProjectCardProps, any, any> {

    init() {
        super.init();
        this.headerAssembly();
    }

    private headerAssembly() {
        this.assembly.assembly("header", theme => {
            return (
                <Flex children={
                    <AF elements={[
                        <Icon size={px(16)} icon={<ProjectIcon/>}/>,
                        <Text text={this.props.data.title} fontSize={px(14)}/>,
                    ]}/>
                }/>
            );
        });
    }

    componentRender(p: ProjectCardProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Box children={
                <AF elements={[
                    this.a("header")
                ]}/>
            }/>
        );
    }
}
