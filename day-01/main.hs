module Main where

import qualified Data.Text as T
import qualified Data.Text.IO as TIO
import qualified Data.Text.Read as TR
import Data.List (maximumBy, sortBy)
import Data.Either (rights)
import Data.Ord (comparing)

main :: IO()
main = do
  -- Parse puzzle input
  input <- TIO.readFile "./input.txt"
  let grouped = T.splitOn (T.pack "\n\n") input
  let splitElements = map (T.splitOn (T.pack "\n")) grouped
  let elves = map (map fst . rights . map (\x ->  TR.decimal x)) splitElements

  -- Part 1
  let amountCaloriesOfMaxElf = sum . maximumBy (comparing sum) $ elves
  print amountCaloriesOfMaxElf

  -- Part 2
  let amountCaloriesFirstThreeElves = (sum . map sum . take 3) $ sortBy ((flip . comparing) sum) elves
  print amountCaloriesFirstThreeElves
