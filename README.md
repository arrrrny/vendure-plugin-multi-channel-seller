# Vendure Multi-Channel Seller Plugin

This plugin extends Vendure to support multiple sellers across different channels, allowing for more flexible pricing and seller management in multi-channel e-commerce setups.

## Features

- Associate sellers with specific channels
- Set custom prices for product variants per channel and seller
- Extended GraphQL API for managing channel sellers and prices
- Automatic price resolution based on the current channel and seller context

## Installation

```bash
npm install vendure-plugin-multi-channel-seller
```

## Configuration

Add the plugin to your Vendure config:

```typescript
import { MultiChannelSellerPlugin } from 'vendure-plugin-multi-channel-seller';

export const config: VendureConfig = {
  // ... other config
  plugins: [
    MultiChannelSellerPlugin,
    // ... other plugins
  ],
};
```

## Usage

### Managing Channel Sellers

Use the Admin API to create, update, and delete channel sellers:

```graphql
mutation {
  createChannelSeller(input: {
    code: "SELLER1_CHANNEL1",
    sellerId: "1",
    channelId: "1"
  }) {
    id
    code
  }
}
```

### Setting Channel Prices

Set custom prices for product variants per channel and seller:

```graphql
mutation {
  createChannelPrice(input: {
    basePriceId: "1",
    channelSellerId: "1",
    currencyCode: USD,
    price: 1999
  }) {
    id
    price
  }
}
```

### Querying Channel Sellers and Prices

Fetch channel sellers and prices using the extended API:

```graphql
query {
  channelSellers {
    items {
      id
      code
      seller {
        id
        name
      }
      channel {
        id
        code
      }
    }
  }
}
```

```graphql
query {
  productVariant(id: "1") {
    name
    price
    channelPrices {
      price
      channelSeller {
        code
      }
    }
  }
}
```

## API Extensions

This plugin extends both the Admin API and Shop API with new types and operations. Refer to the `api-extensions.ts` file for a complete list of additions.

## Customization

The plugin can be further customized by extending the provided services and resolvers. Refer to the source code for more details on the available extension points.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on the [GitHub repository](https://github.com/arrrrny/vendure-plugin-multi-channel-seller).
