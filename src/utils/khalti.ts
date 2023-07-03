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

const performCheckout = (onSuccess: () => void) => new KhaltiCheckout(getConfig(onSuccess));
export const showCheckout = (amount: number, onSuccess: () => void) => performCheckout(onSuccess).show({amount})
