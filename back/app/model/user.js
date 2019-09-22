
module.exports = app=>{
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const UserSchema = new Schema({
    email:{type: String,require:true},
    password:{type: String,require:true},
    nickname:{type: String,require:true}
  },{timestamps:true/**自动生成创建时间和更新时间 */})

  return mongoose.model("User",UserSchema)
}