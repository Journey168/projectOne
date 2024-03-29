'use strict';

const md5 = require('md5')
const BaseController = require('./base');

class UserController extends BaseController {
  async index() {
    const { ctx } = this;
    ctx.body = '用户信息。。。';
  }

  async checkEmail(value){
    const user = await this.ctx.model.User.findOne({value})
    return user
  }

  async create(){
    const {ctx} = this
    let {email,password,emailcode,captcha,nickname} = ctx.request.body

    if(emailcode!==ctx.session.emailcode){
      return this.error('邮箱验证码出错')
    }
    if(captcha.toUpperCase()!==ctx.session.captcha.toUpperCase()){
      return this.error('图形验证码出错')
    }
    if(await this.checkEmail(email)){
      return this.error('邮箱已经存在')
    }
    let ret = await ctx.model.User.create({
      email,
      nickname,
      password: md5(password)
    })
    if(ret._id){
      this.success('注册成功')
    }
    //数据检验

  }

  async captcha(){
    const {ctx} = this
    let captcha = await this.service.tools.captcha()

    ctx.session.captcha = captcha.text
    console.log('验证码',captcha.text)
    ctx.response.type = 'image/svg+xml'
    ctx.body = captcha.data
  }

  async email(){
    //controller 写业务逻辑 通用的逻辑 抽象成service
    const {ctx} = this
    const email = ctx.query.email
    const code = Math.random().toString().slice(2,6)

    console.log('邮件'+email+'验证码'+code)
    const title = "学习吧验证码"
    const html = `
      <h1>开课吧注册验证码</h1>
      <div>
        <a href="https://kaikeba.com">${code}</a>
      </div>
    `
    const hasSend = await this.service.tools.sendEmail(email,title,html)
    console.log(hasSend)

    if(hasSend){
      ctx.session.emailcode = code
      this.message('发送成功')
    }else{
      this.error('发送失败')
    }

  }
  
  demoinfo(){
    const {ctx} = this
    console.log(ctx.session)
    this.success("测试信息")
    // ctx.body = {
    //   code:0,
    //   data: "测试信息"
    // }
  }
}

module.exports = UserController;
