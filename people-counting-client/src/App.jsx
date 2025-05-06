import './App.css'
import CounterShower from './components/CounterShower.jsx'
import LineChart from './components/LineChart.jsx';
import DropDownMenu from './components/DropDownMenu.jsx';
import DoughtNut from './components/DoughtNut.jsx';
import Logs from "./components/Logs.jsx"

function App() {
  return (
    <div className="main-container">
      <div className="drop-down">
        <DropDownMenu />
      </div>
      <div className="main-sub-container">
        <div className="counting-info">
          <CounterShower />
        </div>
        {/*<div>
          <DoughtNut />
        </div>*/}
      </div>
      <div className="logs">
        <Logs />
      </div>
      <div className="line-chart">
        <LineChart />
      </div>
    </div>
  )
}

export default App
