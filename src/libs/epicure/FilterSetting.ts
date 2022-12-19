import {EpicureFilterPage} from "./pages/filter/EpicureFilterPage";
import {Filter} from "./pages/Filter";
import {FormDataHub} from "./components/FormDataHub";

export type FilterSetting = {
    setupRenderer: (component: EpicureFilterPage) => JSX.Element,
    filterConvertor: (component: EpicureFilterPage, hub: FormDataHub) => Filter<any>
}
