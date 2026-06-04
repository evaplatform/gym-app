export interface IPaymentInfo {
  academyId?: string; // point to academy collection
  userId?: string;
  id: string;
  monthlyFee: number;
  checkingAccount: string;
  cardHolderName: string;
  cardNumber: string; // Ideally encrypted
  expirationDate: string;
  cvv: string; // Ideally encrypted
  isFree: boolean;
}
