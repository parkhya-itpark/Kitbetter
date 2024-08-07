import {IconBag} from '~/components';
import CartBadge from '../product/CartBadge';

export function CartButton({isHome, openCart}) {
  return (
    <button onClick={openCart} className="button-cart">
      {/* <IconBag /> */}
      <svg
        width="29"
        height="32"
        viewBox="0 0 29 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.56641 9.14831H3.89113C3.37214 9.14831 2.9394 9.54534 2.89483 10.0624L1.20299 29.6866C1.15264 30.2706 1.61312 30.7725 2.1993 30.7725H26.1191C26.7052 30.7725 27.1657 30.2706 27.1154 29.6866L25.4235 10.0624C25.379 9.54534 24.9462 9.14831 24.4272 9.14831H19.752M8.56641 9.14831V3.94025C8.56641 2.83568 9.46184 1.94025 10.5664 1.94025H17.752C18.8565 1.94025 19.752 2.83568 19.752 3.94025V9.14831M8.56641 9.14831H19.752"
          stroke="white"
          stroke-opacity="0.9"
          stroke-width="2"
          stroke-linejoin="round"
        />
      </svg>
      <CartBadge dark={isHome} />
      Cart
    </button>
  );
}
