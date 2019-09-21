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

const GET_PRODUCTS_BY_ID = gql`
  query getOrders($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Order {
        name
        email
        id
        
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
      <Query query={GET_PRODUCTS_BY_ID} variables={{ ids: store.get('ids') }}>
        {({ data, loading, error }) => {
          if (loading) { return <div>Loading…</div>; }
          if (error) { return <div>{error.message}</div>; }
          console.log(data);
          return (
            <Card>
              <ResourceList
                showHeader
                resourceName={{ singular: 'Order', plural: 'Orders' }}
                items={data.nodes}
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
                        <Stack.Item fill>
                          <h3>
                            <TextStyle variation="strong">
                              {item.name}
                            </TextStyle>
                          </h3>
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
