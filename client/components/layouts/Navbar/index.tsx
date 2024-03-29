import useMatches from '../../../hooks/use-matches';
import NavbarDesktop from './NavbarDesktop';
import NavbarMobile from './NavbarMobile';

const Navbar = () => {
  const smallScreens = useMatches('lg');

  return <>{smallScreens ? <NavbarMobile /> : <NavbarDesktop />}</>;
};

export default Navbar;
