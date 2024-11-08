# `typescript_lambda_builder`

Prepares functions to be deployed with Terraform on AWS.

This script builds TypeScript functions and ZIPs them to be uploaded as a Lambda functions. To get started, clone this repo, add your functions and run the command `npm run build`.

The script will do the following things:

1. Go to the `/src` directory
2. Search in each folder for **handlers** (each handler file must have the HTTP method as its name and only export one handler)
3. Build the file to javascript follwing the name convetion `{folder}-{HTTP Method}`
4. Store all the generated handlers

```
./root
├── dist
│   ├── lambda-config.json
│   ├── orders-DELETE.js
│   ├── orders-GET.js
│   ├── orders-POST.js
│   ├── orders-PUT.js
│   ├── users-DELETE.js
│   ├── users-GET.js
│   ├── users-POST.js
│   └── zip
│       ├── orders-DELETE.zip
│       ├── orders-GET.zip
│       ├── orders-POST.zip
│       ├── orders-PUT.zip
│       ├── users-DELETE.zip
│       ├── users-GET.zip
│       └── users-POST.zip
└── src
    ├── orders
    │   ├── DELETE.ts
    │   ├── GET.ts
    │   ├── POST.ts
    │   └── PUT.ts
    └── users
        ├── DELETE.ts
        ├── GET.ts
        └── POST.ts
```

In this case, this is how the `lambda-config.json` file will look like

```
{
  "orders-DELETE": {
    "path": "~path/dist/orders-DELETE.js",
    "method": "DELETE"
  },
  "orders-GET": {
    "path": "~path/dist/orders-GET.js",
    "method": "GET"
  },
  "orders-POST": {
    "path": "~path/dist/orders-POST.js",
    "method": "POST"
  },
  "orders-PUT": {
    "path": "~path/dist/orders-PUT.js",
    "method": "PUT"
  },
  "users-DELETE": {
    "path": "~path/dist/users-DELETE.js",
    "method": "DELETE"
  },
  "users-GET": {
    "path": "~path/dist/users-GET.js",
    "method": "GET"
  },
  "users-POST": {
    "path": "~path/dist/users-POST.js",
    "method": "POST"
  }
}
```
