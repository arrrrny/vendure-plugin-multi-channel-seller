import {
  Channel,
  DeepPartial,
  HasCustomFields,
  ID,
  Seller,
  VendureEntity,
} from "@vendure/core";
import { ManyToOne, Column, Entity, JoinColumn, Index } from "typeorm";

export class ChannelSellerCustomFields {}

@Entity()
export class ChannelSeller extends VendureEntity implements HasCustomFields {
  constructor(input?: DeepPartial<ChannelSeller>) {
    super(input);
  }

  @Column()
  code: string;

  @Column()
  sellerId: ID;

  @Column()
  channelId: ID;

  @Index()
  @ManyToOne((type) => Seller)
  @JoinColumn({ name: "sellerId" })
  seller: Seller;

  @Index()
  @ManyToOne((type) => Channel)
  @JoinColumn({ name: "channelId" })
  channel: Channel;

  @Column((type) => ChannelSellerCustomFields)
  customFields: ChannelSellerCustomFields;
}
