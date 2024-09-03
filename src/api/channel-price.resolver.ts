import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import {
  DeletionResponse,
  Permission,
} from "@vendure/common/lib/generated-types";
import { CustomFieldsObject } from "@vendure/common/lib/shared-types";
import {
  Allow,
  Ctx,
  ID,
  ListQueryOptions,
  PaginatedList,
  RelationPaths,
  Relations,
  RequestContext,
  Transaction,
} from "@vendure/core";
import { ChannelPrice } from "../entities/channel-price.entity";
import { ChannelPriceService } from "../services/channel-price.service";
import {
  CreateChannelPriceInput,
  UpdateChannelPriceInput,
} from "../gql/generated";

@Resolver()
export class ChannelPriceResolver {
  constructor(
    private channelPriceService: ChannelPriceService,
  ) {}

  @Query()
  @Allow(Permission.SuperAdmin)
  async channelPrice(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID },
    @Relations(ChannelPrice)
    relations: RelationPaths<ChannelPrice>,
  ): Promise<ChannelPrice | null> {
    return this.channelPriceService.findOne(
      ctx,
      args.id,
      relations,
    );
  }

  @Query()
  @Allow(Permission.SuperAdmin)
  async channelPrices(
    @Ctx() ctx: RequestContext,
    @Args() args: { options: ListQueryOptions<ChannelPrice> },
    @Relations(ChannelPrice)
    relations: RelationPaths<ChannelPrice>,
  ): Promise<PaginatedList<ChannelPrice>> {
    return this.channelPriceService.findAll(
      ctx,
      args.options || undefined,
      relations,
    );
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.SuperAdmin)
  async createChannelPrice(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: CreateChannelPriceInput },
  ): Promise<ChannelPrice> {
    return this.channelPriceService.create(ctx, args.input);
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.SuperAdmin)
  async updateChannelPrice(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: UpdateChannelPriceInput },
  ): Promise<ChannelPrice> {
    return this.channelPriceService.update(ctx, args.input);
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.SuperAdmin)
  async deleteChannelPrice(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID },
  ): Promise<DeletionResponse> {
    return this.channelPriceService.delete(ctx, args.id);
  }
}
