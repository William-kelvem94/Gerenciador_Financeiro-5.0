export declare enum AccountType {
    CHECKING = "CHECKING",
    SAVINGS = "SAVINGS",
    CREDIT_CARD = "CREDIT_CARD",
    INVESTMENT = "INVESTMENT",
    OTHER = "OTHER"
}
export declare class CreateAccountDto {
    name: string;
    type: AccountType;
    description?: string;
    bank?: string;
    accountNumber?: string;
}
