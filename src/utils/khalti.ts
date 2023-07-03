import KhaltiCheckout from "khalti-checkout-web";

const config = {
    "publicKey": "test_public_key_1afd1d2aa7cb409e9a89df9e83c10741",
    "productIdentity": "1234567890",
    "productName": "Drogon",
    "productUrl": "http://gameofthrones.com/buy/Dragons",
    "eventHandler": {
        onSuccess() {
            console.log('success');
        },
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
};

export const checkout = new KhaltiCheckout(config);