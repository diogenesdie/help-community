import { Dropdown, DropdownProps } from 'primereact/dropdown';
import { useTranslation } from "next-i18next";

export interface SelectCategoryProps extends DropdownProps {
    id: string;
    name: string;
    placeholder: string;
    error?: string | boolean;
    classNameField?: string;
}

const SelectCategory = (props: SelectCategoryProps) => {
    const { t } = useTranslation(['common', 'categorys']);

    const categories = [
        {
            label: t('categorys:TRAFFIC_LIGHTS'),
            value: 'TRAFFIC_LIGHTS',
        },
        {
            label: t('categorys:ROADS'),
            value: 'ROADS',
        },
        {
            label: t('categorys:POTHOLES'),
            value: 'POTHOLES',
        },
        {
            label: t('categorys:GARBAGE'),
            value: 'GARBAGE',
        },
        {
            label: t('categorys:STREET_LIGHTS'),
            value: 'STREET_LIGHTS',
        },
        {
            label: t('categorys:TREES'),
            value: 'TREES',
        },
        {
            label: t('categorys:OTHER'),
            value: 'OTHER',
        }
    ]

    return (
        <div className={`p-field ${props.classNameField}`}>
            <Dropdown
                {...props}
                id={props.id}
                name={props.name}
                options={categories}
                value={props.value}
                placeholder={props.placeholder}
                onChange={props.onChange}
            />
            {props.error && <small className="p-error">{props.error}</small>}
        </div>
    );
    }

export default SelectCategory;