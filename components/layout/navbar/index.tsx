import { getMenu } from 'lib/shopify';
import { NavbarContent } from './desktop-nav-bar';

export async function Navbar() {
    const menu = await getMenu('main-menu');

    return <NavbarContent menu={menu} />;
}
