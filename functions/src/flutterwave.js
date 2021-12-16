const { config } = require("firebase-functions");
const env = config()
const axios = require('axios')
const uuid = require("uuid")

//perform payment using by entering card details in the flutterwave webpage 
exports.activatePayment = async (user) => {
    const body = {
        "tx_ref": uuid.v4(),
        "amount": "20",
        "currency": "USD",
        "redirect_url": "https://65d1-154-152-168-104.ngrok.io/callbacks/paymentReceived",
        "payment_options": "card",
        "payment_plan": "16316",
        "customer": {
            "email": user.email,
            "phonenumber": user.phonenumber,
            "name": user.firstName + ' ' + user.lastName
        },
        "customizations": {
            "title": "Youe monthly 20USD premium subscription",
            "description": "Activate your USD 20 subscription",
            "logo": "https://schoolappfs.web.app/images/my%20logo.png"
        }
    }
    const options = {
        headers: {
            Authorization: `Bearer ${env.flutterwave.key}`
        }
    }
    console.log(options)
    console.log(body)
    try {
        const response = await axios.post('https://api.flutterwave.com/v3/payments', body, options)
        return response.data

    } catch (error) {
        console.log(error)
        throw new Error("cant pay")
    }
}

//perform flutterwave card payment by providing actual card details

exports.activatePayment2 = async (user, card) => {
    let body = {
        amount: 20,
        currency: 'USD',
        card_number: card.card_number,
        cvv: card.cvv,
        expiry_month: card.expiry_month,
        expiry_year: card.expiry_year,
        email: user.email,
        tx_ref: uuid.v4(),
        payment_plan: "16316",
        phone_number: user.phonenumber,
        fullname: user.firstName + ' ' + user.lastName,
        preauthorize: false,
        redirect_url: 'https://whipfs.web.app/callbacks/paymentReceived',
        client_ip: '154.123.220.1',
        device_fingerprint: '62wd23423rq324323qew1',
        meta: { flightID: '123949494DC', sideNote: 'This is a side note to track this call' },
        authorization: {
            mode: 'pin',
            pin: card.pin,
            city: card.city,
            address: card.address,
            state: card.state,
            country: card.country,
            zipcode: card.zipcode
        }
    }
    const client = this.encrypt(env.flutterwave.enc_key, JSON.stringify(body))
    body = { client }

    const options = {
        headers: {
            Authorization: `Bearer ${env.flutterwave.key}`
        }
    }

    console.log(options)
    console.log(body)
    try {
        const response = await axios.post('https://api.flutterwave.com/v3/charges?type=card', body, options)
        return response.data

    } catch (error) {
        console.log(error.response.data)
        throw new Error(error.response.data.message)
    }

}

//3DES encryption

exports.encrypt = (key, text) => {
    console.log('key...',key)
    var forge = require("node-forge");
    var cipher = forge.cipher.createCipher(
        "3DES-ECB",
        forge.util.createBuffer(key)
    );
    cipher.start({ iv: "" });
    cipher.update(forge.util.createBuffer(text, "utf-8"));
    cipher.finish();
    var encrypted = cipher.output;
    return forge.util.encode64(encrypted.getBytes());
}

//create a payment plan

const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(env.flutterwave.public, env.flutterwave.key);
exports.createPaymentPlan = async (name) => {
    try {
        const payload = {
            "amount": 20,
            "name": name,
            "interval": "monthly",
            "duration": 24
        }
        const response = await flw.PaymentPlan.create(payload)
        console.log(response);
        return response
    } catch (error) {
        console.log(error.response.data)
        throw new Error("cannot create a payment plan")
    }
}

// activate a plan
exports.activateSubscription = async (id) => {
    try {
        const payload = {
            "id": id
        }
        const response = await flw.Subscription.activate(payload)
        return response
    } catch (error) {
        console.log(error)
        throw new Error("cannot activate payment subscription")
    }

}

//get all subscriptions

exports.allSubscriptions = async () => {
    try {
        const response = await flw.Subscription.fetch_all()
        console.log(response)
        return response
    } catch (error) {
        console.log(error)
        throw new Error("cannot get subscriptions")
    }

}

//get all transactions

module.exports.getTransactions = async () => {
    const date = new Date()
    try {
        const payload = {
            "from": date.getFullYear + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
            "to": date.getFullYear + '-' + (date.getMonth() + 1) + '-' + date.getDate() + 1
        }
        const response = await flw.Transaction.fetch(payload)
        return response
    } catch (error) {
        console.log(error)
        throw new Error("cannot get transactions")
    }

}