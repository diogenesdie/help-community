import { Dropdown, DropdownProps } from 'primereact/dropdown';
import { useEffect, useState } from 'react';

export interface SelectDistrictProps extends DropdownProps {
    id: string;
    name: string;
    placeholder: string;
    city: string;
    error?: string | boolean;
    classNameField?: string;
}

export interface IDistrict {
    label: string;
    value: string;
}

const SelectDistrict = (props: SelectDistrictProps) => {
    const [districts, setDistricts] = useState<IDistrict[]>([]);

    useEffect(() => {
        if (props.city === 'TAQUARA') {
            setDistricts([
                {
                    label: 'Centro',
                    value: 'CENTRO',
                },
                {
                    label: 'Vila Nova',
                    value: 'VILA_NOVA',
                },
                {
                    label: 'Jardim do Prado',
                    value: 'JARDIM_DO_PRADO',
                },
                {
                    label: 'Ronda',
                    value: 'RONDA',
                },
                {
                    label: 'Sagrada Família',
                    value: 'SAGRADA_FAMILIA',
                },
                {
                    label: 'Ideal',
                    value: 'IDEAL',
                },
                {
                    label: 'Km 4',
                    value: 'KM4',
                },
                {
                    label: 'Eldorado',
                    value: 'ELDORADO',
                },
                {
                    label: 'Nossa Senhora de Fátima',
                    value: 'NOSSA_SENHORA_DE_FATIMA',
                },
                {
                    label: 'Recreio',
                    value: 'RECREIO',
                },
                {
                    label: 'Morro do Leôncio',
                    value: 'MORRO_DO_LEONCIO',
                },
                {
                    label: 'Empresa',
                    value: 'EMPRESA',
                },
                {
                    label: 'Tucanos',
                    value: 'TUCANOS',
                },
                {
                    label: 'Mundo Novo',
                    value: 'MUNDO_NOVO',
                },
                {
                    label: 'Medianeira',
                    value: 'MEDIANEIRA',
                },
                {
                    label: 'Santa Terezinha',
                    value: 'SANTA_TEREZINHA',
                },
                {
                    label: 'Petrópolis',
                    value: 'PETROPOLIS',
                },
                {
                    label: 'Santa Rosa',
                    value: 'SANTA_ROSA',
                },
                {
                    label: 'Fogão Gaúcho',
                    value: 'FOGAO_GAUCHO',
                },
                {
                    label: 'Cruzeiro do Sul',
                    value: 'CRUZEIRO_DO_SUL',
                },
                {
                    label: 'Picada Francesa',
                    value: 'PICADA_FRANCESA',
                },
                {
                    label: 'Morro da Cruz',
                    value: 'MORRO_DA_CRUZ',
                },
                {
                    label: 'Santa Maria',
                    value: 'SANTA_MARIA',
                }
            ]);
        } else if (props.city === 'PAROBE') {
            setDistricts([
                {
                    label: 'Centro',
                    value: 'CENTRO',
                },
                {
                    label: 'Nova Parobé',
                    value: 'NOVA_PAROBE',
                },
                {
                    label: 'Planaza',
                    value: 'PLANAZA',
                },
                {
                    label: 'Bela Vista',
                    value: 'BELA_VISTA',
                },
                {
                    label: 'Funil',
                    value: 'FUNIL',
                },
                {
                    label: 'Guarujá',
                    value: 'GUARUJA',
                },
                {
                    label: 'Alto Guarujá',
                    value: 'ALTO_GUARUJA',
                },
                {
                    label: 'Vila Mariana',
                    value: 'VILA_MARIANA',
                }
            ]);
        }
    }, [props.city]);

    return (
        <div className={`p-field ${props.classNameField}`}>
            <Dropdown
                {...props}
                id={props.id}
                name={props.name}
                options={districts}
                value={props.value}
                placeholder={props.placeholder}
                onChange={props.onChange}
            />
            {props.error && <small className="p-error">{props.error}</small>}
        </div>
    );
    }

export default SelectDistrict;