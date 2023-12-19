import request from '@/utils/request';

export function userLogin (data) {
    return request({
        url: "login/ajaxLogin",
        method: "post",
        data,
    });
}

export function signUpCode (data) {
    return request({
        url: "login/ajaxSendCode",
        method: "POST",
        data,
    });
}



export function registerApi (data) {
    return request({
        url: "login/ajaxAddAccount",
        method: "POST",
        data,
    });
}
