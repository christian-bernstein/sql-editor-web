import {BernieComponent} from "../../sql/logic/BernieComponent";
import {Assembly} from "../../sql/logic/assembly/Assembly";
import {Themeable} from "../../sql/logic/style/Themeable";
import _ from "lodash";
import {getOr} from "../../sql/logic/Utils";
import {FlexBox} from "../../sql/components/lo/FlexBox";
import {DimensionalMeasured, percent, px} from "../../sql/logic/style/DimensionalMeasured";
import {Text, TextType} from "../../sql/components/lo/Text";
import {FormDataHub} from "./FormDataHub";
import {ObjectVisualMeaning} from "../../sql/logic/style/ObjectVisualMeaning";

export type FormElementProps = {
    height?: DimensionalMeasured,
    title: string,
    description?: string,
    id: string,
    onRawChange?: (value: any) => void,
    onDebouncedChange?: (value: any) => void,
    debounceValue?: number,
    value?: string,
    initialValue?: any,
    validate?: (value: any) => {
        valid: boolean,
        message?: string
    }
    inputGenerator: (onChange: (value: any) => void, value: any, valid: boolean, component: FormElement) => JSX.Element,
    fdh: FormDataHub
}

export type FormElementLocalState = {
    debouncedHandlerFunc: (value: any) => void,
    edited: boolean
}

export class FormElement extends BernieComponent<FormElementProps, any, FormElementLocalState> {

    constructor(props: FormElementProps) {
        super(props, undefined, {
            debouncedHandlerFunc: _.debounce((value) => {
                props.fdh.saveToLocalStore();
                props.onDebouncedChange?.(value);
            }, getOr(props.debounceValue, 300)),
            edited: false
        });
    }

    init() {
        super.init();
        if (this.value() === undefined && this.props.initialValue !== undefined) {
            this.props.fdh.set(this.props.id, this.props.initialValue);
        }
    }

    private validate(): { valid: boolean, message?: string } {
        return getOr(this.props.validate, () => {
            return {
                valid: true,
            }
        })(this.value())
    }

    private value(): string {
        return this.props.value === undefined ? this.props.fdh.get(this.props.id): this.props.value;
    }

    componentRender(p: FormElementProps, s: any, l: FormElementLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const value = this.value();
        const validate = this.validate();

        return (
            <FlexBox width={percent(100)} height={p.height} gap={t.gaps.smallGab}>
                <FlexBox width={percent(100)} height={p.height} gap={px(8)}>
                    <FlexBox width={percent(100)} gap={px(2)}>
                        <Text text={p.title} type={TextType.smallHeader} fontSize={px(14)}/>
                        {
                            p.description === undefined ? (<></>) : (
                                <Text text={p.description} type={TextType.secondaryDescription} fontSize={px(11)}/>
                            )
                        }
                    </FlexBox>

                    {
                        !this.local.state.edited ? (<></>) : (
                            validate.valid && (!validate.message === undefined) ? (<></>) : (
                                <Text text={validate.message as string} coloredText visualMeaning={ObjectVisualMeaning.ERROR} fontSize={px(12)}/>
                            )
                        )
                    }

                    {
                        p.inputGenerator(value => {
                            this.local.setState({
                                edited: true
                            });
                            this.props.fdh.set(this.props.id, value);
                            p.onRawChange?.(value);
                            l.debouncedHandlerFunc(value);
                        }, value, validate.valid, this)
                    }
                </FlexBox>
            </FlexBox>
        );
    }

}
