module.exports = function Log(user,type,origem,message){     
    const timestamp= new Date().toLocaleString('pt-BR');     
    console.log(`${timestamp}-${user}-${type}-${origem}-${message}`)
}
