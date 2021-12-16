# whipfs - nodejs api


## End points

### Create user
```bash
post: https://whipfs.web.app/user/register
```
```json
{ 
    "firstName":"joseph",
    "lastName":"mutinda",
    "email":"Joseph@gmail.com",
    "password":"password", 
    "phoneNumber":"254741685607"
}
```

### Activate Premium
```bash
post: https://whipfs.web.app/premium/activate
```
```json
{
    "card":{
        "card_number": "5531886652142950",
        "cvv": "564",
        "expiry_month": "9",      "expiry_year": "32",
        "pin": "3310",
        "city": "San Francisco",
        "address": "333 Fremont Street, San Francisco, CA",
        "state": "California",
        "country": "US",
        "zipcode":"12345"
    }
}
```
```
follow link after payment and enter 12345 as otp
```
```json
{"Authorization":"Bearer {token}"}
```
### Get User
```bash
get: https://whipfs.web.app/user/get
```
```json
{"Authorization":"Bearer {token}"}
```

### Get Subscriptions
```bash
get: https://whipfs.web.app/premium/getsubscribers
```
```json
{"Authorization":"Bearer {token}"}
```
