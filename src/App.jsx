import { useState, useEffect, useRef, useMemo } from "react";
import { nanoid } from "nanoid";
import Grid from "./components/Grid.jsx";
import Bar from "./components/Bar.jsx";
import PlayIcon from "./components/PlayIcon.jsx";
import PauseIcon from "./components/PauseIcon.jsx";
import "./App.css";

const RIGHT_KEYS = new Set(["ArrowRight", "d", "l"]);
const LEFT_KEYS = new Set(["ArrowLeft", "a", "h"]);
const currentNumsVariant = {
  outline: "4px solid aquamarine",
  scale: 1.1,
  transition: {
    duration: 0.3,
  },
};

function createRandomNumberObject() {
  return {
    number: Math.ceil(Math.random() * 100),
    id: nanoid(),
  };
}

function generateRandomNumbers(amount = 10) {
  return new Array(amount).fill(null).map(createRandomNumberObject);
}

function getColor(number, colors) {
  return colors[
    Math.min(Math.ceil(((number + 1) / 100) * 10) - 1, colors.length - 1)
  ];
}

function properMod(dividend, divisor) {
  console.log(((dividend % divisor) + divisor) % divisor);
  return ((dividend % divisor) + divisor) % divisor;
}

const COLORS = [
  "#FFF900",
  "#FFC43D",
  "#FFB700",
  "#DC602E",
  "#C42021",
  "#DE6C83",
  "#EF476F",
  "#B118C8",
  "#9E00FF",
  "#6C04FF",
];

//#TODO, when done sorting, display sorted icon(checkmark?) and disable the play button.

