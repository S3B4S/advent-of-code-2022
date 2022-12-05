module Main where

import qualified Data.Text as T
import qualified Data.Text.IO as TIO
import qualified Data.Text.Read as TR
import Data.List (maximumBy, sortBy)
import Data.Either (rights)
import Data.Ord (comparing)

splitOn :: String -> T.Text -> [T.Text]
splitOn = T.splitOn . T.pack

rowToIntegers :: [T.Text] -> [Integer]
rowToIntegers = map fst . rights . map TR.decimal

main :: IO()
main = do
  -- Parse puzzle input
  input <- TIO.readFile "./input.txt"
  let elves = map (rowToIntegers . splitOn "\n") . (splitOn "\n\n") $ input

  -- Part 1
  let amountCaloriesOfMaxElf = sum . maximumBy (comparing sum) $ elves
  print amountCaloriesOfMaxElf -- 70116

  -- Part 2
  let amountCaloriesFirstThreeElves = sum . concat . take 3 . sortBy (flip . comparing $ sum) $ elves
  print amountCaloriesFirstThreeElves -- 206582
