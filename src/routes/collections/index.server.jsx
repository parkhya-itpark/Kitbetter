import {Suspense} from 'react';
import {useShopQuery, useLocalization, gql, Seo, Link} from '@shopify/hydrogen';

import {PageHeader, Section, Grid} from '~/components';
import {Layout, CollectionCard} from '~/components/index.server';
import {getImageLoadingPriority, PAGINATION_SIZE} from '~/lib/const';
import {PRODUCT_CARD_FRAGMENT} from '../../lib';
import {ProductGrid} from '../../components';
import Valuecollection from '../../components/global/Valuecollection';

export default function Collections() {
  return (
    <Layout>
      <Seo type="page" data={{title: 'All Collections'}} />
      {/* <PageHeader heading="Collections" /> */}
      <Section>
        <Valuecollection />
        <Suspense>
          <div className="row">
            <div className="col-sm-3">
              <CollectionGrid />
            </div>
            <div className="col-sm-9">
              <AllProductsGrid />
            </div>
          </div>
        </Suspense>
      </Section>
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

function AllProductsGrid() {
  const {
    language: {isoCode: languageCode},
    country: {isoCode: countryCode},
  } = useLocalization();

  const {data} = useShopQuery({
    query: ALL_PRODUCTS_QUERY,
    variables: {
      country: countryCode,
      language: languageCode,
      pageBy: PAGINATION_SIZE,
    },
    preload: true,
  });

  const products = data.products;

  return (
    <ProductGrid
      key="products"
      url={`/products?country=${countryCode}`}
      collection={{products}}
    />
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

const ALL_PRODUCTS_QUERY = gql`
  ${PRODUCT_CARD_FRAGMENT}
  query AllProducts(
    $country: CountryCode
    $language: LanguageCode
    $pageBy: Int!
    $cursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $pageBy, after: $cursor) {
      nodes {
        ...ProductCard
      }
      pageInfo {
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
`;
