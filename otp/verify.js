
const speakeasy=require("speakeasy");

var verified=speakeasy.totp.verify({
    secret: 'Z{od2!<w:G#!HvT>Ow4TNpef,cd$0py;',
    encoding: 'ascii',
    token: '507656'
})

console.log(verified);