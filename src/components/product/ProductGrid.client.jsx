import {useState, useRef, useEffect, useCallback} from 'react';
import {Link, flattenConnection, useUrl} from '@shopify/hydrogen';
import {Button, Grid, ProductCard} from '~/components';
import {getImageLoadingPriority} from '~/lib/const';
import {CartControl} from '../global/CartControl.client';
import {useDrawer} from '../global';
import {CartDrawer} from '../global/CartDrawer.client';
import {IconBag} from '../elements';
import CartBadge from './CartBadge';

export function ProductGrid({url, collection, title, menu}) {
  const nextButtonRef = useRef(null);
  const initialProducts = collection?.products?.nodes || [];
  const {hasNextPage, endCursor} = collection?.products?.pageInfo ?? {};
  const [products, setProducts] = useState(initialProducts);
  const [cursor, setCursor] = useState(endCursor ?? '');
  const [nextPage, setNextPage] = useState(hasNextPage);
  const [pending, setPending] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const haveProducts = initialProducts.length > 0;

  const fetchProducts = useCallback(async () => {
    setPending(true);
    const postUrl = new URL(window.location.origin + url);
    postUrl.searchParams.set('cursor', cursor);

    const response = await fetch(postUrl, {
      method: 'POST',
    });
    const {data} = await response.json();

    const newProducts = flattenConnection(
      data?.collection?.products || data?.products || [],
    );
    const {endCursor, hasNextPage} = data?.collection?.products?.pageInfo ||
      data?.products?.pageInfo || {endCursor: '', hasNextPage: false};

    setProducts([...products, ...newProducts]);
    setCursor(endCursor);
    setNextPage(hasNextPage);
    setPending(false);
  }, [cursor, url, products]);

  const handleIntersect = useCallback(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fetchProducts();
        }
      });
    },
    [fetchProducts],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: '100%',
    });

    const nextButton = nextButtonRef.current;

    if (nextButton) observer.observe(nextButton);

    return () => {
      if (nextButton) observer.unobserve(nextButton);
    };
  }, [nextButtonRef, cursor, handleIntersect]);

  if (!haveProducts) {
    return (
      <>
        <p>No products found in this collection</p>
        <Link to="/products">
          <p className="underline">Browse catalog</p>
        </Link>
      </>
    );
  }

  const productTypes = [
    ...new Set(products.map((product) => product.productType)),
  ];

  const filteredProducts = products.filter((product) => {
    const matchesType = selectedType
      ? product.productType === selectedType
      : true;
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });
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
    <>
      <div className="">
        {/* <div className="flex justify-between relative">
          <div style={{position: 'relative', marginBottom: '20px'}}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-bar"
            />
            <i
              className="fal fa-search"
              style={{position: 'relative', right: '30px'}}
            ></i>
          </div>
          <CartControl title={title} menu={menu} />
        </div> */}

        <div className="flex justify-end">
          <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
          <CartButton
            countryCode={countryCode}
            isHome={isHome}
            title={title}
            menu={menu}
            openCart={openCart}
          />
        </div>
        <div className="">
          <div>
            <div style={{position: 'relative', marginBottom: '20px'}}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-bar"
              />
              <i
                className="fal fa-search"
                style={{position: 'relative', right: '30px'}}
              ></i>
            </div>

            <Grid layout="products">
              {filteredProducts.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  loading={getImageLoadingPriority(i)}
                />
              ))}
            </Grid>

            {nextPage && (
              <div
                className="flex items-center justify-center mt-6"
                ref={nextButtonRef}
              >
                <Button
                  variant="secondary"
                  disabled={pending}
                  onClick={fetchProducts}
                  width="full"
                >
                  {pending ? 'Loading...' : 'Load more products'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
function CartButton({isHome, openCart}) {
  return (
    <button onClick={openCart} className="button-cart ">
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
