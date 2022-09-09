/**
 * Required External Modules and Interfaces
 */

import express, { Request, Response } from "express";

/**
 * Router Definition
 */

export const codingChallengeRouter = express.Router();

/**
 * Controller Definitions
 */

// GET frequent-words
codingChallengeRouter.get("/frequent-words", async (req: Request, res: Response) => {
  try {
    if (!req.query.paragraph)
      return res.status(200).send("You must provide a paragraph :)");

    if (req.query.paragraph.length >= 1000)
      return res.status(200).send("Paragraph has an invalid length :)");

    const paragraph = String(req.query.paragraph).toLowerCase().replace(/[^a-zA-Z ]/g, "");
    const forbiddenWords = String(req.query.forbiddenWords).toLowerCase().replace(/[^a-zA-Z ]/g, "");

    let remainingWords = paragraph.split(" ").filter(word => !forbiddenWords.includes(word));

    if (!remainingWords)
      return res.status(200).send("Doesn't exist any word that isn't forbidden.");

    let wordsCount: { word: string; count: number }[];

    remainingWords.forEach(word => {
      if (!wordsCount) {
        wordsCount = [{ word: word, count: 1 }];
        return;
      }

      let wordIndex = wordsCount.findIndex((el) => el.word == word)
      if (wordIndex > -1) {
        wordsCount[wordIndex].count++;
      }
      else {
        wordsCount.push({ word: word, count: 1 });
      };
    });

    let mostFrequentWord = { word: "", count: 0 };
    wordsCount.forEach(word => {
      if (word.count > mostFrequentWord.count) {
        mostFrequentWord = word;
      }
    });

    return res.status(200).send(mostFrequentWord.word);

  } catch (e) {
    res.status(500).send(e);
  }
});

codingChallengeRouter.get("/profitable-operation", async (req: Request, res: Response) => {
  try {
    if (!req.query.prices)
      return res.status(500).send("You must provide the prices :)");
    
    const prices: number[] = String(req.query.prices).split(",").map(function (item) {
      return parseInt(item, 10);
    });    

    let mostProfitable = 0;
    for (var i = 0; i < prices.length-1; i++) {      
      let profitableBuy = 0;
      for (var y = i+1; y < prices.length-1; y++) {        
        let profit = prices[y] - prices[i];

        if (profit >= 0 && profit > profitableBuy) {
          profitableBuy = profit;
        }        
      }
      if (profitableBuy >= 0 && profitableBuy > mostProfitable) {
        mostProfitable = profitableBuy;
      }
    }

    return res.status(200).send(String(mostProfitable));

  } catch (e) {
    res.status(500).send(e);
  }
}); 