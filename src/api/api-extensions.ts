import gql from "graphql-tag";

const channelSellerShopApiExtensions = gql`
  type ChannelSeller implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    code: String!
    sellerId: ID!
    channelId: ID!
    seller: Seller!
    channel: Channel!
  }

  type ChannelSellerList implements PaginatedList {
    items: [ChannelSeller!]!
    totalItems: Int!
  }

  # Generated at run-time by Vendure
  input ChannelSellerListOptions

  extend type Query {
    channelSeller(id: ID!): ChannelSeller
    channelSellers(options: ChannelSellerListOptions): ChannelSellerList!
  }

  extend type Channel {
    sellers: [Seller!]!
  }
`;

const channelSellerAdminApiExtensions = gql`
  input CreateChannelSellerInput {
    code: String!
    sellerId: ID!
    channelId: ID!
  }

  input UpdateChannelSellerInput {
    id: ID!
    code: String
    sellerId: ID
    channelId: ID
  }

  extend type Mutation {
    createChannelSeller(input: CreateChannelSellerInput!): ChannelSeller!
    updateChannelSeller(input: UpdateChannelSellerInput!): ChannelSeller!
    deleteChannelSeller(id: ID!): DeletionResponse!
  }
`;
const channelPriceShopApiExtensions = gql`
  type ChannelPrice implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    basePriceId: ID!
    channelSellerId: ID!
    currencyCode: CurrencyCode!
    channelSeller: ChannelSeller!
    price: Money!
  }

  type ChannelPriceList implements PaginatedList {
    items: [ChannelPrice!]!
    totalItems: Int!
  }

  # Generated at run-time by Vendure
  input ChannelPriceListOptions

  extend type Query {
    channelPrice(id: ID!): ChannelPrice
    channelPrices(options: ChannelPriceListOptions): ChannelPriceList!
  }

  extend type ProductVariant {
    channelPrices: [ChannelPrice!]
    allChannelPrices: [ChannelPrice!]
  }
`;
const channelPriceAdminApiExtensions = gql`
  input CreateChannelPriceInput {
    basePriceId: ID
    channelSellerId: ID
    currencyCode: CurrencyCode
    price: Money
  }

  input UpdateChannelPriceInput {
    id: ID!
    basePriceId: ID
    channelSellerId: ID
    currencyCode: CurrencyCode
    price: Money
  }

  extend type Mutation {
    createChannelPrice(input: CreateChannelPriceInput!): ChannelPrice!
    updateChannelPrice(input: UpdateChannelPriceInput!): ChannelPrice!
    deleteChannelPrice(id: ID!): DeletionResponse!
  }
`;

export const adminApiExtensions = gql`
  ${channelSellerShopApiExtensions}
  ${channelSellerAdminApiExtensions}
  ${channelPriceShopApiExtensions}
  ${channelPriceAdminApiExtensions}
`;

export const shopApiExtensions = gql`
  ${channelPriceShopApiExtensions}
  ${channelSellerShopApiExtensions}
`;
