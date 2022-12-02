module Main where

import qualified Data.Text as T
import qualified Data.Text.IO as TIO

data Hand = Rock | Paper | Scissors deriving (Show)

type OpponentMove = Hand

encodeOpponentMove :: Char -> OpponentMove
encodeOpponentMove 'A' = Rock
encodeOpponentMove 'B' = Paper
encodeOpponentMove 'C' = Scissors
encodeOpponentMove _ = error "Illegal move"

type MyMove = Hand

encodeMyMove :: Char -> MyMove
encodeMyMove 'X' = Rock
encodeMyMove 'Y' = Paper
encodeMyMove 'Z' = Scissors

shapeSelectionPoints :: MyMove -> Integer
shapeSelectionPoints Rock = 1
shapeSelectionPoints Paper = 2
shapeSelectionPoints Scissors = 3

data Outcome = Loss | Draw | Win deriving (Show)

pointsOutcome :: Outcome -> Integer
pointsOutcome Loss = 0
pointsOutcome Draw = 3
pointsOutcome Win = 6

-- (OpponentMove, MyMove)
rules :: (Hand, Hand) -> Outcome
rules (Rock, Paper) = Win
rules (Rock, Scissors) = Loss
rules (Paper, Rock) = Loss
rules (Paper, Scissors) = Win
rules (Scissors, Rock) = Win
rules (Scissors, Paper) = Loss
rules _ = Draw -- all the other cases are draws

calculateBattle :: (OpponentMove, MyMove) -> Integer
calculateBattle battle@(oppMove, myMove) = (shapeSelectionPoints myMove) + (pointsOutcome $ rules battle)

splitOn :: String -> T.Text -> [T.Text]
splitOn = T.splitOn . T.pack

encodeLine :: String -> (OpponentMove, MyMove)
encodeLine line = (encodeOpponentMove move, encodeMyMove outcome)
  where
    move = head line
    outcome = last line

main :: IO ()
main = do
  -- parsing input
  input <- TIO.readFile "./input.txt"
  let inputParsed = (splitOn "\n") . T.strip $ input

  -- part 1
  print $ sum $ map (calculateBattle . encodeLine . T.unpack) inputParsed
