import React,{useState} from 'react'

export default function Logs() {
    const [openLogs,setOpenLogs]=useState(false);
    const [logs,setLogs]=useState([]);
  return (
    <div>
        {
            !openLogs 
            ? <button>Open Logs</button>
            : (
                logs.map((val)=>
                    <div>
                        <li>time : {}</li>
                        <li>count : {}</li>
                    </div>
                ))
        }
    </div>
  )
}
