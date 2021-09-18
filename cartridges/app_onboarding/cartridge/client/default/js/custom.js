const site = 'Sites-RefArch-Site';
const versionAPI = '21_9';
const CLIENT_ID = '30f137d7-c9b6-432d-89c6-3e5836ce9aab';
const BASE = `${window.location.protocol}//${window.location.host}/s/${site}/dw/shop/v${versionAPI}`;

// Global variables, for using request by request
let customer_id = '';
let token = '';
let basket_id = '';



document.getElementById('customerAuthCookie').onclick = async function() {
    const result = await request(`${BASE}/customers/auth`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-dw-client-id': CLIENT_ID
        },
        body: {
            'type': 'session'
        }
    }, false);

    const body = await result.json();
    token = result.headers.get('authorization');
    customer_id = body.customer_id;

    showResponse(body);
}

document.getElementById('customerAuthGuest').onclick = async function() {
    const result = await request(`${BASE}/customers/auth`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-dw-client-id': CLIENT_ID
        },
        body: {
            'type': 'guest'
        }
    }, false);

    const body = await result.json();
    token = result.headers.get('authorization');
    customer_id = body.customer_id;

    showResponse(body);
}

document.getElementById('customerAuthCredentials').onclick = async function() {
    const login = this.parentElement.previousElementSibling.children[0].value;
    const password = this.parentElement.previousElementSibling.children[1].value;

    const result = await request(`${BASE}/customers/auth`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-dw-client-id': CLIENT_ID,
            'Authorization': `Basic ${btoa(`${login}:${password}`)}`
        },
        body: {
            'type': 'credentials'
        }
    }, false);

    const body = await result.json();
    token = result.headers.get('authorization');
    customer_id = body.customer_id;

    showResponse(body);
}

document.getElementById('session').onclick = async function() {
    const result = await request(`${BASE}/sessions`, {
        method: 'POST',
        headers: {
            'Authorization': token
        }
    }, false);

    let body ='session DONE';

    try {
        body = await result.json();
    } catch (error) {}

    showResponse(body);
}

document.getElementById('refreshToken').onclick = async function() {
    const result = await request(`${BASE}/customers/auth`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
            'x-dw-client-id': CLIENT_ID
        },
        body: {
            'type': 'refresh'
        }
    }, false);

    const body = await result.json();
    token = result.headers.get('authorization');
    customer_id = body.customer_id;

    showResponse(body);
}

document.getElementById('invalidateToken').onclick = async function() {
    const result = await request(`${BASE}/customers/auth`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    }, false);

    let body = 'token invalidated';

    try {
        body = await result.json();
    } catch (error) {}

    showResponse(body);
}

document.getElementById('createBasket').onclick = async function() {
    const result = await request(`${BASE}/baskets`, {
        method: 'POST',
        headers: {
            'Authorization': token
        }
    });

    basket_id = result.basket_id;

    showResponse(result);
}

document.getElementById('getCustomerBasket').onclick = async function() {
    const result = await request(`${BASE}/customers/${customer_id}/baskets`, {
        headers: {
            'Authorization': token
        }
    });

    basket_id = result.baskets && result.baskets[0].basket_id;

    showResponse(result);
}

document.getElementById('getCustomer').onclick = async function() {
    const result = await request(`${BASE}/customers/${customer_id}`, {
        headers: {
            'Authorization': token
        }
    });

    showResponse(result);
}

document.getElementById('getCategoriesBtn').onclick = async function() {
    const category_id = this.previousElementSibling.value;
    const result = await request(`${BASE}/categories/${category_id}?levels=2`, {
        headers: {
            'Content-Type': 'application/json',
            'x-dw-client-id': CLIENT_ID
        }
    });

    showResponse(result);
}

document.getElementById('getCategoryProductsBtn').onclick = async function() {
    const category_id = this.previousElementSibling.value;
    const result = await request(`${BASE}/product_search?refine_1=cgid=${category_id}`, {
        headers: {
            'Content-Type': 'application/json',
            'x-dw-client-id': CLIENT_ID
        }
    });

    showResponse(result);
}

document.getElementById('getProduct').onclick = async function() {
    const product_id = this.previousElementSibling.value;
    const result = await request(`${BASE}/products/${product_id}`, {
        headers: {
            'Content-Type': 'application/json',
            'x-dw-client-id': CLIENT_ID
        }
    });

    showResponse(result);
}

document.getElementById('getProductVariations').onclick = async function() {
    const product_id = this.previousElementSibling.value;
    const result = await request(`${BASE}/products/${product_id}/variations`, {
        headers: {
            'Content-Type': 'application/json',
            'x-dw-client-id': CLIENT_ID
        }
    });

    showResponse(result);
}

document.getElementById('addProductToBasket').onclick = async function() {
    const product_id = this.previousElementSibling.value;
    const result = await request(`${BASE}/baskets/${basket_id}/items`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: [
            {
                'product_id': product_id,
                'quantity': 1
            }
        ]
    });

    showResponse(result);
}


// ----------------------------------------------------------------------------------


function request(url, requestData = {}, isParse = true) {
    if (requestData.body) {
        requestData.body = JSON.stringify(requestData.body);
    }

    return new Promise((resolve, reject) =>
        fetch(url, requestData)
            .then(response =>
                resolve(isParse ? response.json() : response)
            )
    );
}

// ----------------------------------------------------------------------------------

async function showResponse(body) {
    document.getElementById('content').innerHTML = JSON.stringify(body, null, '\t');
}
