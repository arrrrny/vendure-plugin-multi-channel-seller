import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import {
  DeletionResponse,
  Permission,
} from "@vendure/common/lib/generated-types";
import { CustomFieldsObject } from "@vendure/common/lib/shared-types";
import {
  Allow,
  ChannelService,
  Ctx,
  ID,
  ListQueryOptions,
  PaginatedList,
  RelationPaths,
  Relations,
  RequestContext,
  SellerService,
  Transaction,
} from "@vendure/core";
import { ChannelSeller } from "../entities/channel-seller.entity";
import { ChannelSellerService } from "../services/channel-seller.service";
import {
  CreateChannelSellerInput,
  UpdateChannelSellerInput,
} from "../gql/generated";

@Resolver()
export class ChannelSellerResolver {
  constructor(
    private channelSellerService: ChannelSellerService,
    private sellerService: SellerService,
    private channelService: ChannelService,
  ) {}

  @Query()
  @Allow(Permission.SuperAdmin)
  async channelSeller(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID },
    @Relations(ChannelSeller) relations: RelationPaths<ChannelSeller>,
  ): Promise<ChannelSeller | null> {
    return this.channelSellerService.findOne(ctx, args.id, relations);
  }

  @Query()
  @Allow(Permission.SuperAdmin)
  async channelSellers(
    @Ctx() ctx: RequestContext,
    @Args() args: { options: ListQueryOptions<ChannelSeller> },
    @Relations(ChannelSeller) relations: RelationPaths<ChannelSeller>,
  ): Promise<PaginatedList<ChannelSeller>> {
    return this.channelSellerService.findAll(
      ctx,
      args.options || undefined,
      relations,
    );
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.SuperAdmin)
  async createChannelSeller(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: CreateChannelSellerInput },
  ): Promise<ChannelSeller> {
    const { code, sellerId, channelId, customFields } = args.input;

    const seller = await this.sellerService.findOne(ctx, sellerId);
    if (!seller) {
      throw new Error(`Seller with id ${sellerId} not found`);
    }

    const channel = await this.channelService.findOne(ctx, channelId);
    if (!channel) {
      throw new Error(`Channel with id ${channelId} not found`);
    }

    return this.channelSellerService.create(ctx, {
      code,
      sellerId,
      channelId,
      customFields,
    });
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.SuperAdmin)
  async updateChannelSeller(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: UpdateChannelSellerInput },
  ): Promise<ChannelSeller> {
    return this.channelSellerService.update(ctx, args.input);
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.SuperAdmin)
  async deleteChannelSeller(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID },
  ): Promise<DeletionResponse> {
    return this.channelSellerService.delete(ctx, args.id);
  }
}
