import axios, {
    type AxiosRequestConfig,
    type AxiosRequestHeaders,
    type AxiosResponse,
} from 'axios';

import router from '@/router';

// import Qs from 'qs';
interface ErrorMsgType {
    value: string;
    code: number;
}

interface HttpResponse<T = unknown> {
    msg: string;
    code: number;
    data: T;
    error: Array<ErrorMsgType>;
}

const showServeError = (status: number) => {
    let message = '';

    switch (status) {
        case 400:
            message = '请求错误(400)';
            break;
        case 401:
            message = '未授权，请重新登录(401)';
            break;
        case 402:
            message = '拒绝访问(402)';
            break;
        case 404:
            message = '请求出错(404)';
            break;
        case 408:
            message = '请求超时(408)';
            break;
        case 500:
            message = '服务器错误(500)';
            break;
        case 501:
            message = '服务未实现(501)';
            break;
        case 502:
            message = '网络错误(502)';
            break;
        case 503:
            message = '服务不可用(503)';
            break;
        case 504:
            message = '网络超时(504)';
            break;
        case 505:
            message = 'HTTP版本不受支持(505)';
            break;
        default:
            message = `连接出错(${status})!`;
    }

    return `${message}，请检查网络或联系管理员！`;
};

const ajax = axios.create({
    baseURL: '/api',
    withCredentials: true,
    timeout: 120000,
});

ajax.interceptors.request.use(
    (config: AxiosRequestConfig) => {
    
        if (!config.params) {
            config['params'] = {};
        }
        if (userStore.readToken && !config.params['token']) {
            // config.params['token'] = userStore.readToken;
        }
        config.params['d'] = new Date().getTime();

        config.params['token'] = userStore.userToken || '';

    

        config.transformRequest = [
            // function (data) {
            //     return Qs.stringify(data);
            // },
        ];

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

ajax.interceptors.response.use(
    (response: AxiosResponse<HttpResponse>) => {
        const status = response.status;
        const res = response.data;
        console.log(res.code)
        const userStore = useUserStore();
        if (status >= 500) {
            router.push('/500');
            return Promise.reject(new Error('服务器出错了' || 'Error'));
        }
        if (status < 200 || status >= 300) {
            const msg = showServeError(status);

            ElMessageBox.alert(msg, 'Title', {
                confirmButtonText: '好的',
            });
            return Promise.reject(new Error(msg || 'Error'));
        }

  

        if (res.code == 403) {
            userStore.logout().then(() => {
                const userState = useUserStore();
                userState.resetToken();
                router.push('/noPermission');
            });
       
        }

        if (res.code && res.code !== 0) {

            if (res.code == 302 || res.code == 301) {
                ElMessageBox.confirm(
                    '当前账号已退出登录，您可以取消停留在这个页面或者是重新登录',
                    '确认',
                    {
                        confirmButtonText: '重新登录',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }
                ).then(() => {
                    userStore.resetInfo();
                    setTimeout(function () {
                        router.push({ path: '/logout'});
                    }, 300);
                });
            } else {
                ElMessage({
                    message: res.error
                        ? res.error[0].value
                        : res.msg || 'Error',
                    type: 'error',
                    duration: 5 * 1000,
                });
            }

            return Promise.reject(res.msg || 'Error');
        }
        return res;
    },
    (error) => {
        ElMessage({
            message: error.msg,
            type: 'error',
            duration: 5 * 1000,
        });
        return Promise.reject(error);
    }
);

export default ajax;
