const path = require('path');
const fs = require('fs').promises;

(async () => {
    const file = await fs.readFile(path.join(__dirname, 'pg67104.txt'), 'utf8');

    let [book, extra] = file.split("*** END OF THE PROJECT GUTENBERG EBOOK THE A B C OF RELATIVITY ***");
    
    let chapterOneStart = book.match(/CHAPTER ONE:/);
    book = book.substring(chapterOneStart.index);
    let chapterHeadings = book.match(/^CHAPTER (ONE|[IXV]+: [A-Z]+)/gm);
    let chapterIndexes = chapterHeadings.map(heading => book.indexOf(heading));
    let chapters = chapterIndexes.map(
        (startIndex, i) => {
            return book.substring(startIndex, chapterIndexes[i+1]||book.length).trim();
        }
    );

    await Promise.all(chapters.map(chapter => {
        let chapNum = chapter.match(/CHAPTER (ONE|[IXV]+)/)[1];
        if (chapNum == "ONE") chapNum = "I";
        return fs.writeFile(path.join(__dirname, "posts/" + chapNum + ".txt"), chapter);
    }));
})();
