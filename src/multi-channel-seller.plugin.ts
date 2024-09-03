import { PluginCommonModule, Type, VendurePlugin } from "@vendure/core";

import { MULTI_CHANNEL_SELLER_PLUGIN_OPTIONS } from "./constants";
import { PluginInitOptions } from "./types";
import { ChannelSeller } from "./entities/channel-seller.entity";
import { ChannelPrice } from "./entities/channel-price.entity";
import { ChannelSellerService } from "./services/channel-seller.service";
import { adminApiExtensions, shopApiExtensions } from "./api/api-extensions";
import { ChannelSellerResolver } from "./api/channel-seller.resolver";
import { ChannelPriceService } from "./services/channel-price.service";
import { ChannelPriceResolver } from "./api/channel-price.resolver";
import { ProductVariantEntityResolver } from "./api/product-variant-entity.resolver";
import { ChannelEntityResolver } from "./api/channel-entity.resolver";

@VendurePlugin({
  imports: [PluginCommonModule],
  providers: [
    {
      provide: MULTI_CHANNEL_SELLER_PLUGIN_OPTIONS,
      useFactory: () => MultiChannelSellerPlugin.options,
    },
    ChannelSellerService,
    ChannelPriceService,
  ],
  configuration: (config) => {
    return config;
  },
  compatibility: "^3.0.0",
  entities: [ChannelSeller, ChannelPrice],

  shopApiExtensions: {
    schema: shopApiExtensions,
    resolvers: [ChannelEntityResolver,ProductVariantEntityResolver],
  },
  adminApiExtensions: {
    schema: adminApiExtensions,
    resolvers: [
      ChannelSellerResolver,
      ChannelEntityResolver,
      ChannelPriceResolver,
      ProductVariantEntityResolver,
    ],
  },
})
export class MultiChannelSellerPlugin {
  static options: PluginInitOptions;

  static init(options: PluginInitOptions): Type<MultiChannelSellerPlugin> {
    this.options = options;
    return MultiChannelSellerPlugin;
  }
}
