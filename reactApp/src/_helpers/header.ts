export const AuthorizationHeader = () => {
    var token = localStorage.getItem('token');
    var httpHeaders;

    httpHeaders = { 
        'Content-Type' : 'application/json', 
        'Authorization' : `Bearer ${token}`
    };

    return httpHeaders;
}

export default AuthorizationHeader
