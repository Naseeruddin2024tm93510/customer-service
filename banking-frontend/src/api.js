import axios from 'axios';

// Create independent axios instances for each microservice
// Currently, we only have Customer Service running on 8081
// In the future, you can add accountServiceApi, transactionServiceApi, etc.

export const customerServiceApi = axios.create({
    baseURL: 'http://localhost:9090/api/v1/customers',
    headers: {
        'Content-Type': 'application/json',
    }
});

// Example future service APIs to demonstrate architecture:
/*
export const accountServiceApi = axios.create({
    baseURL: 'http://localhost:8082/api/v1/accounts',
});

export const transactionServiceApi = axios.create({
    baseURL: 'http://localhost:8083/api/v1/transactions',
});
*/
