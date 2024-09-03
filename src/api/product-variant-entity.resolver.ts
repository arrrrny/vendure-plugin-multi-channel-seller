import { Ctx, ID } from "@vendure/core";
import { ProductVariant } from "@vendure/core";
import { RequestContext } from "@vendure/core";
import { Args, ResolveField, Parent, Resolver } from "@nestjs/graphql";
import { ChannelPriceService } from "../services/channel-price.service";
import { ChannelSellerService } from "../services/channel-seller.service";
import { ChannelPrice } from "../entities/channel-price.entity";

@Resolver("ProductVariant")
export class ProductVariantEntityResolver {
  constructor(
    private channelPriceService: ChannelPriceService,
    private channelSellerService: ChannelSellerService,
  ) {}

  @ResolveField()
  async price(
    @Ctx() ctx: RequestContext,
    @Parent() variant: ProductVariant,
  ): Promise<number | undefined> {
    const channelSeller =
      await this.channelSellerService.findOneBySellerIdAndChannelId(ctx);
    if (!channelSeller) {
      return variant.price;
    }

    return this.channelPriceService.resolvePrice(
      ctx,
      variant.id,
      channelSeller.channelId,
      channelSeller.sellerId,
    );
  }

  @ResolveField()
  async channelPrices(
    @Ctx() ctx: RequestContext,
    @Parent() variant: ProductVariant,
  ): Promise<ChannelPrice[]> {
    return this.channelPriceService.resolvePrices(ctx);
  }

  @ResolveField()
  async allChannelPrices(
    @Ctx() ctx: RequestContext,
    @Parent() variant: ProductVariant,
  ): Promise<ChannelPrice[]> {
    return this.channelPriceService.resolveAllPrices(ctx);
  }
}
