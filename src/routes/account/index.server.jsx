import {Suspense} from 'react';
import {
  CacheNone,
  flattenConnection,
  gql,
  Seo,
  useSession,
  useLocalization,
  useShopQuery,
} from '@shopify/hydrogen';

import {PRODUCT_CARD_FRAGMENT} from '~/lib/fragments';
import {
  FeaturedCollections,
  LogoutButton,
  PageHeader,
} from '~/components';
import {Layout, ProductSwimlane} from '~/components/index.server';
import {Link} from '@shopify/hydrogen';

export default function Account({response}) {
  response.cache(CacheNone());

  const {
    language: {isoCode: languageCode},
    country: {isoCode: countryCode},
  } = useLocalization();
  const {customerAccessToken} = useSession();

  if (!customerAccessToken) return response.redirect('/account/login');

  const {data} = useShopQuery({
    query: CUSTOMER_QUERY,
    variables: {
      customerAccessToken,
      language: languageCode,
      country: countryCode,
    },
    cache: CacheNone(),
  });

  const {customer, featuredCollections, featuredProducts} = data;

  if (!customer) return response.redirect('/account/login');

  const heading = customer
    ? customer.firstName
      ? `Welcome, ${customer.firstName}.`
      : `Welcome to your account.`
    : 'Account Details';

  return (
    <Layout>
      <Suspense>
        <Seo type="noindex" data={{title: 'Account details'}} />
      </Suspense>
      <PageHeader heading={heading}>
        <LogoutButton>Sign out</LogoutButton>
      <nav>
        <ul>
          <li><Link to="/account-details">Account Details</Link></li>
          <li><Link to="/order-history">Order History</Link></li>
        </ul>
      </nav>
      </PageHeader>
      {/* <FeaturedCollections
        title="Popular Collections"
        data={flattenConnection(featuredCollections)}
      />
      <ProductSwimlane data={flattenConnection(featuredProducts)} /> */}
    </Layout>
  );
}

const CUSTOMER_QUERY = gql`
  ${PRODUCT_CARD_FRAGMENT}
  query CustomerDetails(
    $customerAccessToken: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customer(customerAccessToken: $customerAccessToken) {
      firstName
      lastName
      phone
      email
    }
      featuredProducts: products(first: 12) {
        nodes {
          ...ProductCard
        }
      }
      featuredCollections: collections(first: 3, sortKey: UPDATED_AT) {
        nodes {
          id
          title
          handle
          image {
            altText
            width
            height
            url
          }
        }
      }
  }
`;
