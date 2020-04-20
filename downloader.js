
// TODO: Make a function that uses ffmpeg to combine the videofiles into one videofile containing the full concert
// TODO: Maybe at some point, store the not yet combined videofiles to tmp...?
// TODO: Make it possible to only download the audio/extract the audio form the video afterwards

const fs = require("fs");
const ffmpeg = require('fluent-ffmpeg');
const rp = require("request-promise");

let pieces;
let specific = [];

const args = getArgs(); // (from: https://stackoverflow.com/questions/4351521/how-do-i-pass-command-line-arguments-to-a-node-js-program)

input = args.url;
const video_id = input.substring(input.length - 5);

async function main()
{
    await getPieces(args.url);
    if(args.n)
    {
        console.log("Available pieces: "+ pieces);
        process.exit();
    }
    if(args.specific != undefined)
    {
        specific = args.specific.split(",");
        specific.forEach(indexN => {
            if(indexN > pieces)
            {
                console.log("No such piecenumber available");
                process.exit(1);
            }
        });
    }
    else
    {
        for(let j = 0; j < pieces; j++)
            specific[j] = j+1;
    }
    for(let i = 0; i<specific.length; i++)
    {
        try{
            url = formatUrl(video_id, specific[i]);
            var command = ffmpeg(url)
                .outputOptions([
                    '-codec: copy',
                    '-vcodec: copy'
                ])
                .on("end", function() {
                    console.log("\nFile number" + specific[i] + " finished processing");
                })
                .on("error", function(e){
                    console.error(e.message);
                })
                .on("progress", function(progress) {
                    console.log("File " + i.toString() + " processing: " + Math.floor(progress.percent) + "% done");
                })
                .save("segment" + specific[i].toString() + ".mp4")
        } catch(e){
            console.log(e.code);
            console.log(e.msg);
        }
    }
}
//END OF THE MAIN FUNCTION

function getArgs () {
    const args = {};
    process.argv
        .slice(2, process.argv.length)
        .forEach( arg => {
            // long arg
            if (arg.slice(0,2) === '--') {
                const longArg = arg.split('=');
                const longArgFlag = longArg[0].slice(2,longArg[0].length);
                const longArgValue = longArg.length > 1 ? longArg[1] : true;
                args[longArgFlag] = longArgValue;
            }
            // flags
            else if (arg[0] === '-') {
                const flags = arg.slice(1,arg.length).split('');
                flags.forEach(flag => {
                    args[flag] = true;
                });
            }
        });
    if(!args.pieces)
        args.pieces = "auto";
    return args;
}

function formatUrl(id, index) {
    let url = "";
    if(id < 30000)
        url = "https://world-vod.dchdns.net/hlss/dch/"+id.toString()+"-"+index.toString()+"/,h264_LOW_THREE,h264_HIGH,h264_VERY_HIGH_ONE,_en.mp4.urlset/master.m3u8";
    else
        url = "https://world-vod.dchdns.net/hlss/dch/"+id.toString()+"-"+index.toString()+"/,h264_LOW_THREE,h264_HIGH,h264_VERY_HIGH_ONE,.mp4.urlset/master.m3u8";
    return url;
}

async function getPieces(url)
{
    await rp(url)
        .then(function(html){
            //console.log((html.match(new RegExp("no-break", "g")) || []).length);
            //return(parseInt((html.match(new RegExp("no-break", "g")) || []).length));
            pieces = parseInt((html.match(new RegExp("no-break", "g")) || []).length);
        })
        .catch(function(err){
            console.error(error)
        });
}
main();
