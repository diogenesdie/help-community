import { Dropdown, DropdownProps } from 'primereact/dropdown';

export interface SelectCityProps extends DropdownProps {
    id: string;
    name: string;
    placeholder: string;
    error?: string | boolean;
    classNameField?: string;
}

const SelectCity = (props: SelectCityProps) => {
    const cities = [
        {
            label: 'Taquara',
            value: 'TAQUARA',
        },
        {
            label: 'Parobé',
            value: 'PAROBE',
        }
    ]

    return (
        <div className={`p-field ${props.classNameField}`}>
            <Dropdown
                {...props}
                id={props.id}
                name={props.name}
                options={cities}
                value={props.value}
                placeholder={props.placeholder}
                onChange={props.onChange}
            />
            {props.error && <small className="p-error">{props.error}</small>}
        </div>
    );
    }

export default SelectCity;