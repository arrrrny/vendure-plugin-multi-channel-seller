import { Ctx, RequestContext, Seller } from "@vendure/core";
import { Channel } from "@vendure/core";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ChannelSeller } from "../entities/channel-seller.entity";
import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { ChannelSellerService } from "../services/channel-seller.service";

@Resolver("Channel")
export class ChannelEntityResolver {
  constructor(private channelSellerService: ChannelSellerService) {}

  @ResolveField()
  async sellers(
    @Ctx() ctx: RequestContext,
    @Parent() channel: Channel,
  ): Promise<Seller[] | undefined> {
    return this.channelSellerService.findByChannelId(ctx, channel.id);
  }
}
