# dch-dl

dch-dl Is a downloader for the DigtalConcertHall concert database.

## Installation

Clone this repository and the use npm to install the dependencies

```bash
git clone https://github.com/Luukki/dch-dl && cd dch-dl/
npm i
```

## Usage

```bash
node downloader.js --link=[link-to-concert] --pieces=[amount-of-pieces-in-the-concert]
```

Example:
```bash
node downloader.js --link=https://www.digitalconcerthall.com/en/concert/52518 --pieces=14
```
