import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import {
  Card,
  ResourceList,
  Stack,
  TextStyle,
  Thumbnail,
} from '@shopify/polaris';
import store from 'store-js';
import { Redirect } from '@shopify/app-bridge/actions';
import { Context } from '@shopify/app-bridge-react';

// const GET_PRODUCTS_BY_ID = gql`
//   query getOrders($ids: [ID!]!) {
//     nodes(ids: $ids) {
//       ... on Order {
//         name
//         email
//         id
        
//       }
//     }
//   }
// `;

const GET_PRODUCTS_BY_ID = gql`
              query {
                orders(first: 3) {
                  edges {
                    cursor
                    node {
                      id
                      name
                      email
                  

                    }
                  }
                  pageInfo {
                    hasNextPage
                  }
                }
              }
`;

class ResourceListWithProducts extends React.Component {
  static contextType = Context;

  render() {
    const app = this.context;
    const redirectToProduct = () => {
      const redirect = Redirect.create(app);
      redirect.dispatch(
        Redirect.Action.APP,
        '/edit-products',
      );
    };

    const twoWeeksFromNow = new Date(Date.now() + 12096e5).toDateString();
    return (
      <Query query={GET_PRODUCTS_BY_ID} >
        {({ data, loading, error }) => {
          if (loading) { return <div>Loading…</div>; }
          if (error) { return <div>{error.message}</div>; }
          console.log(data);
          return (
            <Card>
              <ResourceList
                showHeader
                resourceName={{ singular: 'Order', plural: 'Orders' }}
                items={data.orders.edges}
                renderItem={(item) => {
                
                 
                  return (
                    <ResourceList.Item
                      id={item.id}
                      accessibilityLabel={`View details for ${item.title}`}
                      onClick={() => {
                        store.set('item', item);
                        redirectToProduct();
                      }
                      }
                    >
                      <Stack>
                        <Stack.Item>
                          <h3>
                            <TextStyle variation="strong">
                              {item.node.name}
                            </TextStyle>
                          </h3>
                        </Stack.Item>
                       <Stack.Item fill>
                          <p>Aug 13 at 06:08 am</p>
                        </Stack.Item>
                        <Stack.Item fill>
                        <p>sherry wu</p>
                        </Stack.Item>
                        <Stack.Item>
                        <p>Paid</p>
                        </Stack.Item>
                        <Stack.Item>
                        <p>Unfulfilled</p>
                        </Stack.Item>
                        <Stack.Item>
                        <p>$4.90</p>
                        </Stack.Item>
                      </Stack>
                    </ResourceList.Item>
                  );
                }}
              />
            </Card>
          );
        }}
      </Query>
    );
  }
}

export default ResourceListWithProducts;
