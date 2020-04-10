
// TODO: Make a function that uses ffmpeg to combine the videofiles into one videofile containing the full concert
// TODO: Maybe at some poing, store the not yet combined videofiles to tmp...?
// TODO: Make it possible to only download the audio/extract the audio form the video afterwards
// TODO: Make a "auto" argument to the pieces argument and also verify the user-specified piece-indexes
// TODO: Make it possible for the user tho specify exactly which of the pieces to download, instead of just the amount of the pieces starting from 1.

const fs = require("fs");
const ffmpeg = require('fluent-ffmpeg');
const Jetty = require("jetty");



const args = getArgs(); // (from: https://stackoverflow.com/questions/4351521/how-do-i-pass-command-line-arguments-to-a-node-js-program)

input = args.link;
video_id = input.substring(input.length - 5);

var jetty = new Jetty(process.stdout);
jetty.clear();

for(let i = 1; i<=args.pieces; i++)
{
    try{
        url = formatUrl(video_id, i);
        var command = ffmpeg(url)
            .outputOptions([
                '-codec: copy',
                '-vcodec: copy'
            ])
            .on("end", function() {
                console.log("\nFile number" + i + " finished processing");
            })
            .on("error", function(e){
                console.error(e.message);
            })
            .on("progress", function(progress) {
                jetty.moveTo(i);
                jetty.text("File " + i.toString() + " processing: " + Math.floor(progress.percent) + "% done");
            })
            .save("segment" + i.toString() + ".mp4")
    } catch(e){
        console.log(e.code);
        console.log(e.msg);
    }
}

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
        args.pieces = 1;
    return args;
}

function formatUrl(id, index) {
    let url = "";
    if(id < 30000)
       url = "https://world-vod.dchdns.net/hlss/dch/"+id.toString()+"-"+index.toString()+"/,h264_LOW_THREE,h264_HIGH,h264_VERY_HIGH_ONE,_en.mp4.urlset/master.m3u8";
    else
       url = "https://world-vod.dchdns.net/hlss/dch/"+id.toString()+"-"+index.toString()+"/,h264_LOW_THREE,h264_HIGH,h264_VERY_HIGH_ONE/.mp4.urlset/master.m3u8";
    return url;
}

function getPieces()
{

}
