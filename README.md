# dch-dl

dch-dl is a downloader for the DigtalConcertHall concert database.

## Installation

Clone this repository and the use npm to install the dependencies

```bash
git clone https://github.com/Luukki/dch-dl && cd dch-dl/
npm i
```

## Usage

```bash
node downloader.js [OPTIONS] [LINK]
```

Example:
```bash
node downloader.js --specific=1,4 --format=high https://www.digitalconcerthall.com/en/concert/52518
```

## OPTIONS

### Available options:

```--url=[link-to-concert]``` 
Optionally just add it as the last argument

```--specific=[IndexesToDownload]```
Specify what idexes(pieces) of the concert the program should download i. ex. --specific=1,3

```--format=[VideoQuality]```
Current options: high, medium and low; Default: medium

```-n```
Print number of pieces/indexes in the concert and exit

```-p```
Print direct urls to m3u8 playlists and exit

```-D```
Do not download
