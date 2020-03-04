'use strict';

module.exports = function Translate(Model, options) {

    // *******************  O L D   M E T H O D S **************************

    // Model.translateData = async (ctx, user, next, dataArr) => {
    //     // EXAMPLE: [heb] דחוף [en] urgent [arab] ضروري [rus] срочно 
    //     let exampleStr = "[heb] דחוף [en] urgent [arab] ضروري [rus] срочно "
    //     let exampleData = { exampleStr }

    //     const data = exampleData// dataArr || ctx.result;
    //     if (!data) return;
    //     const CustomUser = Model.app.models.CustomUser;
    //     if (ctx.req && ctx.req.accessToken) {
    //         CustomUser.findOne({ where: { id: ctx.req.accessToken.userId } }, async (err, user) => {
    //             if (!err && user) {
    //                 ctx.result = Model.trans(user.language, ctx.result);
    //                 // ctx.hookState.transData = ctx.result;
    //                 dataArr ? next(dataArr) : next(); //!was here
    //             } else {
    //                 ctx.result = Model.trans('heb', data);
    //                 // ctx.hookState.transData = ctx.result;
    //                 dataArr ? next(dataArr) : next(); //!was here
    //             }
    //             return ctx.result;
    //         });
    //     } else {
    //         ctx.result = await Model.trans(user && user.language, data);
    //         dataArr ? next(dataArr) : next();
    //     }
    //     return ctx.result;
    // }

    // Model.trans = async (lang, data) => {
    //     let langSign = '[' + (lang && (lang !== "" || lang != undefined) ? lang : 'heb') + ']';
    //     // prevent white space between charecters
    //     langSign = langSign.replace(/\s/g, '');
    //     console.log("langSign", langSign)

    //     if (!Array.isArray(data) && typeof data === 'object' && Object.keys(data).length !== 0) {
    //         let arr = [];
    //         arr.push(data);
    //         data = arr;
    //     }
    //     let findInObj;
    //     for (let i = 0; i < data.length; i++) {
    //         findInObj = (obj, col) => {
    //             console.log("obj", obj, "col", col, "i", i)
    //             for (let column in obj) {
    //                 const strToTrans = obj[column];
    //                 if (typeof strToTrans === 'string') {
    //                     if (strToTrans.includes(langSign) || strToTrans.includes('[heb]')) { Model.translateString(strToTrans, i, column, col); }
    //                 }
    //                 else if (typeof strToTrans === "object" && column !== ("created" || "modified") && strToTrans) { findInObj(strToTrans, column); }
    //             }
    //         }
    //         findInObj(data[i].__data);
    //     }
    //     return data;
    // }

    // Model.translateString = (strToTrans, i, col1, col2) => {
    //     console.log("translateString args \nstrToTrans", strToTrans, "\ni", i, "\ncol1", col1, "\ncol2", col2)
    //     let langugue = langSign;
    //     if (!strToTrans.includes(langSign)) { langugue = '[heb]' }
    //     let regex = new RegExp("\\" + langugue + "(.*?)(\\[|$)", "g");
    //     let res = regex.exec(strToTrans);
    //     try {
    //         if (typeof strToTrans === 'string') {
    //             strToTrans = res[1].toString();
    //             if (col2) {
    //                 // if (isnurse && data[i].patientRequest) { data[i].patientRequest.__data[col2][col1] = strToTrans; }
    //                 // else { 
    //                 data[i].__data[col2][col1] = strToTrans;
    //                 //  }
    //             }
    //             else { data[i][col1] = strToTrans }
    //         }
    //     }
    //     catch (err) { console.log("err", "data[" + i + "][" + col2 + "] =", data[i].__data, col1) }
    // }

    // ****************************************************************

    Model.translateModelFields = (ctx, user, next) => {
        let data = ctx.result
        let translateableFields = []//["title", "description"];
        translateableFields = Model.definition.settings.translateableFields;
        
        for (let i = 0; i < data.length; i++) {
            let row = data[i];
            for (let j = 0; j < translateableFields.length; j++) {
                let fieldToTranslate = translateableFields[j];
                let stringToTranslate = row[fieldToTranslate]
                let res = Model.translateData(stringToTranslate);
                console.log(res)
            }
        }
        next()
        console.log(ctx.args.options)
    }

    Model.translateData = (stringToTranslate) => {
        console.log(stringToTranslate)
        let defaulteLang = 'heb'
        let translateableData = stringToTranslate
        let res;

        //# replace ']' and '[' to one space to prevent situation that the string will 
        //# look like this - '[en]here[heb]הינה' and not like that - '[en] here [heb] הינה'
        translateableData = translateableData.replace(/\]/g, ' ');
        translateableData = translateableData.replace(/\[/g, ' ');

        //# if there is double space replace with 1
        translateableData = translateableData.replace(/  +/g, ' ');

        //# prevent space in the end/start of the string
        translateableData = translateableData.trim();

        //# split the string to array
        translateableData = translateableData.split(" ")
        console.log("translateableData", translateableData)

        //# find the lang that we need and return its text (when the lang in i its text will be at i+1 )
        let langIndex = translateableData.findIndex((element) => element == defaulteLang)
        if (langIndex == -1) {
            console.log("\nERROR: the language you selected does not exist");
            // next(); return;
            return
        }
        res = translateableData[langIndex + 1]
        //# create an object with lang as the KEY and the text of the language as the VALUE 
        //# example: {en: hello, heb: שלום}
        // let translationObj = {}
        // for (let i = 0; i < translateableData.length; i = i + 2) {
        //     const lang = translateableData[i];
        //     const langText = translateableData[i + 1];
        //     translationObj[lang] = langText
        // }

        // if (Object.keys(translationObj).findIndex(lang => lang == defaulteLang) != -1) {
        //     res = translationObj[defaulteLang]
        //     console.log("res", translationObj)
        //     console.log("res", res)
        // }
        // else console.log("error: I think the language you select does not exist")
        return res
    }

    Model.afterRemote('*', function (ctx, user, next) {
        // curl http://localhost:8080/api/Games&access_token?s%3AiqJLzFjBc5s9WK4tCO0zDqki1TmP8l59BhTBfeKXbKdlrR4gZhFWb2wQRJl11BGP.Zdgl71nPZc%2BuxnR1feXQzhgmYow5wtykxOVqZLneAcs

        // => iterate through translateable fields
        // => check if they are exist in data fields
        // => if they are, send each one of them to a translateField function
        // => the translateField function will test the string against a regular expression and extract array of results for this pattern:
        // =>  [XX]whatever
        // => compare XX against the specific language that is defined into the CTX object somewhere
        // => output only the translated text instead the raw field

        //1. we retreived the data
        //2. we retreived the structure (translateableFields)
        //3. we retreived the current language (for now - it will be 'en' hardcoded)

        /*
        let fileOwnerId = (ctx.args.options && ctx.args.options.accessToken) ?
            ctx.args.options.accessToken.userId : //if there's accessToken use userId
            (Model === Model.app.models.CustomUser ? //else, if we are creating new user use new user's id
                (modelInstance && modelInstance.id) :
                null);
        */
        // Model.translateData(ctx, user, next)
        Model.translateModelFields(ctx, user, next)
        // next();
    });
};