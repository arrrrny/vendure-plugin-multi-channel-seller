import { Inject, Injectable } from "@nestjs/common";
import {
  DeletionResponse,
  DeletionResult,
} from "@vendure/common/lib/generated-types";
import { ID, PaginatedList } from "@vendure/common/lib/shared-types";
import {
  CustomFieldRelationService,
  ListQueryBuilder,
  ListQueryOptions,
  RelationPaths,
  RequestContext,
  Seller,
  TransactionalConnection,
  assertFound,
  patchEntity,
} from "@vendure/core";
import { MULTI_CHANNEL_SELLER_PLUGIN_OPTIONS } from "../constants";
import { ChannelSeller } from "../entities/channel-seller.entity";
import {
  CreateChannelSellerInput,
  UpdateChannelSellerInput,
} from "../gql/generated";
import { PluginInitOptions } from "../types";

@Injectable()
export class ChannelSellerService {
  constructor(
    private connection: TransactionalConnection,
    private listQueryBuilder: ListQueryBuilder,
    private customFieldRelationService: CustomFieldRelationService,
    @Inject(MULTI_CHANNEL_SELLER_PLUGIN_OPTIONS)
    private options: PluginInitOptions,
  ) {}

  async findAll(
    ctx: RequestContext,
    options?: ListQueryOptions<ChannelSeller>,
    relations?: RelationPaths<ChannelSeller>,
  ): Promise<PaginatedList<ChannelSeller>> {
    return this.listQueryBuilder
      .build(ChannelSeller, options, {
        relations,
        ctx,
      })
      .getManyAndCount()
      .then(([items, totalItems]) => {
        return {
          items,
          totalItems,
        };
      });
  }

  findOne(
    ctx: RequestContext,
    id: ID,
    relations?: RelationPaths<ChannelSeller>,
  ): Promise<ChannelSeller | null> {
    return this.connection.getRepository(ctx, ChannelSeller).findOne({
      where: { id },
      relations,
    });
  }

  async findByChannelId(ctx: RequestContext, channelId: ID): Promise<Seller[]> {
    const channelSellers = await this.connection
      .getRepository(ctx, ChannelSeller)
      .find({
        where: { channelId },
        relations: ["seller"],
      });

    return channelSellers.map((sc) => sc.seller);
  }

  async findOneBySellerIdAndChannelId(
    ctx: RequestContext,
  ): Promise<ChannelSeller | null> {
    return this.connection.getRepository(ctx, ChannelSeller).findOne({
      where: { sellerId: ctx.channel.sellerId, channelId: ctx.channelId },
    });
  }

  async findAllByChannelId(
    ctx: RequestContext,
    channelId: ID,
    relations?: RelationPaths<ChannelSeller>,
  ): Promise<ChannelSeller[]> {
    return this.connection
      .getRepository(ctx, ChannelSeller)
      .find({ where: { channelId }, relations });
  }

  async create(
    ctx: RequestContext,
    input: CreateChannelSellerInput,
  ): Promise<ChannelSeller> {
    const channelSeller = new ChannelSeller({
      code: input.code,
      sellerId: input.sellerId,
      channelId: input.channelId,
      customFields: input.customFields,
    });

    // Save the channelSeller with attached relations
    const savedEntity = await this.connection
      .getRepository(ctx, ChannelSeller)
      .save(channelSeller);

    return assertFound(
      this.findOne(ctx, savedEntity.id, ["channel", "seller"]),
    );
  }

  async update(
    ctx: RequestContext,
    input: UpdateChannelSellerInput,
  ): Promise<ChannelSeller> {
    const entity = await this.connection.getEntityOrThrow(
      ctx,
      ChannelSeller,
      input.id,
    );
    const updatedEntity = patchEntity(entity, input);
    await this.connection
      .getRepository(ctx, ChannelSeller)
      .save(updatedEntity, { reload: false });
    await this.customFieldRelationService.updateRelations(
      ctx,
      ChannelSeller,
      input,
      updatedEntity,
    );
    return assertFound(this.findOne(ctx, updatedEntity.id));
  }

  async delete(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
    const entity = await this.connection.getEntityOrThrow(
      ctx,
      ChannelSeller,
      id,
    );
    try {
      await this.connection.getRepository(ctx, ChannelSeller).remove(entity);
      return {
        result: DeletionResult.DELETED,
      };
    } catch (e: any) {
      return {
        result: DeletionResult.NOT_DELETED,
        message: e.toString(),
      };
    }
  }
}
