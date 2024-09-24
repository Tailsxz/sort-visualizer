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
  outline: "6px solid aquamarine",
  scale: 1.1,
  transition: {
    ease: "circOut",
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
  const [numbers, setNumbers] = useState(initialNums);
  const [initialNumbers, setInitialNumbers] = useState([...initialNums]);
  const [currentNumbers, setCurrentNumbers] = useState([0, 1]);
  const [sortedNumbers, setSortedNumbers] = useState(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [length, setLength] = useState(10);
  const [speed, setSpeed] = useState(1);
  const [swaps, setSwaps] = useState(0);
  const [previousSwaps, setPreviousSwaps] = useState(0);
  const [iterations, setIterations] = useState(0);
  const [previousIterations, setPreviousIterations] = useState(0);
  const [windowDimensions, setWindowDimensions] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);
  const [isSorted, setIsSorted] = useState(false);

  const timeoutIdRef = useRef(null);
  const lastIndicesRef = useRef([null, null]);
  const lastIterationsRef = useRef(null);
  const playButtonRef = useRef(null);
  const gridRef = useRef(null);
  const menuRef = useRef(null);
  const {
    current: [lastI, lastJ],
  } = lastIndicesRef;
  const { current: playButton } = playButtonRef;
  const [windowWidth, windowHeight] = windowDimensions;

  useEffect(() =>
    window.addEventListener("resize", () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      timeoutIdRef.current = setTimeout(
        () => setWindowDimensions([window.innerWidth, window.innerHeight]),
        500,
      );
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
          const lastUnsortedElementIndex = arr.length - 2 - i;
          for (let j = 0; j <= lastUnsortedElementIndex; j++) {
            if (lastJ) {
              j = lastJ;
              lastJ = null;
            }
            lastIndicesRef.current[0] = i;
            lastIndicesRef.current[1] = j;
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
            }
            if (lastUnsortedElementIndex == 1) {
              setSortedNumbers((currentSortedNumbers) => {
                currentSortedNumbers.add(arr[j + 1]);
                currentSortedNumbers.add(arr[j]);
                return new Set(currentSortedNumbers);
              });
            } else if (j == lastUnsortedElementIndex) {
              setSortedNumbers((currentSortedNumbers) => {
                currentSortedNumbers.add(arr[j + 1]);
                return new Set(currentSortedNumbers);
              });
            }
          }
        }
        setIterations(iterations);
        lastIterationsRef.current = null;
        setCurrentNumbers([null, null]);
        setIsPlaying(false);
        setIsSorted(true);
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
          iterations = lastIterations;
        }
        setIsPlaying(true);

        //With insertion sort, both the initial two numbers will always be the first sorted group, once the first swap happens. Since we're highlighting the pair in blue as the initial current numbers, we can just add them to the sorted group immediately.
        setSortedNumbers((currentSortedNumbers) => {
          currentSortedNumbers.add(arr[0]);
          currentSortedNumbers.add(arr[1]);
          return new Set(currentSortedNumbers);
        });
        for (let i = lastI; i < arr.length; i++) {
          //Otherwise, the element our i is currently at, will always be the element to be added to the sorted group.
          setSortedNumbers((currentSortedNumbers) => {
            currentSortedNumbers.add(arr[i]);
            return new Set(currentSortedNumbers);
          });
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
      },
    }),
    [speed],
  );

  function handleNav(e) {
    const controls = [
      ...menuRef.current.querySelectorAll(["button", "select"]),
    ];
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
      setPreviousSwaps(swaps);
    }
    if (iterations > 0) {
      setPreviousIterations(iterations);
    }

    lastIndicesRef.current = [null, null];
    lastIterationsRef.current = null;
    setIterations(0);
    setSwaps(0);
    setCurrentNumbers([0, 1]);
  }

  function handlePlayStateChange() {
    if (!isPlaying) {
      const { offsetHeight, offsetTop } = gridRef.current;
      window.scrollTo(
        0,
        Math.round(offsetTop - (window.innerHeight - offsetHeight) / 2),
      );
      setTimeout(() => {
        sortingAlgorithms[algorithm](
          numbers,
          lastI || 0,
          lastJ,
          lastIterationsRef.current,
        );
      }, 150);
    } else {
      setIsPlaying(false);
    }
  }

  const bars = numbers.map((numberObject, i) => {
    const { number, id } = numberObject;
    return (
      <Bar
        style={{
          height: number * (windowHeight / 240),
          width: `${(windowWidth > 1200 ? 600 : windowWidth / 3) / numbers.length}px`,
          ...(sortedNumbers.has(numberObject)
            ? {
                outline: "4px solid #33FF00",
              }
            : { outline: "2px solid aquamarine" }),
          backgroundColor: getColor(number, COLORS),
        }}
        {...(currentNumbers?.includes(i) && { animate: currentNumsVariant })}
        number={number}
        key={id}
      />
    );
  });
  return (
    <main className="primaryContainer">
      <div className="gridContainer">
        <Grid
          swaps={swaps}
          previousSwaps={previousSwaps}
          totalIterations={iterations}
          previousTotalIterations={previousIterations}
          ref={gridRef}
        >
          {bars}
        </Grid>
      </div>
      <menu className="controlsContainer" onKeyDown={handleNav} ref={menuRef}>
        <label htmlFor="algorithms">Algorithms</label>
        <li id="algorithms">
          <ul className="subMenu">
            <li>
              <button
                className={`menuItem ${algorithm == "bubble" ? "active" : ""}`}
                onClick={() => {
                  resetGridState();
                  setAlgorithm("bubble");
                }}
                aria-label="Change to the bubble sorting algorithm"
                disabled={isPlaying}
              >
                Bubble
              </button>
            </li>
            <li>
              <button
                className={`menuItem ${algorithm == "insertion" ? "active" : ""}`}
                onClick={() => {
                  resetGridState();
                  setAlgorithm("insertion");
                }}
                aria-label="Change to the insertion sorting algorithm"
                disabled={isPlaying}
              >
                Insertion
              </button>
            </li>
          </ul>
        </li>
        <label htmlFor="controls">Controls</label>
        <li id="controls" className="controls">
          <ul className="subMenu">
            <li>
              <button
                className="menuItem"
                onClick={handlePlayStateChange}
                onKeyDown={(e) => {
                  if (e.repeat) return;
                  if (e.key == "Enter" || e.key == " ") {
                    e.preventDefault();
                    handlePlayStateChange();
                  }
                }}
                aria-label={`${
                  isPlaying ? "Pause" : "Play"
                } the sorting algorithm`}
                disabled={isSorted}
                ref={playButtonRef}
              >
                {isSorted ? (
                  <div
                    style={{
                      width: "1.5rem",
                      height: "1.5rem",
                      color: "green",
                      textAlign: "center",
                    }}
                  >
                    ✔
                  </div>
                ) : isPlaying ? (
                  <PauseIcon />
                ) : (
                  <PlayIcon />
                )}
              </button>
            </li>
            <li>
              <button
                className="menuItem"
                onClick={() => {
                  setNumbers([...initialNumbers]);
                  setIsSorted(false);
                  setSortedNumbers(new Set());
                  resetGridState();
                }}
                aria-label="Reset to the initial state"
                disabled={isPlaying}
              >
                Reset
              </button>
            </li>
          </ul>
        </li>
        <li>
          <ul className="subMenu">
            <li>
              <button
                className="menuItem"
                onClick={() => {
                  let randomNumbers = generateRandomNumbers(+length);
                  resetGridState();
                  setIsSorted(false);
                  setSortedNumbers(new Set());
                  setInitialNumbers([...randomNumbers]);
                  setNumbers(randomNumbers);
                  playButton.focus();
                }}
                aria-label="Generate a new set of random numbers"
                disabled={isPlaying}
              >
                Randomize
              </button>
            </li>
            <li>
              <button
                className="menuItem"
                onClick={() => {
                  const reversedNumbers = [...numbers].reverse();
                  resetGridState();
                  setIsSorted(false);
                  setSortedNumbers(new Set());
                  setInitialNumbers([...reversedNumbers]);
                  setNumbers(reversedNumbers);

                  playButton.focus();
                }}
                aria-label="Reverse the current set of numbers"
                disabled={isPlaying}
              >
                Reverse
              </button>
            </li>
          </ul>
        </li>
        <li>
          <ul className="subMenu">
            <li>
              <label htmlFor="speed">Speed</label>
              <select
                className="menuItem"
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
                <option value="5">5x</option>
                <option value="10">10x</option>
              </select>
            </li>
            <li>
              <label htmlFor="length">Number Count</label>
              <select
                className="menuItem"
                name="length"
                id="length"
                value={length}
                onChange={(e) => setLength(e.target.value)}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="150">150</option>
              </select>
            </li>
          </ul>
        </li>
      </menu>
    </main>
  );
}

export default App;
