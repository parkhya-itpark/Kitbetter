import {useUrl} from '@shopify/hydrogen';
import {useDrawer} from '../global';
import {CartDrawer} from '../global/CartDrawer.client';
import { CartButton } from './CartButton.client';

export function CartControl({title, menu}) {
  const {pathname} = useUrl();

  const localeMatch = /^\/([a-z]{2})(\/|$)/i.exec(pathname);
  const countryCode = localeMatch ? localeMatch[1] : undefined;

  const isHome = pathname === `/${countryCode ? countryCode + '/' : ''}`;

  const {
    isOpen: isCartOpen,
    openDrawer: openCart,
    closeDrawer: closeCart,
  } = useDrawer();

  return (
    <div className="read-box" style={{top:"50px"}}>
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      <CartButton
        countryCode={countryCode}
        isHome={isHome}
        title={title}
        menu={menu}
        openCart={openCart}
      />
    </div>
  );
}
