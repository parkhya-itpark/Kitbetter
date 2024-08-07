import {useCart} from '@shopify/hydrogen';
import React from 'react';

function CartBadge({dark}) {
  const {totalQuantity} = useCart();

  if (totalQuantity < 1) {
    return null;
  }
  return (
    <div className="cart-badge">
      <span>{totalQuantity}</span>
    </div>
  );
}

export default CartBadge;
