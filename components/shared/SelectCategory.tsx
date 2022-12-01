import { Dropdown, DropdownProps } from 'primereact/dropdown';

export interface SelectCategoryProps extends DropdownProps {
    id: string;
    name: string;
    placeholder: string;
    error?: string | boolean;
    classNameField?: string;
}

const SelectCategory = (props: SelectCategoryProps) => {
    const categories = [
        {
            label: 'Traffic lights',
            value: 'TRAFFIC_LIGHTS',
        },
        {
            label: 'Roads',
            value: 'ROADS',
        },
        {
            label: 'Potholes',
            value: 'POTHOLES',
        },
        {
            label: 'Garbage',
            value: 'GARBAGE',
        },
        {
            label: 'Street lights',
            value: 'STREET_LIGHTS',
        },
        {
            label: 'Trees',
            value: 'TREES',
        },
        {
            label: 'Other',
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