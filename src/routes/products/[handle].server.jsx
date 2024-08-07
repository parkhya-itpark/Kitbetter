import {Suspense} from 'react';
import {
  gql,
  Link,
  ProductOptionsProvider,
  Seo,
  ShopifyAnalyticsConstants,
  useLocalization,
  useRouteParams,
  useServerAnalytics,
  useShopQuery,
} from '@shopify/hydrogen';

import {MEDIA_FRAGMENT} from '~/lib/fragments';
import {getExcerpt} from '~/lib/utils';
import {NotFound, Layout, ProductSwimlane} from '~/components/index.server';
import {
  Heading,
  ProductDetail,
  ProductForm,
  ProductGallery,
  Section,
  Text,
} from '~/components';
import {CollectionCard} from '../../components/index.server';
import {getImageLoadingPriority, PAGINATION_SIZE} from '../../lib/const';

export default function Product() {
  const {handle} = useRouteParams();
  const {
    language: {isoCode: languageCode},
    country: {isoCode: countryCode},
  } = useLocalization();

  const {
    data: {product, shop},
  } = useShopQuery({
    query: PRODUCT_QUERY,
    variables: {country: countryCode, language: languageCode, handle},
    preload: true,
  });

  if (!product) {
    return <NotFound type="product" />;
  }

  useServerAnalytics({
    shopify: {
      pageType: ShopifyAnalyticsConstants.pageType.product,
      resourceId: product.id,
    },
  });

  const {media, title, vendor, descriptionHtml, id, metafield} = product;
  const {shippingPolicy, refundPolicy} = shop;

  return (
    <Layout>
      <Suspense>
        <Seo type="product" data={product} />
      </Suspense>
      <ProductOptionsProvider data={product}>
        <Section padding="x" className="px-0">
          <div className="row pt-100 relative">
            <div className="col-sm-3">
              <CollectionGrid />
            </div>
            <div className="col-sm-9">
              <div className="grid items-start md:gap-6 lg:gap-6 md:grid-cols-2 lg:grid-cols-3">
                <ProductGallery
                  media={media.nodes}
                  className="w-screen md:w-full lg:col-span-2"
                />
                <div className="sticky md:-mb-nav md:top-nav md:-translate-y-nav md:h-screen md:pt-nav hiddenScroll md:overflow-y-scroll">
                  <section className="flex flex-col w-full max-w-xl gap-8 p-6 md:mx-auto md:max-w-sm md:px-0">
                    <div className="grid gap-2">
                      <Heading as="h1" format className="whitespace-normal">
                        {title}
                      </Heading>
                      {vendor && (
                        <Text className={'opacity-50 font-medium'}>
                          {vendor}
                        </Text>
                      )}
                    </div>
                    <ProductForm />

                    {metafield &&
                      metafield.reference &&
                      metafield.reference.sources && (
                        <div className="mt-4">
                          <video controls>
                            {metafield.reference.sources.map(
                              (source, index) => (
                                <source
                                  key={index}
                                  src={source.url}
                                  type={source.mimeType}
                                />
                              ),
                            )}
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      )}
                  </section>
                </div>
              </div>
              <div className="grid gap-4 py-4">
                {descriptionHtml && (
                  <ProductDetail
                    title="Description"
                    content={descriptionHtml}
                  />
                )}
                {shippingPolicy?.body && (
                  <ProductDetail
                    title="Shipping"
                    content={getExcerpt(shippingPolicy.body)}
                    learnMore={`/policies/${shippingPolicy.handle}`}
                  />
                )}
                {refundPolicy?.body && (
                  <ProductDetail
                    title="Returns"
                    content={getExcerpt(refundPolicy.body)}
                    learnMore={`/policies/${refundPolicy.handle}`}
                  />
                )}
              </div>
              <div className="bad-box">
                <ProductSwimlane
                  className="p-0"
                  title="Albums you may also like"
                  data={id}
                />
              </div>
              <div className="bad-box">
                <ProductSwimlane
                  className="p-0"
                  title="More from this artist"
                  data={id}
                />
              </div>
              <div className="bad-box">
                <ProductSwimlane
                  className="p-0"
                  title="Recently viewed"
                  data={id}
                />
              </div>
            </div>
          </div>
        </Section>
      </ProductOptionsProvider>
    </Layout>
  );
}

function CollectionGrid() {
  const {
    language: {isoCode: languageCode},
    country: {isoCode: countryCode},
  } = useLocalization();

  const {data} = useShopQuery({
    query: COLLECTIONS_QUERY,
    variables: {
      pageBy: PAGINATION_SIZE,
      country: countryCode,
      language: languageCode,
    },
    preload: true,
  });

  const collections = data.collections.nodes;

  return (
    <>
      <div className="collection-length">
        <div className='mb-4'>
        <h2>All album</h2>

          <Link to="/collections" className="static-link">
            <h3 className="whitespace-pre-wrap max-w-prose font-medium text-copy">
              All
            </h3>
          </Link>
          <div items={collections.length === 3 ? 3 : 2}>
            {collections.map((collection, i) => (
              <CollectionCard
                collection={collection}
                key={collection.id}
                loading={getImageLoadingPriority(i, 2)}
              />
            ))}
          </div>
        </div>
        <div className='mb-4'>
          <h2>Event</h2>
        </div>
        <div className='mb-4'>
          <h2>Review</h2>
        </div>
        <div className='mb-4'>
          <h2>Helpdesk</h2>
          <Link to="/collections" className="static-link">
            <h3 className="whitespace-pre-wrap max-w-prose font-medium text-copy">
              Notice
            </h3>
          </Link>
          <Link to="/collections" className="static-link">
            <h3 className="whitespace-pre-wrap max-w-prose font-medium text-copy">
              FAQ
            </h3>
          </Link>
          <Link to="/collections" className="static-link">
            <h3 className="whitespace-pre-wrap max-w-prose font-medium text-copy">
              Q&A
            </h3>
          </Link>
        </div>
      </div>
    </>
  );
}

const COLLECTIONS_QUERY = gql`
  query Collections(
    $country: CountryCode
    $language: LanguageCode
    $pageBy: Int!
  ) @inContext(country: $country, language: $language) {
    collections(first: $pageBy) {
      nodes {
        id
        title
        description
        handle
        seo {
          description
          title
        }
        image {
          id
          url
          width
          height
          altText
        }
      }
    }
  }
`;

const PRODUCT_QUERY = gql`
  ${MEDIA_FRAGMENT}
  query Product(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      vendor
      descriptionHtml
      media(first: 7) {
        nodes {
          ...Media
        }
      }
      variants(first: 100) {
        nodes {
          id
          availableForSale
          selectedOptions {
            name
            value
          }
          image {
            id
            url
            altText
            width
            height
          }
          priceV2 {
            amount
            currencyCode
          }
          compareAtPriceV2 {
            amount
            currencyCode
          }
          sku
          title
          unitPrice {
            amount
            currencyCode
          }
        }
      }
      seo {
        description
        title
      }
      metafield(namespace: "custom", key: "previewaudio") {
        value
        type
        reference {
          ... on MediaImage {
            id
            image {
              url
            }
          }
          ... on Video {
            id
            sources {
              url
              mimeType
            }
          }
          ... on GenericFile {
            id
            url
          }
        }
      }
    }
    shop {
      shippingPolicy {
        body
        handle
      }
      refundPolicy {
        body
        handle
      }
    }
  }
`;
