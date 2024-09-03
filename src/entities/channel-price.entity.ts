import {
  CurrencyCode,
  DeepPartial,
  HasCustomFields,
  ID,
  Money,
  ProductVariantPrice,
  VendureEntity,
} from "@vendure/core";
import { ManyToOne, Index, Column, Entity, JoinColumn } from "typeorm";
import { ChannelSeller } from "./channel-seller.entity";

export class ChannelPriceCustomFields {}

@Entity()
export class ChannelPrice extends VendureEntity implements HasCustomFields {
  constructor(input?: DeepPartial<ChannelPrice>) {
    super(input);
  }

  @Column()
  basePriceId: ID;

  @Index()
  @ManyToOne(() => ProductVariantPrice)
  @JoinColumn({ name: "basePriceId" })
  basePrice: ProductVariantPrice;

  @Column()
  channelSellerId: ID;

  @Index()
  @ManyToOne(() => ChannelSeller)
  @JoinColumn({ name: "channelSellerId" })
  channelSeller: ChannelSeller;

  @Column("varchar")
  currencyCode: CurrencyCode;

  @Money()
  price: number;

  @Column((type) => ChannelPriceCustomFields)
  customFields: ChannelPriceCustomFields;
}
