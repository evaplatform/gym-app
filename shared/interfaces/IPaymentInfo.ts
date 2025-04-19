export interface IPaymentInfo {
    id: string;
    monthlyFee: number;
    checkingAccount: number;
    cardHolderName: string;
    cardNumber: string; // Ideally encrypted
    expirationDate: string;
    cvv: string; // Ideally encrypted
    isFree: boolean;
  }
  