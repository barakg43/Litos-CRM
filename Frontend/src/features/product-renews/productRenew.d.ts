interface ProductReminderRecord extends RenewProductRecord {
  customerID: number;
  custShortName?: string;
}
interface RenewProductRecord {
  systemDetailID: number;
  productDetailDescription: string;
  notes1: string | undefined;
  notes2: string | undefined;
  notes3: string | undefined;
  notes4: string | undefined;
  price: number;
  validityTill: Date;
}
