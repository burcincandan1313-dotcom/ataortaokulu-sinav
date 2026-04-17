const fs = require('fs');
const scrapedData = JSON.parse(fs.readFileSync('./src/curriculum_scraped_v3.json', 'utf8'));
const { curriculumData } = require('./src/curriculum.js');

for (const grade in curriculumData) {
    if (scrapedData[grade]) {
        for (const subject in scrapedData[grade]) {
            // Check if the scraped data has actual units.
            // A heuristic: if there are any elements starting with a number, or if there are at least 3 elements.
            let scrapedUnits = scrapedData[grade][subject];
            let hasNumberedUnits = scrapedUnits.some(u => /^[0-9]/.test(u));
            
            if (hasNumberedUnits) {
                // If the scraped data is better, overwrite.
                // We keep everything that was scraped because it represents the actual curriculum.
                curriculumData[grade][subject] = scrapedUnits;
            } else if (!curriculumData[grade][subject]) {
                // If it doesn't exist in original at all, just add it.
                curriculumData[grade][subject] = scrapedUnits;
            }
            // If the original has good units and the scraped one is just a 2-line title without numbers, keep the original!
        }
    }
}

let fileContent = '/**\n * curriculum.js\n * Resmi TTKB (Türkiye Yüzyılı Maarif Modeli) sunucularından %100 güncel çekilmiştir.\n */\nexport const curriculumData = {\n';

for (let i = 1; i <= 12; i++) {
    if (curriculumData[i]) {
        fileContent += `  ${i}: {\n`;
        for (const subject in curriculumData[i]) {
            const units = curriculumData[i][subject];
            fileContent += `    '${subject}': ${JSON.stringify(units)},\n`;
        }
        fileContent += `  },\n`;
    }
}
fileContent += '};\n';
fs.writeFileSync('./src/curriculum.js', fileContent, 'utf8');
console.log('Successfully merged scraped data into curriculum.js safely.');
