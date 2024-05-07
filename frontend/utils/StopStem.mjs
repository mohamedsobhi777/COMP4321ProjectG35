import { stemmer } from "./Porter.mjs";
import { readFileSync } from "fs";

const stopWords = new Set();

function isStopWord(str) {
    return stopWords.has(str);
}

function StopStem(queryString) {
    const split_queryString = queryString.split(/[^A-Za-z0-9]/)
    // console.log("split_queryString: ",split_queryString)
    const stopwordFile = readFileSync('./stopwords.txt', 'utf8');
    const stopwordLines = stopwordFile.split('\n');
    for (const word of stopwordLines) {
        if (word.trim()) { // Check if the word is not empty after trimming
            stopWords.add(word.trim());
        }
    }


    
    const returnString = []
    for(const queryElement of split_queryString){
        const lowerCasedQuery = queryElement.toLowerCase()
        // If this is not a stop word, perform stemming with porter's algorithm
        if (!(isStopWord(lowerCasedQuery))) {
            const stemmed_word = stemmer(lowerCasedQuery);
            // If after stemming is not empty, push to the returning string
            if(stemmed_word !== ""){
                returnString.push(stemmed_word);
            }
        } 
    }
    console.log(returnString);
    return returnString

}

StopStem("The quick brown fox jumped over the lazy dog!")
StopStem("I used to be happy. But now my happiness is resides in you.")
StopStem("AI was introduced in the year 1956, but it gained popularity recently");
