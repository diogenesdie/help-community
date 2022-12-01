import { useAuthenticate } from "@/hooks/authenticate-hook";
import Image from "next/image";
import Link from "next/link";
import { PanelMenu } from "primereact/panelmenu";
import { classNames } from "primereact/utils";
import logo from '@/public/images/logo-help-community-primary.png';
import { useCallback, useMemo } from "react";
import { Button } from "primereact/button";
import { logout } from "@/services/authenticate-service";

export interface SidebarProps {
    currentMenu?: string | null | undefined;
}
export interface SidebarMenuItem {
    key: string;
    label: string;
    icon?: string;
    url?: string;
    template?: Function;
    command?: (e: any) => void;
    visible?: boolean;
    items?: Array<SidebarMenuItem>;
}

const Sidebar = (props: SidebarProps): JSX.Element => {
    const { session, showDialog } = useAuthenticate();

    const getItemTemplate = useCallback((item: SidebarMenuItem): JSX.Element => { 
        return (
            <Link 
                href={item.url || ''} 
                className={classNames(
                    "p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 transition-duration-150 transition-colors w-full no-underline",
                    props.currentMenu === item.key ? "surface-100" : "hover:surface-100"
                )}                  
                onClick={item.command}      
            >
                <i className={classNames('pi mr-2', item.icon)}></i> <span className="font-medium">{item.label}</span>
            </Link>
        )
    }, [props.currentMenu]);

    let items: Array<SidebarMenuItem> = useMemo<Array<SidebarMenuItem>>(() => {
        let items: Array<SidebarMenuItem> = [];

        items.push({
            key: 'HOME',
            label: 'Home',
            icon: 'pi-home',
            url: '/',
            visible: true,
            template: getItemTemplate
        });

        if( session?.user ) {
            items.push({
                key: 'LOGOUT',
                label: 'Logout',
                icon: 'pi-sign-out',
                url: '',
                visible: true,
                template: getItemTemplate,
                command: async (e) => {
                    e.preventDefault();
                    try {
                        await logout();
                    } catch (error: any) {
                        showDialog({
                            title: 'Error',
                            message: error.message,
                            button_text: 'Ok',
                            type: 'error'
                        });
                    }
                    window.location.reload();
                }
            });
        } else {
            items.push({
                key: 'LOGIN',
                label: 'Login',
                icon: 'pi-sign-in',
                url: '/login',
                visible: true,
                template: getItemTemplate
            });
        }
        return items;

    }, [
        getItemTemplate, 
        session,
        showDialog
    ]);

    return (
        <div 
            className="surface-section h-full lg:h-auto hidden lg:block flex-shrink-0 absolute lg:static left-0 top-0 z-1 border-right-1 surface-border select-none"
            style={{ width: "240px" }}
        >
            <div className="flex flex-column h-full">
                <div className="flex align-items-center justify-content-center mt-3">
                    <Image src={logo} alt="Help Communnity" width={180} />
                </div>
                <div className="overflow-y-auto">
                    <ul className="list-none p-3 m-0">
                        <PanelMenu model={items as any} />
                    </ul>
                </div>
            </div>
        </div>
    );
};
export default Sidebar;