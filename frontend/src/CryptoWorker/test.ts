interface Data {
    postalCodes: string[];
    country: string;
}

const data: Data = {
    postalCodes: ['123', '422'],
    country: 'PL'
}
interface GetData {
    (data: Data, key: 'postalCodes'): string[];
    (data: Data, key: 'country'): string
}

const getData: GetData = (data, key) => {
    return data[key];
}

const postalCodesRetrieved = getData(data, 'postalCodes')
const counryRetrieved = getData(data, 'country')