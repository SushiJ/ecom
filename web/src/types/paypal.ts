import {
  OnApproveBraintreeActions,
  CreateOrderBraintreeActions,
} from "@paypal/react-paypal-js/dist/types";

export type OnApproveActions = Pick<OnApproveBraintreeActions, "order">;

export type CreateOrderActions = Pick<CreateOrderBraintreeActions, "order">;

export type OnApproveData = {
  billingToken?: string | null;
  facilitatorAccessToken: string;
  orderID: string;
  payerID?: string | null;
  paymentID?: string | null;
  subscriptionID?: string | null;
  authCode?: string | null;
};
