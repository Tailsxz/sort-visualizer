import {  useState, useEffect, useRef } from 'react';
import Grid from './components/Grid.jsx';
import Bar from './components/Bar.jsx';
import './App.css';
import { nanoid } from 'nanoid';
import PlayIcon from './components/PlayIcon.jsx';
import PauseIcon from './components/PauseIcon.jsx';

const currentNumsVariant = {
  outline: '4px solid aquamarine',
  scale: 1.1,
  transition: {
    duration: .3,
  }
}

let randomNumbers = new Array(10).fill(null).map(createRandomNumberObject);

function createRandomNumberObject() {
  return {
    number: Math.ceil(Math.random() * 100),
    id: nanoid(),
  };
}


function getColor(number) {
  let color;
  if (number < 10) {
    color = COLORS[0];
  } else if (number < 20) {
    color = COLORS[1];
  } else if (number < 30) {
    color = COLORS[2];
  } else if (number < 40) {
    color = COLORS[3];
  } else if (number < 50) {
    color = COLORS[4];
  } else if (number < 60) {
    color = COLORS[5];
  } else if (number < 70) {
    color = COLORS[6];
  } else if (number < 80) {
    color = COLORS[7];
  } else if (number < 90) {
    color = COLORS[8];
  } else {
    color = COLORS[9]
  }
  return color;
}

// const COLORS = ['#1F0318', '#FFC43D', '#EF476F', '#72E1D1', '#3777FF', '#DC602E', '#B118C8', '#DE6C83', '#D1345B', '#C42021'];
const COLORS = ['#FFF900', '#FFC43D', '#FFB700', '#DC602E', '#C42021', '#DE6C83', '#EF476F', '#B118C8', '#9E00FF', '#6C04FF'];

function App() {
  const [numbers, setNumbers] = useState(randomNumbers);
  const [isPlaying, setIsPlaying] = useState(false);
  const [length, setLength] = useState(10);
  const [speed, setSpeed] = useState(1);
  const [swaps, setSwaps] = useState(0);
  const [currentNumbers, setCurrentNumbers] = useState([0, 1]);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  const timeoutIdRef = useRef(null);
  const lastIndicesRef = useRef([0, 0]);

  const { current: [lastI, lastJ]} = lastIndicesRef;

  useEffect(() => window.addEventListener('resize', () => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }
    timeoutIdRef.current = setTimeout(() => setWindowHeight(window.innerHeight), 500)
    // setWindowHeight(window.innerHeight);
  }));
  
  async function bubbleSort(arr, lastI = 0, lastJ = 0) {
    setIsPlaying(true);
    for (let i = lastI; i < arr.length; i++) {
      let swapped = false;
      for (let j = 0; j < arr.length - 1 - i; j++) {
        if (lastJ) {
          j = lastJ;
          lastJ = 0;
        }
        const isPlaying = await new Promise((res) => setIsPlaying((currentPlayState) => {
          //Right now if we "pause" and "play" it will start the alg starting at the beginning rather than where we left off!
          res(currentPlayState)
          return currentPlayState
        }));
        if (!isPlaying) {
          return;
        }
        if (arr[j].number > arr[j + 1].number) {
          setCurrentNumbers([j, j + 1]);
          setSwaps((swaps) => swaps + 1)
          let temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          // arr[j].number = arr[j].number ^ arr[j + 1].number; //intermediate
          // arr[j + 1].number = arr[j + 1].number ^ arr[j].number;
          // arr[j].number = arr[j].number ^ arr[j + 1].number;
          setNumbers([...arr]);
          await new Promise((res) => {
            setTimeout(() => res(null), 1 / speed * 500);
          });
          swapped = true;
        }
        console.log(lastIndicesRef.current, currentNumbers, arr.length - i - 1);

        if (j >= arr.length - 2 - i) {
          lastIndicesRef.current[1] = 0;
          lastIndicesRef.current[0] = i + 1;
        } else {
          lastIndicesRef.current = [i, j + 1];
        }
      }

      if (!swapped && lastJ === false) {
        console.log('breaking out of the loop!');
        break
      }
    }
    setIsPlaying(false);
    setCurrentNumbers([null, null]);
    return arr;
  }

  function handleNav(e) {
    const controls = [...e.currentTarget.children];
    const currentControlIndex = controls.indexOf(e.target);
    let direction;
    if (e.key === 'ArrowRight' || e.key === 'd') {
      e.preventDefault();
      direction = 'right';
    } else if (e.key === 'ArrowLeft' || e.key === 'a') {
      e.preventDefault();
      direction = 'left';
    }

    
    if (direction === 'left') {
      const newIndex = (currentControlIndex - 1);
      if (newIndex < 0) {
        controls[controls.length + newIndex].focus();
      } else {
        controls[newIndex].focus();
      }
    } else if (direction === 'right') {
      const newIndex = (currentControlIndex + 1);
      controls[(newIndex) % (controls.length)].focus();
    }
  }

  const bars = numbers.map(({number, id}, i) => {
    return (
      <Bar 
      style={{
        height: number * windowHeight / 190,
        backgroundColor: getColor(number),
        width: `${280 / numbers.length}px`,
      }}
      {...(currentNumbers?.includes(i) && { animate: currentNumsVariant })}
      number={number}
      key={id}
      /> 
    )
  })
  return (
    <>
      <h1>Total Swaps: {swaps}</h1>
      <Grid swaps={swaps}>
        {bars}
      </Grid>
      <div 
        className="controls"
        onKeyDown={handleNav}
      >
        <button 
          onClick={
            () => {
              if (!isPlaying) {
                bubbleSort(numbers, lastI, lastJ);
              } else {
                setIsPlaying(false);
              }
            }
          }
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button 
          onClick={
            () => {
              lastIndicesRef.current = [0, 0];
              setSwaps(0);
              setCurrentNumbers([0, 1]);
              setNumbers(new Array(+length).fill(null).map(createRandomNumberObject))
            }
          }
          disabled={isPlaying}
          >
          randomize
        </button>
        <button 
          onClick={
            () => {
              lastIndicesRef.current = [0, 0];
              setSwaps(0);
              setCurrentNumbers([0, 1]);
              setNumbers([...numbers].reverse())
            }
          }
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
  )
}

export default App
