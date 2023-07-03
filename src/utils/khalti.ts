// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import KhaltiCheckout from "khalti-checkout-web";

function getConfig(onSuccess: () => void) {
    return {
        "publicKey": "test_public_key_1afd1d2aa7cb409e9a89df9e83c10741",
        "productIdentity": "1234567890",
        "productName": "Drogon",
        "productUrl": "http://gameofthrones.com/buy/Dragons",
        "eventHandler": {
            onSuccess,
            onError: (err: any) => {
                // if (err) {
                //     toast.error(err.toString())
                // }
            }
        },
        // one can set the order of payment options and also the payment options based on the order and items in the array
        paymentPreference: [
            "MOBILE_BANKING",
            "KHALTI",
            "EBANKING",
            "CONNECT_IPS",
            "SCT",
        ],
    }
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return
const performCheckout = (onSuccess: () => void) => new KhaltiCheckout(getConfig(onSuccess));
// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
export const showCheckout = (amount: number, onSuccess: () => void) => performCheckout(onSuccess).show({amount})
