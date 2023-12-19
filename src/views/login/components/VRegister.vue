<template>
    <div>
        <h1 class="login_h1">注册账号</h1>

        <el-form
            ref="form"
            :model="ruleForm"
            :rules="rules"
            auto-complete="off"
            class="login-form"
        >
            <div class="form-item">
                <div class="label">
                    <img src="@/assets/imgs/icon-account.png" alt="" />
                    <span>手&nbsp;机&nbsp;号</span>
                </div>

                <el-form-item prop="mobile">
                    <el-input
                        v-model="ruleForm.mobile"
                        placeholder="请输入手机号码"
                    ></el-input>
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
                    <span>验&nbsp;证&nbsp;码</span>
                </div>

                <el-form-item prop="code">
                    <el-input
                        v-model="ruleForm.code"
                        style="width: 116px"
                        class="code-input"
                        placeholder="请输入验证码"
                    ></el-input>
                    <div class="code-btn" @click="sendCode">
                        {{ codeContent }}
                    </div>
                </el-form-item>
                <div v-if="errorMessage.code.flag" class="error-tip">
                    <div class="error-tip-rel">{{ errorMessage.code.msg }}</div>
                </div>
            </div>
            <div class="form-item">
                <div class="label">
                    <img src="@/assets/imgs/icon-lock.png" alt="" />
                    <span>设置密码</span>
                </div>

                <el-form-item prop="passwd">
                    <el-input
                        v-model="ruleForm.passwd"
                        type="password"
                        placeholder="请输入密码"
                        autocomplete="new-password"
                    ></el-input>
                </el-form-item>
                <div v-if="errorMessage.passwd.flag" class="error-tip">
                    <div class="error-tip-rel">
                        {{ errorMessage.passwd.msg }}
                    </div>
                </div>
            </div>
            <div class="form-item">
                <div class="label">
                    <img src="@/assets/imgs/icon-lock.png" alt="" />
                    <span>确认密码</span>
                </div>

                <el-form-item prop="re_passwd">
                    <el-input
                        v-model="ruleForm.re_passwd"
                        type="password"
                        placeholder="请再次输入密码"
                    ></el-input>
                </el-form-item>
                <div v-if="errorMessage.re_passwd.flag" class="error-tip">
                    <div class="error-tip-rel">
                        {{ errorMessage.re_passwd.msg }}
                    </div>
                </div>
            </div>

            <div class="btn-box">
                <el-button
                    class="login-btn"
                    :loading="loading"
                    type="primary"
                    @click.native.prevent="submit(form)"
                >
                    注册
                </el-button>
                <div class="tip">
                    已有账号 <span @click="changeLogin">去登录</span>
                </div>
            </div>
        </el-form>
    </div>

    <el-dialog
        v-model="dialogVisible"
        title=""
        width="480px"
        :show-close="false"
        custom-class="register_dialog"
        top="40vh"
    >
        <div class="dialog_main">
            <img src="@/assets/login-check.png" alt="" />
            <span>注册成功，请等待管理员审核！</span>
        </div>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import { signUpCode, registerApi, userLogin } from "@/api/login";
const emit = defineEmits(["changeType"]);
import type { FormInstance } from "element-plus";


const validatemobile = (_rule, value, callback) => {
    let regMobile = /^1[3456789]\d{9}$/;
    if (!value) {
        errorMessage.value.mobile.flag = true;
        errorMessage.value.mobile.msg = "请输入手机号码";
        callback(new Error("请输入手机号"));
    } else if (!regMobile.test(value)) {
        errorMessage.value.mobile.flag = true;
        errorMessage.value.mobile.msg = "请输入正确的手机格式";
        callback(new Error("请输入正确的手机格式"));
    } else {
        errorMessage.value.mobile.flag = false;

        callback();
    }
};
const validatePwd = (_rule, value, callback) => {
    let regPassword =  /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,18}$/;
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
const validatere_passwd = (_rule, value, callback) => {
    if (!value) {
        errorMessage.value.re_passwd.flag = true;
        errorMessage.value.re_passwd.msg = "请输入密码";

        callback(new Error("请输入密码"));
    } else if (value != ruleForm.value.passwd) {
        errorMessage.value.re_passwd.flag = true;
        errorMessage.value.re_passwd.msg = "两个密码不一致";

        callback(new Error("两个密码不一致"));
    } else {
        errorMessage.value.re_passwd.flag = false;
        callback();
    }
};

const validateCode = (_rule, value, callback) => {
    if (!value) {
        errorMessage.value.code.flag = true;
        errorMessage.value.code.msg = "请输入验证码";

        callback(new Error("请输入验证码"));
    } else {
        errorMessage.value.code.flag = false;

        callback();
    }
};

const ruleForm = ref({
    mobile: "",
    passwd: "",
    re_passwd: "",
    code: "",
});
const form = ref<any>();
const codeContent = ref<any>("发送验证码");
const isSend = ref<any>(false);
const timer = ref<any>(null);
const loading = ref<boolean>(false);
const rules = ref<any>({
    mobile: [
        {
            required: true,
            validator: validatemobile,
            trigger: "blur",
        },
    ],
    passwd: [{ required: true, validator: validatePwd, trigger: "blur" }],
    re_passwd: [
        { required: true, validator: validatere_passwd, trigger: "blur" },
    ],
    code: [{ required: true, validator: validateCode, trigger: "blur" }],
});

