import Image from "next/image";
import { useRouter } from "next/router";
import { Dropdown, DropdownProps } from "primereact/dropdown";
import FlagPT from '@/public/images/flag-pt.jpg';
import FlagEN from '@/public/images/flag-en.jpg';
import FlagES from '@/public/images/flag-es.jpg';

interface LangOption {
    label: string;
    value: 'pt' | 'en'
}
const SelectLang = (props: DropdownProps): JSX.Element => {
    const router = useRouter();

    const langs: Array<LangOption> = [
        { label: 'Português', value: 'pt' },
        { label: 'English', value: 'en' }
    ];
    const onChangeLanguage = (newLocale: LangOption['value']) => {
        const { pathname, asPath, query } = router;
        router.push({ pathname, query }, asPath, { locale: newLocale });
    }
    const diaplayLang = (option: LangOption | null | undefined): JSX.Element => {
        const local = option?.value || 'pt';
        const label = option?.label || 'Português';
        const flag = local === 'pt' ? FlagPT : local === 'en' ? FlagEN : FlagES;

        return (
            <div className="flex align-items-center gap-2" title={label}>
                <Image alt={label} src={flag} height={16} width={21} /> <strong>{local.toUpperCase()}</strong>
            </div>
        );
    }

    return (
        <Dropdown 
            {...props}
            value={router.locale || 'pt'}
            options={langs}
            onChange={(e) => onChangeLanguage(e.value)}
            valueTemplate={diaplayLang}
            itemTemplate={diaplayLang}
        />
    )
};
export default SelectLang;