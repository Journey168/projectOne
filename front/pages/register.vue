<template>
  <div  class="login-container">

    <el-form ref='form' :model="form" :rule="registerRule" class="login-form" >
      <div class="title-container">
        <img src="/logo.png" alt="">
      </div>
      <el-form-item prop="email">
        <span class="svg-container">
          <i class="el-icon-mobile">
          </i>
        </span>
        <el-input
          ref = 'email'
          v-model='form.email'
          placeholder = '邮箱'
          name="email"
          >

        </el-input>
      </el-form-item>



      <!-- 邮箱验证码 -->
      <el-form-item prop="emailcode" class="email-code">
        <div class="send-email-btn">
          <el-button type="primary" @click="sendCode">发送</el-button>
        </div>
        <span class="svg-container">
          <i class="el-icon-user">
          </i>
        </span>

        <el-input
          ref = 'emailcode'
          v-model='form.emailcode'
          placeholder = '邮箱验证码'
          name="emailcode"
          >

        </el-input>
      </el-form-item>


      <el-form-item prop="nickname">
        <span class="svg-container">
          <i class="el-icon-user">
          </i>
        </span>
        <el-input
          ref = 'nickname'
          v-model='form.nickname'
          placeholder = '昵称'
          name="nickname"
          >
        </el-input>
      </el-form-item>

      <!-- 图形验证码 -->
      <el-form-item prop="emailcode" class="email-code">
        <div class="send-email-btn">
          <img :src="code.captcha" @click="resetCptcha" alt="">
        </div>
        <span class="svg-container">
          <i class="el-icon-user">
          </i>
        </span>

        <el-input
          ref = 'captcha'
          v-model='form.captcha'
          placeholder = '图形验证码'
          name="captcha"
          >
        </el-input>
      </el-form-item>


      <el-form-item prop="password">
        <span class="svg-container">
          <i class="el-icon-lock">
          </i>
        </span>
        <el-input
          ref = 'password'
          :key="passwordType"
          v-model='form.password'
          placeholder = '密码'
          name="password"
          :type="passwordType"
          >
        </el-input>
        <span class="show-pwd" @click="showPwd">
          <i v-if="passwordType=='password'" class="el-icon-lock"></i>
          <i v-else class="el-icon-key"></i>
        </span>
      </el-form-item>

      <el-form-item prop="repassword">
        <span class="svg-container">
          <i class="el-icon-lock">
          </i>
        </span>
        <el-input
          ref = 'repassword'
          v-model='form.repassword'
          placeholder = '再次输入密码'
          name="repassword"
          type="password"
          >

        </el-input>
      </el-form-item>
      <el-button @click.native.prevent='handleRegister' type="primary" sytle="width:100%;margin-bottom:30px">
        注册
      </el-button>
    </el-form>

  </div>
</template>


<script>

import md5 from 'md5'
export default {
  layout:'login',
  data(){
    return {
      form:{
        email:'1274049755@qq.com',
        nickname:'Handsome Boy',
        emailcode:"",
        captcha:"",
        password:"",
        repassword:""
      },
      code:{
        captcha: "/api/user/captcha"
      },
      registerRule:{
        email:[
          {required:true,message:'请输入邮箱'},
          {type:"email",message:'请输入正确邮箱'}
        ],
        password:[
          {required:true,message:'请输入密码'},
          {max:12,message:'密码长度限制12'}
        ],
        repassword:[
          {
            required:true,
            trigger:'blur',
            validator:(rule,value,callback)=>{
              if(value!==this.form.password){
                callback(new Error('两次输入不一致'))
              }else{
                callback()
              }
            }
          }
        ],
        emailcode:[
          {required:true,message:'请输入邮箱验证码'}
        ],
        captcha:[
          {required:true,message:'请输入图形验证码'}
        ]
      },
      passwordType: 'password'

    }
  },
  methods:{

    async sendCode(){
      const ret = await this.$http.get('/user/sendcode?email='+this.form.email)
      if(ret.data.code==0){
        this.$notify({
          title:"发送成功",
          type:"success"
        })
      }
    },

    resetCptcha(){
      this.code.captcha = "/api/user/captcha?_t="+new Date().getTime()
    },
    showPwd(){
      this.passwordType = this.passwordType==="password"?"text":"password"
    },
    handleRegister(){

      this.$refs.form.validate(async valid=>{
        if(valid){
          console.log('loading状态切换')
          let obj = {
            email: this.form.email,
            password: md5(this.form.password),
            emailcode: this.form.emailcode,
            captcha: this.form.captcha,
            nickname: this.form.nickname
          }
          let ret = await this.$http.post('user/register',obj)
          //注册成功信息提示
          if(ret.data.code===0){
            this.$notify({
              type:'sucees',
              title: ret.data.message
            })
          }else{
            this.$notify({
              type:'warning',
              title: ret.data.message
            })
          }
          //成功跳转
        }
      })
    }
  }
}
</script>


<style lang="scss">

.email-code{
  width:340px;
  position: relative;
  .send-email-btn{
    position: absolute;
    right:-110px;
    .el-button{
      width:90px;
      height:50px;
    }
    img{
            width:90px;
      height:50px;
      cursor: pointer;
    }
  }
}
/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      height: 47px;

    }
  }

  .el-form-item {
    border: 1px solid rgba(0, 0, 0, 0.1);
    // background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
  }
}
</style>

<style lang="scss" scoped>

.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;
    text-align: center;
    margin-bottom:20px;
    img{
      width:200px;

    }

  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    cursor: pointer;
    user-select: none;
  }

  .auth{
    margin-top:10px;
    text-align: center;
    img{
      width:45px;
      height:45px;
      margin: 0 30px;
    }
  }

}
</style>