const initialNums = generateRandomNumbers(10);
function App() {
  const [algorithm, setAlgorithm] = useState("insertion");
  const [numbers, setNumbers] = useState([...initialNums]);
  const [initialNumbers, setInitialNumbers] = useState([...initialNums]);
  const [currentNumbers, setCurrentNumbers] = useState([0, 1]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [length, setLength] = useState(10);
  const [speed, setSpeed] = useState(1);
  const [swaps, setSwaps] = useState(0);
  const [previousSwaps, setPreviousSwaps] = useState(0);
  const [iterations, setIterations] = useState(0);
  const [previousIterations, setPreviousIterations] = useState(0);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [isSorted, setIsSorted] = useState(false);

  const timeoutIdRef = useRef(null);
  const lastIndicesRef = useRef([]);
  const lastIterationsRef = useRef(null);
  const playButtonRef = useRef();
  const resetButtonRef = useRef();
  const {
    current: [lastI, lastJ],
  } = lastIndicesRef;
  const { current: playButton } = playButtonRef;

  useEffect(() =>
    window.addEventListener("resize", () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      timeoutIdRef.current = setTimeout(
        () => setWindowHeight(window.innerHeight),
        500,
      );
      // setWindowHeight(window.innerHeight);
    }),
  );

  const sortingAlgorithms = useMemo(
    () => ({
      bubble: async function bubbleSort(
        arr,
        lastI = 0,
        lastJ = 0,
        lastIterations = null,
      ) {
        setIsPlaying(true);

        let iterations = 0;
        if (lastIterations != null) {
          iterations = lastIterations;
        }

        for (let i = lastI; i < arr.length; i++) {
          let swapped = false;
          const lastUnsortedElementIndex = arr.length - 2 - i;
          for (let j = 0; j <= lastUnsortedElementIndex; j++) {
            if (lastJ) {
              j = lastJ;
              lastJ = 0;
            }

            const isPlaying = await new Promise((res) =>
              setIsPlaying((currentPlayState) => {
                res(currentPlayState);
                return currentPlayState;
              }),
            );
            if (!isPlaying) {
              return;
            }

            lastIterationsRef.current = iterations;
            iterations++;
            if (arr[j].number > arr[j + 1].number) {
              setCurrentNumbers([j, j + 1]);
              setSwaps((swaps) => swaps + 1);
              let temp = arr[j];
              arr[j] = arr[j + 1];
              arr[j + 1] = temp;
              // arr[j].number = arr[j].number ^ arr[j + 1].number; //intermediate
              // arr[j + 1].number = arr[j + 1].number ^ arr[j].number;
              // arr[j].number = arr[j].number ^ arr[j + 1].number;
              setNumbers([...arr]);
              await new Promise((res) => {
                setTimeout(() => res(null), (1 / speed) * 500);
              });
              swapped = true;
            }

            if (j == lastUnsortedElementIndex) {
              console.log("before reset", i, j);
              console.log("resetting!!", i + 1, 0);
              lastIndicesRef.current[0] = i + 1;
              lastIndicesRef.current[1] = 0;
            } else {
              lastIndicesRef.current = [i, j + 1];
            }
          }

          if (!swapped && lastJ === false) {
            console.log("breaking out of the loop!");
            break;
          }
        }
        setIterations(iterations);
        lastIterationsRef.current = null;
        setCurrentNumbers([null, null]);
        setIsPlaying(false);
        setIsSorted(true);
        setTimeout(() => resetButtonRef.current.focus(), 50);
      },
      insertion: async function insertionSort(
        arr,
        lastI = 1,
        lastJ,
        lastIterations = null,
      ) {
        if (arr.length < 2) return arr;
        let iterations = 0;
        if (lastIterations != null) {
          console.log("passed in lastIterations", lastIterations);
          iterations = lastIterations;
        }
        setIsPlaying(true);
        for (let i = lastI; i < arr.length; i++) {
          for (let j = i; j > 0; j--) {
            if (lastJ) {
              j = lastJ;
              lastJ = null;
            }
            const isPlaying = await new Promise((res) =>
              setIsPlaying((currentPlayState) => {
                res(currentPlayState);
                return currentPlayState;
              }),
            );
            if (!isPlaying) {
              return;
            }
            iterations++;
            lastIterationsRef.current = iterations;
            if (arr[j].number < arr[j - 1].number) {
              setCurrentNumbers([j - 1, j]);
              setSwaps((swaps) => swaps + 1);
              //Destructuring can be used to swap array elements?!?!?!?!?! O_O, it works because the left hand side takes the values at the destructured positions and stores it in the variable defined... which can include array elements!!!!
              [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
              await new Promise((res) => {
                setTimeout(() => res(null), (1 / speed) * 500);
              });
              setNumbers([...arr]);

              const isLastElement = j === 1;
              const isNotLastRow = i !== arr.length - 1;
              if (isLastElement && isNotLastRow) {
                lastIndicesRef.current[0] = i + 1;
                lastIndicesRef.current[1] = i + 1;
              } else if (!isLastElement) {
                lastIndicesRef.current = [i, j - 1];
              }
            } else {
              break;
            }
          }
        }
        lastIterationsRef.current = null;
        setIterations(iterations);
        setCurrentNumbers([null, null]);
        setIsPlaying(false);
        setIsSorted(true);
        setTimeout(() => resetButtonRef.current.focus(), 50);
      },
    }),
    [speed],
  );

  function handleNav(e) {
    const controls = [...e.currentTarget.children];
    const currentControlIndex = controls.indexOf(e.target);
    let direction;

    if (RIGHT_KEYS.has(e.key)) {
      e.preventDefault();
      direction = 1;
    } else if (LEFT_KEYS.has(e.key)) {
      e.preventDefault();
      direction = -1;
    } else return;

    const newIndex = currentControlIndex + direction;
    controls[properMod(newIndex, controls.length)].focus();
  }

  function resetGridState() {
    if (swaps > 0) {
      console.log("setting previous to", swaps);
      setPreviousSwaps(swaps);
    }
    if (iterations > 0) {
      console.log("setting previous to", iterations);
      setPreviousIterations(iterations);
    }

    lastIndicesRef.current = [null, null];
    lastIterationsRef.current = null;
    setIterations(0);
    setSwaps(0);
    setCurrentNumbers([0, 1]);
    setIsSorted(false);
  }

  function handlePlayStateChange() {
    if (!isPlaying) {
      sortingAlgorithms[algorithm](
        numbers,
        lastI || 0,
        lastJ,
        lastIterationsRef.current,
      );
    } else {
      setIsPlaying(false);
    }
  }

  const bars = numbers.map(({ number, id }, i) => {
    return (
      <Bar
        style={{
          height: (number * windowHeight) / 190,
          backgroundColor: getColor(number, COLORS),
          width: `${280 / numbers.length}px`,
        }}
        {...(currentNumbers?.includes(i) && { animate: currentNumsVariant })}
        number={number}
        key={id}
      />
    );
  });
  return (
    <>
      <h1>
        Current Algorithm: {algorithm[0].toUpperCase() + algorithm.slice(1)}
      </h1>
      <Grid
        swaps={swaps}
        previousSwaps={previousSwaps}
        totalIterations={iterations}
        previousTotalIterations={previousIterations}
      >
        {bars}
      </Grid>
      <div className="algs">
        <button
          onClick={() => {
            resetGridState();
            setAlgorithm("bubble");
          }}
          disabled={isPlaying}
        >
          Bubble
        </button>
        <button
          onClick={() => {
            resetGridState();
            setAlgorithm("insertion");
          }}
          disabled={isPlaying}
        >
          Insertion
        </button>
      </div>
      <div className="controls" onKeyDown={handleNav}>
        <button
          onClick={handlePlayStateChange}
          onKeyDown={(e) => {
            e.preventDefault();
            if (e.repeat) return;
            if (e.key == "Enter" || e.key == " ") {
              handlePlayStateChange();
            }
          }}
          disabled={isSorted}
          ref={playButtonRef}
        >
          {isSorted ? <div>✔</div> : isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button
          onClick={() => {
            setNumbers([...initialNumbers]);
            resetGridState();
          }}
          disabled={isPlaying}
          ref={resetButtonRef}
        >
          Reset
        </button>
        <button
          onClick={() => {
            let randomNumbers = generateRandomNumbers(+length);
            resetGridState();
            setInitialNumbers([...randomNumbers]);
            setNumbers(randomNumbers);
            playButton.focus();
          }}
          disabled={isPlaying}
        >
          randomize
        </button>
        <button
          onClick={() => {
            const reversedNumbers = [...numbers].reverse();
            resetGridState();
            setInitialNumbers([...reversedNumbers]);
            setNumbers(reversedNumbers);

            playButton.focus();
          }}
          disabled={isPlaying}
        >
          reverse
        </button>
        <select
          name="speed"
          id="speed"
          value={speed}
          onChange={(e) => setSpeed(e.target.value)}
        >
          <option value="0.5">0.5x</option>
          <option value=".75">0.75x</option>
          <option value="1">1x</option>
          <option value="1.5">1.5x</option>
          <option value="2">2x</option>
          <option value="3">3x</option>
        </select>
        <select
          name="length"
          id="length"
          value={length}
          onChange={(e) => setLength(e.target.value)}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
          <option value="25">25</option>
        </select>
      </div>
    </>
  );
}

export default App;
