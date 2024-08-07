// src/components/OrderHistory.server.jsx
import React from 'react';
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
import {Layout} from '~/components/index.server';
import {AccountOrderHistory} from './account';

export default function OrderHistory({response}) {
  response.cache(CacheNone());

  const {
    language: {isoCode: languageCode},
    country: {isoCode: countryCode},
  } = useLocalization();
  const {customerAccessToken} = useSession();

  if (!customerAccessToken) return response.redirect('/account/login');

  const {data} = useShopQuery({
    query: CUSTOMER_ORDER_HISTORY_QUERY,
    variables: {
      customerAccessToken,
      language: languageCode,
      country: countryCode,
    },
    cache: CacheNone(),
  });

  const {customer} = data;

  if (!customer) return response.redirect('/account/login');

  const orders = flattenConnection(customer?.orders) || [];

  return (
    <Layout>
      <Suspense>
        <Seo type="noindex" data={{title: 'Order History'}} />
      </Suspense>
      {orders.length > 0 ? (
        <AccountOrderHistory orders={orders} />
      ) : (
        <p>You have no orders.</p>
      )}
    </Layout>
  );
}

const CUSTOMER_ORDER_HISTORY_QUERY = gql`
  query CustomerOrderHistory(
    $customerAccessToken: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: 250, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            currentTotalPrice {
              amount
              currencyCode
            }
            lineItems(first: 2) {
              edges {
                node {
                  variant {
                    image {
                      url
                      altText
                      height
                      width
                    }
                  }
                  title
                }
              }
            }
          }
        }
      }
    }
  }
`;
