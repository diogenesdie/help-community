import Sidebar from '@/components/shared/Sidebar';

export interface PaginaPainelProps {
    children?: JSX.Element | JSX.Element[] | string | string[] | null;
    skeleton?: JSX.Element | JSX.Element[] | string | string[] | null;
    currentMenu?: string;
}

const AppWrapper = (props: PaginaPainelProps): JSX.Element => {
    return (
        <div className="min-h-screen flex justify-content-center relative w-full lg:static surface-ground">
            <div className="w-full lg:w-8 flex">
                <Sidebar currentMenu={props.currentMenu} />
                <div className="flex flex-column flex-auto p-4">
                    {props.children}
                </div>
            </div>
        </div>
    );
};
export default AppWrapper;