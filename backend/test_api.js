const axios = require('axios');

async function testApi() {
    try {
        const res = await axios.get('http://localhost:5000/api/ads');
        console.log(JSON.stringify(res.data, null, 2));
    } catch (err) {
        // It will fail because of Auth, but let's see if we can get a sample
        console.error(err.message);
    }
}

testApi();
