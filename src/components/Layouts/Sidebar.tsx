import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { toggleSidebar } from '../../store/themeConfigSlice';
import { IRootState } from '../../store';
import { useState, useEffect } from 'react';
import IconCaretsDown from '../Icon/IconCaretsDown';
import IconMenuDashboard from '../Icon/Menu/IconMenuDashboard';
import IconMenuScrumboard from '../Icon/Menu/IconMenuScrumboard';
import IconMenuInvoice from '../Icon/Menu/IconMenuInvoice';
import IconMenuCalendar from '../Icon/Menu/IconMenuCalendar';
import IconMenuUsers from '../Icon/Menu/IconMenuUsers';
import IconMenuDocumentation from '../Icon/Menu/IconMenuDocumentation';
import IconMenuContacts from '../Icon/Menu/IconMenuContacts';
import IconMenuDatatables from '../Icon/Menu/IconMenuDatatables';
import IconMenuWidgets from '../Icon/Menu/IconMenuWidgets';

const Sidebar = () => {
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const [errorSubMenu, setErrorSubMenu] = useState(false);
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const location = useLocation();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    useEffect(() => {
        console.log('use effect sidebar');
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
        }
    }, []);

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
            >
                <div className="bg-white dark:bg-black h-full">
                    <div className="flex justify-between items-center px-4 py-3">
                        <NavLink to="/" className="main-logo flex items-center shrink-0">
                            <img className="w-8 ml-[5px] flex-none" src="/assets/images/logo.svg" alt="logo" />
                            <span className="text-2xl ltr:ml-1.5 rtl:mr-1.5 font-semibold align-middle lg:inline dark:text-white-light">{t('VRISTO')}</span>
                        </NavLink>

                        <button
                            type="button"
                            className="collapse-icon w-8 h-8 rounded-full flex items-center hover:bg-gray-500/10 dark:hover:bg-dark-light/10 dark:text-white-light transition duration-300 rtl:rotate-180"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconCaretsDown className="m-auto rotate-90" />
                        </button>
                    </div>
                    <PerfectScrollbar className="h-[calc(100vh-80px)] relative">
                        <ul className="relative font-semibold space-y-0.5 p-4 py-0">
                            <li className="menu nav-item">
                                
                                <NavLink to="/" className="group">
                                    <div className="flex items-center">
                                        <IconMenuDashboard className="group-hover:!text-primary shrink-0" />
                                        <span className="ltr:pl-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">Dashboard</span>
                                    </div>
                                </NavLink>
                                <NavLink to="/schedule" className="group">
                                    <div className="flex items-center">
                                        <IconMenuCalendar className="group-hover:!text-primary shrink-0" />
                                        <span className="ltr:pl-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">Schedule</span>
                                    </div>
                                </NavLink>
                                <NavLink to="/customers" className="group">
                                    <div className="flex items-center">
                                        <IconMenuUsers className="group-hover:!text-primary shrink-0" />
                                        <span className="ltr:pl-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">Customers</span>
                                    </div>
                                </NavLink>
                                <NavLink to="/services" className="group">
                                    <div className="flex items-center">
                                        <IconMenuDocumentation className="group-hover:!text-primary shrink-0" />
                                        <span className="ltr:pl-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">Services</span>
                                    </div>
                                </NavLink>
                                <NavLink to="/invoices" className="group">
                                    <div className="flex items-center">
                                        <IconMenuDatatables className="group-hover:!text-primary shrink-0" />
                                        <span className="ltr:pl-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">Invoices</span>
                                    </div>
                                </NavLink>
                                <NavLink to="/employees" className="group">
                                    <div className="flex items-center">
                                        <IconMenuContacts className="group-hover:!text-primary shrink-0" />
                                        <span className="ltr:pl-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">Employees</span>
                                    </div>
                                </NavLink>
                                <NavLink to="/payments" className="group">
                                    <div className="flex items-center">
                                        <IconMenuInvoice className="group-hover:!text-primary shrink-0" />
                                        <span className="ltr:pl-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">Payments</span>
                                    </div>
                                </NavLink>
                                <NavLink to="/settings" className="group">
                                    <div className="flex items-center">
                                        <IconMenuWidgets className="group-hover:!text-primary shrink-0" />
                                        <span className="ltr:pl-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">Settings</span>
                                    </div>
                                </NavLink>
                               
                            </li>
                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
