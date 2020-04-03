
// TODO: Make a function that uses ffmpeg to combine the videofiles into one videofile containing the full concert
// TODO: Maybe at some poing, store the not yet combined videofiles to tmp...?
// TODO: Make it possible to only download the audio/extract the audio form the video afterwards


const fs = require("fs");
const m3u8ToMp4 = require("m3u8-to-mp4"); // TODO: Would be nice to replace this with just ffmpeg
const ffmpeg = require("ffmpeg"); // TODO: Use this.
const args = getArgs(); // format the arguments into a simple object (from: https://stackoverflow.com/questions/4351521/how-do-i-pass-command-line-arguments-to-a-node-js-program)

var converter = new m3u8ToMp4(); // TODO: remove this, as it is a "cheap" solution

input = process.argv[2].toString(); //TODO: Maybe make these lines into a function
url = "https://world-vod.dchdns.net/hlss/dch/" + input.substring(input.length - 5) + "-";

let done = [process.argv[3]];

for(let i = 1; i <= process.argv[3]; i++) // goes through the amount of indexes specified by the arguments
{
    (async function() { // creates a child process that downloads the video
        await converter
            .setInputFile(url + i.toString() + "/,h264_LOW_THREE,h264_HIGH,h264_VERY_HIGH_ONE,.mp4.urlset/master.m3u8") // Input link for the video
            .setOutputFile("master-" + i.toString() + ".mp4") // output file name sceme
            .start(); // starts the child process
        console.log("Done" + i.toString()); // Log's to the console when the process is done, includes the process number
        done[i] = true;
        checkIfDone();
    })();
}

function checkIfDone() // TODO: Make this function call a function combine all the files with ffmpeg, when all the downloads are done.
{
    for(let i = 0; i > process.argv[3]; i++)
    {
        if(!done[i])
            return;
    }
    console.log("All done!");    
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
    return args;
}

