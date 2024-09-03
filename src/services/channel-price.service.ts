import { Inject, Injectable } from "@nestjs/common";
import {
  DeletionResponse,
  DeletionResult,
} from "@vendure/common/lib/generated-types";
import {
  CustomFieldsObject,
  ID,
  PaginatedList,
} from "@vendure/common/lib/shared-types";
import {
  CustomFieldRelationService,
  ListQueryBuilder,
  ListQueryOptions,
  RelationPaths,
  RequestContext,
  TransactionalConnection,
  assertFound,
  patchEntity,
} from "@vendure/core";
import { MULTI_CHANNEL_SELLER_PLUGIN_OPTIONS } from "../constants";
import { ChannelPrice } from "../entities/channel-price.entity";
import { PluginInitOptions } from "../types";
import {
  CreateChannelPriceInput,
  UpdateChannelPriceInput,
} from "../gql/generated";

@Injectable()
export class ChannelPriceService {
  constructor(
    private connection: TransactionalConnection,
    private listQueryBuilder: ListQueryBuilder,
    private customFieldRelationService: CustomFieldRelationService,
    @Inject(MULTI_CHANNEL_SELLER_PLUGIN_OPTIONS)
    private options: PluginInitOptions,
  ) {}

  async findAll(
    ctx: RequestContext,
    options?: ListQueryOptions<ChannelPrice>,
    relations?: RelationPaths<ChannelPrice>,
  ): Promise<PaginatedList<ChannelPrice>> {
    const [items, totalItems] = await this.listQueryBuilder
      .build(ChannelPrice, options, {
        relations,
        ctx,
      })
      .getManyAndCount();
    return {
      items,
      totalItems,
    };
  }

  findOne(
    ctx: RequestContext,
    id: ID,
    relations?: RelationPaths<ChannelPrice>,
  ): Promise<ChannelPrice | null> {
    return this.connection.getRepository(ctx, ChannelPrice).findOne({
      where: { id },
      relations,
    });
  }

  async create(
    ctx: RequestContext,
    input: CreateChannelPriceInput,
  ): Promise<ChannelPrice> {
    const newEntity = new ChannelPrice(input);
    const savedEntity = await this.connection
      .getRepository(ctx, ChannelPrice)
      .save(newEntity);
    await this.customFieldRelationService.updateRelations(
      ctx,
      ChannelPrice,
      input,
      savedEntity,
    );
    return assertFound(this.findOne(ctx, savedEntity.id));
  }

  async update(
    ctx: RequestContext,
    input: UpdateChannelPriceInput,
  ): Promise<ChannelPrice> {
    const entity = await this.connection.getEntityOrThrow(
      ctx,
      ChannelPrice,
      input.id,
    );
    const updatedEntity = patchEntity(entity, input);
    await this.connection
      .getRepository(ctx, ChannelPrice)
      .save(updatedEntity, { reload: false });
    await this.customFieldRelationService.updateRelations(
      ctx,
      ChannelPrice,
      input,
      updatedEntity,
    );
    return assertFound(this.findOne(ctx, updatedEntity.id));
  }

  async delete(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
    const entity = await this.connection.getEntityOrThrow(
      ctx,
      ChannelPrice,
      id,
    );
    try {
      await this.connection.getRepository(ctx, ChannelPrice).remove(entity);
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

  async resolvePrice(
    ctx: RequestContext,
    variantId: ID,
    channelId: ID,
    sellerId: ID,
  ): Promise<number | undefined> {
    const priceExtension = await this.connection
      .getRepository(ctx, ChannelPrice)
      .findOne({
        where: {
          basePrice: { id: variantId },
          channelSeller: { channelId, sellerId },
        },
      });

    return priceExtension ? priceExtension.price : undefined;
  }

  async resolvePrices(ctx: RequestContext): Promise<ChannelPrice[]> {
    return this.connection.getRepository(ctx, ChannelPrice).find({
      where: {
        channelSeller: { channelId: ctx.channelId },
      },
      relations: [
        "channelSeller",
        "channelSeller.channel",
        "channelSeller.seller",
      ],
    });
  }

  async resolveAllPrices(ctx: RequestContext): Promise<ChannelPrice[]> {
    return this.connection.getRepository(ctx, ChannelPrice).find({
      relations: [
        "channelSeller",
        "channelSeller.channel",
        "channelSeller.seller",
      ],
    });
  }
}
