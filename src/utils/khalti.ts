import KhaltiCheckout from "khalti-checkout-web";
import {toast} from "react-hot-toast";

const config = {
    "publicKey": "test_public_key_dc74e0fd57cb46cd93832aee0a507256",
    "productIdentity": "1234567890",
    "productName": "Drogon",
    "productUrl": "http://gameofthrones.com/buy/Dragons",
    "eventHandler": {
        onSuccess() {
            console.log('success');
        },
        // onError handler is optional
        onError: (err: any) => {
            // handle errors
            if (err) {
                toast.error(err.toString())
            }
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