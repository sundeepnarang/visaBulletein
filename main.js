const request = require("request");
const fs = require("fs");
const cheerio = require("cheerio");

const {sendEmail} = require("./emailer");

const requestUrl = "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html";
const readFromFile = false;
const writeToFile = false;

const tempHTMLPath = `${__dirname}/temp.html`;
const ignoreText = "ComingSoon";

function writeFile({path,data}={},done=()=>{}){
    fs.writeFile(path,data,done);
}

function createEmail(currentVal,currentHREF,done) {
    const subject = `Visa Bulletin Page Updated : ${currentVal}`;
    const message = `<p><a href="https://travel.state.gov${currentHREF}">Click Here</a></p><br><br><p>https://travel.state.gov${currentHREF}</p>`;
    console.log("Sending Email");
    sendEmail(subject,message,done);
}

function parseHTML(html,done) {
    console.log("Loading HTML : ",html.trim().substr(0,20));
    let $;
    try{
         $ = cheerio.load(html);
    }catch (e) {
        console.log("e : ",e);
        done(e)
    }
    console.log("Loaded HTML : ")
    const $a = $($("li.current")[1]).find("a");
    const currentVal = $a.text();
    const currentHREF = $a.attr("href");

    console.log("currentVal : ",currentVal);
    console.log("currentHREF : ",currentHREF);
    // createEmail(currentVal,currentHREF,done);

    if(currentVal===ignoreText){
        console.log("No Change");
    }else {
        createEmail(currentVal,currentHREF,done)
    }

}

module.exports = (callback)=> {
    if (readFromFile) {
        fs.readFile(tempHTMLPath, (err, data) => {
            if (err) {
                return console.log("err : ", err);
            }
            parseHTML(data,callback);
        });
    } else {
        console.log("Sending Request");
        request(requestUrl, (err, res, body) => {
            if (err) {
                return console.log("err : ", err);
            }
            console.log("Started Parsing");
            parseHTML(body,callback);
            if(writeToFile){
                writeFile({path:tempHTMLPath,data:body},()=>{})
            }
        });
    }
};
