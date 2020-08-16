const rp = require('request-promise');
const cheerio = require('cheerio')
const url = 'https://engineering.careers360.com/exams';

let data = []

async function fetchTable(uri) {
    var html = await rp(uri)
    const $ = cheerio.load(html)
    table = $('.cardBlk.counselling-dates table tbody tr td')

    currTable = []
    currObj = {}

    table.each(function(i, el) {
        const currRow = $(this)
        if(i%2 == 0) {
            currObj.date = currRow.text();
        }
        else {
            currObj.event = currRow.text();
            let newObj = {...currObj}
            currTable.push(newObj);
        }
    })

    return Promise.resolve(currTable);
}


async function fetchTables() {
    await Promise.all(data.map(async (el) => {
      const table = await fetchTable(el.innerLink)
      el.table = table;
    }));
}


async function generateData(html) {
    const $ = cheerio.load(html)

    $('.cart').each(async function(i, el) {
        var currData = {};
        const curr = $(this)
        currData.name = curr.find('.titleDate h2 a').text()
        currData.innerLink = curr.find('.titleDate h2 a').attr('href')
        
        
        data.push(currData);
        
    })

    await fetchTables()
}


async function fetchData(url) {
    for(var i=10; i<=10; i++) {
        // large memory usage
        // do it in batches of 3-4
        
        let html = await rp(url + '?page=' + i)
        await generateData(html)
        console.log(i)
    }

    const fs = require('fs-extra')

    fs.writeJsonSync('./data.json', data)
    
}

fetchData(url)
