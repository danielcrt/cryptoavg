import React, { useState } from 'react';
import './NavBar.scss';
import { NavLink, withRouter } from 'react-router-dom';
import useWindowDimensions from '../../helpers/useWindowDimensions'

function NavBar({ }) {
    const { width } = useWindowDimensions();
    const openedMenuClassName = 'opened--menu';

    const [showMobileLinks, setShowMobileLinks] = useState(false)

    const _closeMenu = () => {
        if (document.body.classList.contains(openedMenuClassName)) {
            document.body.classList.remove(openedMenuClassName)
        }
        setShowMobileLinks(false);
    }
    const onNavClick = () => {
        _closeMenu();
    }
    const renderLinksList = () => {
        return (
            <>
                <NavLink exact className='nav-item nav-link' activeClassName='active' to='/contact'
                    onClick={onNavClick}>
                    Contact
                    </NavLink>
            </>
        )
    }
    return null;
    return (
        <>
            <nav id='navigation'>
                <a href='#' className='menu-toggle' onClick={(e) => {
                    e.preventDefault();
                    if (document.body.classList.contains(openedMenuClassName)) {
                        document.body.classList.remove(openedMenuClassName);
                    } else {
                        document.body.classList.add(openedMenuClassName);
                    }
                    setShowMobileLinks(!showMobileLinks)
                }}>
                </a>
            </nav>
            <nav id='mobile-menu'>
                <div className={`menu-links` + (showMobileLinks ? ' opened' : '')}>
                    {renderLinksList()}
                </div>
            </nav>
        </>
    );
};

export default withRouter(NavBar);