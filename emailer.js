const sendmail = require('sendmail')();

function sendEmail(subject,msg,done) {
    let mailOptions = {
        from: 'sundeep@sundeepnarang.com', // sender address
        to: "sundeepnrng@gmail.com", // list of receivers
        subject: subject, // Subject line
        html: msg, // plaintext body
    };
    console.log("Transporter Sending Email");
    sendmail(mailOptions, function(error, response){
        if(error){
            console.log("Transporter Sending Email Failed : ",error);
            done(error);
        }else{
            console.log("Message sent: " + response.message);
            done(null)
        }
    });
}

exports.sendEmail = sendEmail;