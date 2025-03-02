import config from 'src/context/config';
import { CustomizerContext } from 'src/context/CustomizerContext';
import { Link } from 'react-router';
import { ReactComponent as LogoDark } from 'src/assets/images/logos/dark-logo.svg';
import { ReactComponent as LogoDarkRTL } from 'src/assets/images/logos/dark-rtl-logo.svg';
import { ReactComponent as LogoLight } from 'src/assets/images/logos/light-logo.svg';
import { ReactComponent as LogoLightRTL } from 'src/assets/images/logos/light-logo-rtl.svg';
import { IconButton, styled, useMediaQuery } from '@mui/material';
import { useContext } from 'react'
import { IconMenu2 } from '@tabler/icons-react';

const Logo = () => {
  const { isCollapse, isSidebarHover, activeDir,setIsCollapse, activeMode } = useContext(CustomizerContext);
  const TopbarHeight = config.topbarHeight;  
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  const LinkStyled = styled(Link)(() => ({
    height: TopbarHeight,
    width: isCollapse == "mini-sidebar" && !isSidebarHover ? '40px' : '180px',
    overflow: 'hidden',
    display: 'block',
  }));

  if (activeDir === 'ltr') {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: "space-between"
      }}>
        <LinkStyled to="/" style={{
          display: 'flex',
          alignItems: 'center',
        }}>
          {activeMode === 'dark' ? (
            <LogoLight />
          ) : (
            <LogoDark />
          )}
        </LinkStyled>
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={() => {
            // Toggle sidebar on both mobile and desktop based on screen size
            if (lgUp) {
              // For large screens, toggle between full-sidebar and mini-sidebar
              isCollapse === "full-sidebar" ? setIsCollapse("mini-sidebar") : setIsCollapse("full-sidebar");
            } else {
              // For smaller screens, toggle mobile sidebar
              setIsMobileSidebar(!isMobileSidebar);
            }
          }}>
          <IconMenu2 size="20" />
        </IconButton>
      </div>
    );
  }
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: "space-between"
    }}>
      <LinkStyled to="/" style={{
        display: 'flex',
        alignItems: 'center',
      }}>
        {activeMode === 'dark' ? (
          <LogoDarkRTL />
        ) : (
          <LogoLightRTL />
        )}
      </LinkStyled>
      <IconButton
        color="inherit"
        aria-label="menu"
        onClick={() => {
          // Toggle sidebar on both mobile and desktop based on screen size
          if (lgUp) {
            // For large screens, toggle between full-sidebar and mini-sidebar
            isCollapse === "full-sidebar" ? setIsCollapse("mini-sidebar") : setIsCollapse("full-sidebar");
          } else {
            // For smaller screens, toggle mobile sidebar
            setIsMobileSidebar(!isMobileSidebar);
          }
        }}>
        <IconMenu2 size="20" />
      </IconButton>
    </div>
  );
};

export default Logo;