const errorMessage = ref<any>({
    mobile: {
        flag: false,
        msg: "请输入手机号码",
    },
    code: {
        flag: false,
        msg: "请输入验证码",
    },
    passwd: {
        flag: false,
        msg: "请输入密码 （长度8-18位字母+数字）",
    },
    re_passwd: {
        flag: false,
        msg: "请再次输入密码",
    },
});

const changeLogin = () => {
    emit("changeType", 1);
};

const submit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid) => {
        if (valid) {
            register();
        } else {
            return false;
        }
    });
};

// 注册
const register = () => {
    loading.value = true;

    registerApi({
        mobile: ruleForm.value.mobile,
        code: ruleForm.value.code,
        passwd: ruleForm.value.passwd,
        re_passwd: ruleForm.value.re_passwd,
    })
        .then(async () => {
            // ElMessage.success("注册成功");
            loading.value = false;
            dialogVisible.value = true

            // userLogin({
            //     mobile: ruleForm.value.mobile,
            //     passwd: ruleForm.value.passwd,
            // })
            //     .then((res) => {
            //         userStore.userToken = res.data.token;
            //     })
            //     .catch((error) => {
            //         ElMessage.error(error.msg);
            //     });
        })
        .catch((error) => {
            if (error.code == 100010050) {
                ElMessage.error("您已有账号，请直接登录");
            }
        })
        .finally(() => {
            loading.value = false;
        });
};
//发送验证码
const sendCode = () => {
    if (!regMobile.test(ruleForm.value.mobile)) {
        ElMessage.error("请输入正确的手机号");
        return;
    }
    if (!isSend.value) {
        let num = 60;
        clearInterval(timer.value);
        timer.value = setInterval(() => {
            codeContent.value = --num + "秒后继续";
            isSend.value = true;
            if (num == 0) {
                clearInterval(timer.value);
                isSend.value = false;
                codeContent.value = "发送验证码";
            }
        }, 1000);
        signUpCode({
            mobile: ruleForm.value.mobile.toString(),
        })
            .then(() => {})
            .catch((error) => {
                clearInterval(timer.value);
                isSend.value = false;
                codeContent.value = "发送验证码";
                ElMessage.error(error.errorMsg);
            });
    }
};

const dialogVisible = ref<boolean>(false);
</script>

<style lang="scss" scoped>
:deep(.el-form-item__error) {
    display: none;
}
:deep(.el-input__inner::placeholder) {
    font-size: 16px;
}
.login_h1 {
    color: #333333;
    font-size: 20px;
    font-weight: 700;
    line-height: 40px;
    text-align: left;
    
}

.login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    margin: 0 auto;

    .form-item {
        position: relative;
        display: flex;
        height: 46px;
        border: 1px solid #dcdee0;
        margin-bottom: 20px;
        align-items: center;
        border-radius: 8px;
        padding: 0 16px;

        .label {
            display: inline-flex;
            align-items: center;
            text-align: justify;
            color: #333;
            font-size: 16px;
            line-height: 24px;
            flex: none;
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
                width: 160px;
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
            // background: #f7e3e2;
            border-radius: 4px;
            // border: 1px solid #c62922;
            line-height: 32px;
            position: absolute;
            top: 40px;
            left: 0;
            bottom: 0;
            padding: 0 12px;
            text-align: center;
            white-space: nowrap;
            font-size: 14px;
            color: #c62922;
            // &::before {
            //     content: "";
            //     display: block;
            //     width: 0;
            //     height: 0;
            //     border-top: 6px solid transparent;
            //     border-right: 6px solid #c62922;
            //     border-left: 6px solid transparent;
            //     border-bottom: 6px solid transparent;
            //     position: absolute;
            //     top: 10px;
            //     right: 0;
            //     bottom: 0;
            //     left: -12px;
            // }
            // &::after {
            //     content: "";
            //     display: block;
            //     width: 0;
            //     height: 0;
            //     border-top: 4px solid transparent;
            //     border-right: 4px solid #f7e3e2;
            //     border-left: 4px solid transparent;
            //     border-bottom: 4px solid transparent;
            //     position: absolute;
            //     top: 12px;
            //     right: 0;
            //     bottom: 0;
            //     left: -8px;
            // }

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

    .code-btn {
        height: 48px;
        line-height: 48px;
        border-radius: 6px;
        border: none;
        color: #396ab1;
        z-index: 1;
        font-weight: 700;
        font-size: 16px;
        cursor: pointer;
    }

    .btn-box {
        .login-btn {
            width: 320px;
            height: 48px;
            border-radius: 6px;
            background: #396ab1;
            border: none;
            margin-top: 20px;
            font-size: 20px;
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
}


</style>
<style lang="scss">

.register_dialog {
    border-radius: 0px!important;
    .el-dialog__header{
        display: none;
    }
    .el-dialog__body{
        padding: 24px 40px!important;

    }
 
    .dialog_main {
        display: flex;
        align-items: center;
        img {
            width: 60px;
            height: 60px;
            margin-right: 16px;
        }
        span {
            color: #333333;
            font-size: 16px;
            font-weight: 700;
        }
    }
}
</style>
