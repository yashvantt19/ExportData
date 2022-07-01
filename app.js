const express = require('express');
const app = express();
const { parse } = require('json2csv');
var json2xls = require('json2xls');
const { data } = require('./JSON');
const fs = require('fs');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

const modified_data = data.map(Object => {
    return {
        Username: Object.username,
        Email: Object.email,
        PhoneNumber: Object.phone_number,
        DateOfBirth: Object.birthdate,
        name: Object.title + ' ' + Object.first_name + ' ' + Object.last_name,
        Address: Object.location.street + ' ' + Object.location.city + Object.location.state + ' ' + Object.location.postcode
    }
});

const fields = ['Username', 'Email', 'PhoneNumber', 'DateOfBirth', 'name', 'Address'];
const opts = { fields };
console.log(opts);
const csv = parse(modified_data, opts);
fs.writeFile("userData.csv", csv, function (error) {
    if (error) throw error;
    console.log("successfully");
})

// console.log(modified_data);

let xls = json2xls(modified_data);

app.get('/', (req, res) => {
    fs.writeFileSync('userData.xlsx', xls, 'binary');
    return res.download('userData.xlsx', 'userData.xlsx');
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});