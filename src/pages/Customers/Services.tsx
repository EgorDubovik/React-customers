import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store'; 
import { setPageTitle } from '../../store/themeConfigSlice';


const Services = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Services'));
    });
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);

    const [loading] = useState(false);

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/" className="text-primary hover:underline">
                        Dashboard
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Services</span>
                </li>
            </ul>

            <div className="pt-5">
               Services
            </div>
        </div>
    );
};

export default Services;
