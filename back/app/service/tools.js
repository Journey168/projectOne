

const Service = require('egg').Service
const nodemailer = require('nodemailer')
const svgCaptcha = require('svg-captcha')

const userEmail = "1274049755@qq.com"

let transport = nodemailer.createTransport({
  service:'qq',
  port: 465,
  secureConnection: true,
  auth:{
    user: userEmail,
    pass: "oqjidgdsftiaibfc"
  }
})

class ToolsService extends Service{

  captcha(){
    let captcha = svgCaptcha.create({
      size: 4,
      fontSize:50,
      width: 100,
      height:40
    })
    return captcha
  }

  async sendEmail(email,title,html){
    const mailOptions = {
      from: userEmail,
      to:email,
      subject:title,
      text:'',
      html
    }
    try{
      await transport.sendMail(mailOptions)
      return true
    }catch(err){
      console.log(err)
      return false
    }
  }
}

module.exports = ToolsService


