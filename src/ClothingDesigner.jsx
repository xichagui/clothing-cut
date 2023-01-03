import React, {useEffect, useRef, useState, createContext, useContext} from 'react';
import {fabric} from 'fabric'
import LZQ from './LZQ8002.png'
// import {canvas} from './App.jsx'

const ClothingDesigner = (prop) => {

  const canvas = prop.canvas;
  const canvasEl = prop.canvasEl;
  // if canvas

  const click = () => {
    fabric.Image.fromURL(LZQ, (oImg) => {
      oImg.scale(0.05);
      canvas.add(oImg);
    });
  }

  const span = () => {
    let activeObj = canvas.getActiveObject();
    activeObj.rotate(activeObj.angle + 90);
    canvas.renderAll();
  }

  const upload = (prop) => {
    console.log(prop.target.files)
    const objectURL = URL.createObjectURL(prop.target.files[0]);
    fabric.Image.fromURL(objectURL, (oImg) => {
      oImg.scale(0.05);
      canvas.add(oImg);
      console.log(canvas.getObjects())
      setObjs(()=>{return canvas.getObjects()})
    });

    prop.target.value = '';

  }

  const z_index_change = (option) => {
    let activeObj = canvas.getActiveObject();
    switch (option) {
      case "FORWARD":
        activeObj.bringForward();
        break;
      case "BACKWARD":
        activeObj.sendBackwards()
        break;
      case "FRONT":
        activeObj.bringToFront()
        break;
      case "BACK":
        activeObj.sendToBack()
        break;
      default:
        break;
    }
    canvas.renderAll()
  }

  const upload_overlay = (prop) => {
    console.log(prop.target.files)
    const objectURL = URL.createObjectURL(prop.target.files[0]);
    canvas.setOverlayImage(objectURL, canvas.renderAll.bind(canvas),{scaleX: 0.05, scaleY:0.05});
    canvas.renderAll();
  }

  const outputData = () => {
    console.log(canvas.getObjects())
  }

  const [num, setNum] = useState(1);
  useEffect(()=>{
    console.log("start")
  }, [num])

  const [objs, setObjs] = useState(null)

  return(
    <>
      <div>
        <div style={{float: "right"}}>
          {objs?.map(item => (
            <div style={{border: "2px solid black"}}>
              <img src={item._originalElement.currentSrc} height={100}/>
            </div>
          ))}
        </div>
        <h1>{num}</h1>
        <button id="btnNum" onClick={()=>setNum(num + 1)}>点击</button>
        <canvas id="canvas" ref={canvasEl}/>
        <button id="btn1" onClick={click}>点击</button>
        <button id="btn2" onClick={span}>旋转</button>
        <input type="file" id="upload" onChange={upload}/>
        <input type="file" id="upload2" onChange={upload_overlay}/>
        <button id="z-index-forward" onClick={ () => z_index_change("FORWARD")}>图层提升</button>
        <button id="z-index-backward" onClick={ () => z_index_change("BACKWARD")}>图层下降</button>
        <button id="z-index-front" onClick={ () => z_index_change("FRONT")}>图层置顶</button>
        <button id="z-index-back" onClick={ () => z_index_change("BACK")}>图层置底</button>
      </div>
      <div>
        <button id="ok" onClick={ () => outputData()}>输出数据信息</button>
      </div>
    </>

  );
}



export default ClothingDesigner
