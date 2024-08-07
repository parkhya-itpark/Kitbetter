// src/components/AccountDetailsPage.server.jsx
import React from 'react';
import {Suspense} from 'react';
import {CacheNone, flattenConnection, gql, Seo, useSession, useLocalization, useShopQuery} from '@shopify/hydrogen';
import {Layout} from '~/components/index.server';
import { PageHeader } from './global';
import { LogoutButton } from './elements';
import { AccountAddressBook, AccountDetails } from './account';

export default function AccountDetailsPage({response}) {
  response.cache(CacheNone());

  const {
    language: {isoCode: languageCode},
    country: {isoCode: countryCode},
  } = useLocalization();
  const {customerAccessToken} = useSession();

  if (!customerAccessToken) return response.redirect('/account/login');

  const {data} = useShopQuery({
    query: CUSTOMER_DETAILS_QUERY,
    variables: {
      customerAccessToken,
      language: languageCode,
      country: countryCode,
    },
    cache: CacheNone(),
  });

  const {customer} = data;

  if (!customer) return response.redirect('/account/login');

  const addresses = flattenConnection(customer.addresses).map((address) => ({
    ...address,
    id: address.id.substring(0, address.id.lastIndexOf('?')),
    originalId: address.id,
  }));

  const defaultAddress = customer?.defaultAddress?.id?.substring(
    0,
    customer.defaultAddress.id.lastIndexOf('?'),
  );

  const heading = customer
    ? customer.firstName
      ? `Welcome, ${customer.firstName}.`
      : `Welcome to your account.`
    : 'Account Details';

  return (
    <Layout>
      {/* <Suspense>
        <Seo type="noindex" data={{title: 'Account details'}} />
      </Suspense>
      <PageHeader heading={heading}>
        <LogoutButton>Sign out</LogoutButton>
      </PageHeader> */}
      <AccountDetails
        firstName={customer.firstName}
        lastName={customer.lastName}
        phone={customer.phone}
        email={customer.email}
      />
      <AccountAddressBook
        defaultAddress={defaultAddress}
        addresses={addresses}
      />
    </Layout>
  );
}

const CUSTOMER_DETAILS_QUERY = gql`
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
      defaultAddress {
        id
        formatted
      }
      addresses(first: 6) {
        edges {
          node {
            id
            formatted
            firstName
            lastName
            company
            address1
            address2
            country
            province
            city
            zip
            phone
          }
        }
      }
    }
  }
`;
