<template>
    <div class="login_container">
        <div class="form-box">
            <div class="title">风启学林</div>
          <!-- 登录 -->
          <VLogin v-if="loginType == 1" key="login" @changeType="changeType"></VLogin>
          <!-- 注册 -->
          <VRegister v-else key="register" @changeType="changeType"></VRegister>
        </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import {  ref } from 'vue';
  import { useRoute } from 'vue-router';
  const route = useRoute();
  
  import VLogin from "./components/VLogin.vue";
  import VRegister from "./components/VRegister.vue";
  
  const loginType =  ref<any>(1)
  
  const changeType = (type)=>{
      loginType.value = type;
  }
  
  </script>
  
  <style lang="scss" scoped>
  .login_container {
    width: 100%;
    height: 100vh;
    min-height: 100vh;
    min-width: 100vw;
    overflow: hidden;
    background-size: 100% 100%;
    background-color: #fff;
    .form-box {
        width: 100vw;
        padding: 0px 20px 0;
        background: url(https://sso.scimall.org.cn/vendors/images/strong/m/login-bg.png) no-repeat;
        background-size: contain;
        .title{
            color: #fff;
            font-size: 20px;
            text-align: center;
            padding: 80px;

        }
       
      }
 

  }
  </style>
  