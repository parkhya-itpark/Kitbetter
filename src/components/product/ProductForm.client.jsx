import {useEffect, useCallback, useState} from 'react';

import {
  useProductOptions,
  isBrowser,
  useUrl,
  AddToCartButton,
  Money,
  ShopPayButton,
} from '@shopify/hydrogen';

import {Heading, Text, Button, ProductOptions} from '~/components';

export function ProductForm() {
  const {pathname, search} = useUrl();
  const [params, setParams] = useState(new URLSearchParams(search));
  const [quantity, setQuantity] = useState(1); // Add state for quantity

  const {options, setSelectedOption, selectedOptions, selectedVariant} =
    useProductOptions();

  const isOutOfStock = !selectedVariant?.availableForSale || false;
  const isOnSale =
    selectedVariant?.priceV2?.amount <
      selectedVariant?.compareAtPriceV2?.amount || false;

  useEffect(() => {
    if (params || !search) return;
    setParams(new URLSearchParams(search));
  }, [params, search]);

  useEffect(() => {
    options.map(({name, values}) => {
      if (!params) return;
      const currentValue = params.get(name.toLowerCase()) || null;
      if (currentValue) {
        const matchedValue = values.filter(
          (value) => encodeURIComponent(value.toLowerCase()) === currentValue,
        );
        setSelectedOption(name, matchedValue[0]);
      } else {
        params.set(
          encodeURIComponent(name.toLowerCase()),
          encodeURIComponent(selectedOptions[name].toLowerCase()),
        ),
          window.history.replaceState(
            null,
            '',
            `${pathname}?${params.toString()}`,
          );
      }
    });
  }, []);

  const handleChange = useCallback(
    (name, value) => {
      setSelectedOption(name, value);
      if (!params) return;
      params.set(
        encodeURIComponent(name.toLowerCase()),
        encodeURIComponent(value.toLowerCase()),
      );
      if (isBrowser()) {
        window.history.replaceState(
          null,
          '',
          `${pathname}?${params.toString()}`,
        );
      }
    },
    [setSelectedOption, params, pathname],
  );

  const handleQuantityChange = (increment) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + increment));
  };

  return (
    <form className="grid gap-10">
      <div className="grid gap-4">
        {options.map(({name, values}) => {
          if (values.length === 1) {
            return null;
          }
          return (
            <div
              key={name}
              className="flex flex-col flex-wrap mb-4 gap-y-2 last:mb-0"
            >
              <Heading as="legend" size="lead" className="min-w-[4rem]">
                {name}
              </Heading>
              <div className="flex flex-wrap items-baseline gap-4">
                <ProductOptions
                  name={name}
                  handleChange={handleChange}
                  values={values}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-4">
        <Money withoutTrailingZeros data={selectedVariant.priceV2} as="span" />
        {isOnSale && (
          <Money
            withoutTrailingZeros
            data={selectedVariant.compareAtPriceV2}
            as="span"
            className="opacity-50 strike"
          />
        )}
      </div>
      <div className="grid items-stretch gap-4">
        <div className="counter-number">
          <button
            onClick={() => handleQuantityChange(-1)}
            type="button"
            disabled={quantity === 1}
          >
            -
          </button>
          <Text as="span">{quantity}</Text>
          <button onClick={() => handleQuantityChange(1)} type="button">
            +
          </button>
        </div>

        <AddToCartButton
          variantId={selectedVariant?.id}
          quantity={quantity} // Use the dynamic quantity
          accessibleAddingToCartLabel="Adding item to your cart"
          disabled={isOutOfStock}
          type="button"
          className="add-to-cart"
        >
          <Button
            width="full"
            className={isOutOfStock ? 'secondary' : 'primary1'}
            as="span"
            style={{}}
          >
            {isOutOfStock ? (
              <Text>Sold out</Text>
            ) : (
              <Text
                as="span"
                className="flex items-center justify-center gap-2"
              >
                <span>Add to Cart</span>
              </Text>
            )}
          </Button>
        </AddToCartButton>
        {/* {!isOutOfStock && <ShopPayButton variantIds={[selectedVariant.id]} />} */}
      </div>
    </form>
  );
}
