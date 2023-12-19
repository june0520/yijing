<template>
    <div>
        <h1 class="login_h1">密码登录</h1>
        <el-form
            ref="formRef"
            :rules="loginRules"
            :model="form"
            class="login-form"
            auto-complete="off"
            label-position="left"
        >
            <div class="form-item">
                <div class="label">
                    <img src="@/assets/imgs/icon-account.png" alt="" />
                    <span>手机号</span>
                </div>

                <el-form-item prop="mobile">
                    <el-input
                        ref="mobile"
                        v-model="form.mobile"
                        placeholder="请输入手机号"
                        name="mobile"
                    />
                </el-form-item>
                <div v-if="errorMessage.mobile.flag" class="error-tip">
                    <div class="error-tip-rel">
                        {{ errorMessage.mobile.msg }}
                    </div>
                </div>
            </div>

            <div class="form-item">
                <div class="label">
                    <img src="@/assets/imgs/icon-lock.png" alt="" />
                    <span>密&nbsp;&nbsp;&nbsp;码</span>
                </div>

                <el-form-item prop="passwd">
                    <el-input
                        ref="passwd"
                        v-model="form.passwd"
                        type="password"
                        placeholder="请输入密码"
                        name="passwd"
                        @keyup.enter.native="handleLogin(formRef)"
                    />
                </el-form-item>
                <div v-if="errorMessage.passwd.flag" class="error-tip">
                    <div class="error-tip-rel">{{ errorMessage.passwd.msg }}</div>
                </div>
            </div>

            <el-button
                class="login-btn"
                :loading="loading"
                type="primary"
                style="width: 100%"
                @click.native.prevent="handleLogin(formRef)"
            >
                登录
            </el-button>
            <div class="tip">还没有账号？<span @click="changeRegister">立即注册</span></div>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
// import { useRoute,useRouter } from "vue-router";
import type { FormInstance } from "element-plus";
// import { useUserStore } from '@/store';

// const userStore = useUserStore();

import { userLogin } from "@/api/login";
import router from "@/router";
const emit = defineEmits(['changeType']);
// const route = useRoute()
// const router = useRouter()

const formRef = ref<any>();
const form = ref<any>({
    // mobile: "18801345366",
    // passwd: "a1234567",
    mobile: "",
    passwd: "",
});
 

// 校验账号
const validateUsername = (_rule, value, callback) => {
    if (!value) {
        console.log("请输入手机号");
        errorMessage.value.mobile.flag = true;
        errorMessage.value.mobile.msg = "请输入手机号";
        callback(new Error("请输入手机号"));
    } else {
        errorMessage.value.mobile.flag = false;

        callback();
    }
};
// 校验密码
const validatePassword = (_rule, value, callback) => {
    const regPassword = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,18}$/;
    if (!value) {
        errorMessage.value.passwd.flag = true;
        errorMessage.value.passwd.msg = "请输入密码";
        callback(new Error("请输入密码"));
    } else if (!regPassword.test(value)) {
        errorMessage.value.passwd.flag = true;
        errorMessage.value.passwd.msg = "密码格式必须为 8-18位字母+数字";
        callback(new Error("密码格式必须为 8-18位字母+数字"));
    } else {
        errorMessage.value.passwd.flag = false;
        callback();
    }
};
const loginRules = ref<any>({
    mobile: [{ required: true, trigger: "blur", validator: validateUsername }],
    passwd: [{ required: true, trigger: "blur", validator: validatePassword }],
});
const loading = ref<any>(false);
const errorMessage = ref<any>({
    mobile: {
        flag: false,
        msg: "请输入手机号",
    },
    passwd: {
        flag: false,
        msg: "请输入密码",
    },
});

const handleLogin = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            loading.value = true;

            await userLogin({
                mobile: form.value.mobile,
                passwd: form.value.passwd,
                // verify: this.validate,
            })
                .then((res) => {
                    // userStore.userToken = res.data.token
                    router.push({
                        path:'/home'
                    })
                })
                .catch((error) => {
                    // ElMessage.error(error.msg);
                })
                .finally(() => {
                    loading.value = false;
                });
        } else {
            console.log("error submit!", fields);
            return false;
        }
    });
};
const changeRegister = ()=>{
    emit('changeType', 2);
}
</script>

<style lang="scss" scoped>
:deep(.el-form-item__error) {
    display: none;
}
:deep(.el-input__inner::placeholder) {
    font-size: 16px;
}

.login_h1 {
    text-align: center;
    // margin: 123px auto 40px;
    color: #333333;
    font-size: 20px;
    font-weight: 700;
    line-height: 40px;
    text-align: left;
}

.login-form {
    position: relative;
    width: 320px;
    max-width: 100%;
    margin: 0 auto;
    .form-item {
        position: relative;
        display: flex;
        height: 56px;
        border: 1px solid #dcdee0;
        margin-bottom: 20px;
        align-items: center;
        border-radius: 8px;
        padding: 0 16px;

        .label {
            display: inline-flex;
            flex:none;
            align-items: center;
            text-align: justify;
            color: #333;
            font-size: 16px;
            line-height: 24px;
            img {
                width: 24px;
                height: 24px;
                margin-right: 4px;
            }
        }
        .el-input {
            display: inline-block;

            input {
                height: 47px;
                padding: 12px 5px 12px 15px;
                background: transparent;
                border: none;
                border-radius: 0;
                appearance: none;
                font-size: 16px;
            }
            :deep(.el-input__inner) {
                border: none;
                font-size: 16px;

            }
            :deep(.el-input__wrapper) {
                box-shadow: none;
            }
        }

        .el-form-item {
            color: #454545;
            border: none;
            border-radius: 5px;
            margin-bottom: 0;
        }
        .error-tip {
            display: inline-block;
            height: 32px;
            background: #f7e3e2;
            border-radius: 4px;
            border: 1px solid #c62922;
            line-height: 32px;
            position: absolute;
            top: 10px;
            right: auto;
            bottom: 0;
            left: 326px;
            padding: 0 12px;
            text-align: center;
            white-space: nowrap;
            font-size: 14px;
            color: #c62922;
            &::before {
                content: "";
                display: block;
                width: 0;
                height: 0;
                border-top: 6px solid transparent;
                border-right: 6px solid #c62922;
                border-left: 6px solid transparent;
                border-bottom: 6px solid transparent;
                position: absolute;
                top: 10px;
                right: 0;
                bottom: 0;
                left: -12px;
            }
            &::after {
                content: "";
                display: block;
                width: 0;
                height: 0;
                border-top: 4px solid transparent;
                border-right: 4px solid #f7e3e2;
                border-left: 4px solid transparent;
                border-bottom: 4px solid transparent;
                position: absolute;
                top: 12px;
                right: 0;
                bottom: 0;
                left: -8px;
            }

            .error-tip-rel {
                position: relative;
                top: auto;
                right: auto;
                bottom: auto;
                left: auto;
                height: 32px;
                &::before {
                    content: "!";
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    color: #fff;
                    border-radius: 50%;
                    background-color: #c62922;
                    line-height: 16px;
                    margin-right: 8px;
                }
            }
        }
    }
    .login-btn {
        height: 48px;
        border-radius: 6px;
        background: #396ab1ff;
        border: none;
        margin-top: 40px;
        &:hover {
            color: #fff;
        }
    }
    .tip {
        margin-top: 40px;
        color: #333;
        font-size: 14px;
        text-align: center;
        span {
            color: #396ab1;
            font-weight: 700;
            cursor: pointer;
        }
    }
}
.flex-between {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>
