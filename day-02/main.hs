{-# LANGUAGE ExplicitForAll #-}

module Main where

import qualified Data.Text as T
import qualified Data.Text.IO as TIO

data Hand = Rock | Paper | Scissors deriving (Show, Eq)

beatsHand :: Hand -> Hand
beatsHand Rock = Scissors
beatsHand Scissors = Paper
beatsHand Paper = Rock

beats :: Hand -> Hand -> Bool
beats x y
  | beatsHand x == y = True
  | otherwise = False

type OpponentMove = Hand

encodeOpponentMove :: Char -> OpponentMove
encodeOpponentMove 'A' = Rock
encodeOpponentMove 'B' = Paper
encodeOpponentMove 'C' = Scissors
encodeOpponentMove _ = error "Illegal opponent move"

type MyMove = Hand

encodeMyMove :: Char -> MyMove
encodeMyMove 'X' = Rock
encodeMyMove 'Y' = Paper
encodeMyMove 'Z' = Scissors
encodeOpponentMove _ = error "Illegal own move"

shapeSelectionPoints :: MyMove -> Integer
shapeSelectionPoints Rock = 1
shapeSelectionPoints Paper = 2
shapeSelectionPoints Scissors = 3

data Outcome = Loss | Draw | Win deriving (Show)

encodeOutcome :: Char -> Outcome
encodeOutcome 'X' = Loss
encodeOutcome 'Y' = Draw
encodeOutcome 'Z' = Win

pointsOutcome :: Outcome -> Integer
pointsOutcome Loss = 0
pointsOutcome Draw = 3
pointsOutcome Win = 6

-- Part 1
-- (OpponentMove, MyMove)
rules :: (Hand, Hand) -> Outcome
rules (oppMove, myMove)
  | oppMove == myMove       = Draw
  | oppMove `beats` myMove  = Loss
  | otherwise               = Win

calculateBattlePart1 :: (OpponentMove, MyMove) -> Integer
calculateBattlePart1 battle@(oppMove, myMove) = (shapeSelectionPoints myMove) + (pointsOutcome $ rules battle)

-- Part 2
-- opponent move -> desired outcome -> my move
pickMove :: Hand -> Outcome -> Hand
pickMove hand Draw = hand
pickMove oppMove Win = (beatsHand . beatsHand) oppMove
pickMove oppMove Loss = beatsHand oppMove

calculateBattlePart2 :: (OpponentMove, Outcome) -> Integer
calculateBattlePart2 battle@(oppMove, desiredOutcome) = shapeSelectionPoints myMove + pointsOutcome desiredOutcome
  where myMove = pickMove oppMove desiredOutcome

-- Parsing
splitOn :: String -> T.Text -> [T.Text]
splitOn = T.splitOn . T.pack

encodeLine :: forall a b. (Char -> a) -> (Char -> b) -> String -> (a, b)
encodeLine f g line = (f $ head line, g $ last line)

main :: IO ()
main = do
  -- parsing input
  input <- TIO.readFile "./input.txt"
  let inputParsed = (splitOn "\n") . T.strip $ input

  -- part 1
  print . sum . map (calculateBattlePart1 . encodeLine encodeOpponentMove encodeMyMove . T.unpack) $ inputParsed -- 12535

  -- part 2
  print . sum . map (calculateBattlePart2 . encodeLine encodeOpponentMove encodeOutcome . T.unpack) $ inputParsed -- 15457
