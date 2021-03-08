export const post = (url: any, body: any) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader(url) } as any,
        credentials: 'include' as any,
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions).then(handleResponse);
}

export const get = (url: any) => {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(url) as any
    };
    return fetch(url, requestOptions).then(handleResponse);
}


const authHeader = (url: any) => {
    var token = localStorage.getItem('token');

    if (token) {
        return { Authorization: `Bearer ${token}` };
    } else {
        return {};
    }
}

const handleResponse = (response: any) => {
    return response.text().then((text: any) => {
        const data = text && JSON.parse(text);
        
        if (!response.ok) {
            if ([401, 403].includes(response.status)) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                localStorage.clear();
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}