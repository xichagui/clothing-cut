// import { useState } from 'react'
import LZQ from './LZQ8002.png'
import './App.css'
// import Y2002 from './Y2002.tif'
import React, {useEffect, useRef, useState, createContext, useContext} from 'react';
import { fabric } from 'fabric';


// const CanvasContext = createContext(null);
// const { canvas, canvasEl } = CanvasContext
const canvasContext = {'canvas': null, 'panning': false }

const App = () => {
  const canvasEl = useRef(null);
  // const { canvas1 } = useContext(CanvasContext)
  const [objLst, setObjList] = useState([])
  const [objs, setObjs] = useState(null)

  const options = {
    width: 5000,
    height: 7500,
    // fireRightClick: true,
    // fireMiddleClick: true,
    stopContextMenu: true,
    // backgroundColor: 'pink',
    // backgroundImage: undefined,
  };

  useEffect(() => {
    console.log("useEffect")
    // const canvas = new fabric.Canvas('canvas', options);
    // setCanvas(new fabric.Canvas('canvas', options));
    const canvas = new fabric.Canvas(canvasEl.current, options);
    // make the fabric.Canvas instance available to your app
    // updateCanvasContext(canvas);
    canvasContext.canvas = canvas
    const canvasNode = document.getElementById('canvas')
    // canvasDocument.wid
    canvasNode.style.width = "500px"
    canvasNode.style.height = "750px"
    const parentNode = canvasNode.parentNode
    parentNode.style.width = "500px"
    parentNode.style.height = "750px"
    const brotherNode = canvasNode.nextSibling
    brotherNode.style.width = "500px"
    brotherNode.style.height = "750px"

    return () => {
      console.log("destroy")
      // 销毁时调用 如初始化一些参数
      // updateCanvasContext(null);
      if(canvas) {
        canvas.dispose();
        canvasContext.canvas = null
        // setCanvas(null)
        // canvas = null;
      }
      setObjs(null)
    }
  }, []);

  const initCanvas = () => (
    new fabric.Canvas('canvas', options)
  )

  const click = () => {
    fabric.Image.fromURL(LZQ, (oImg) => {
      // oImg.scale(0.05);
      canvasContext.canvas.add(oImg);
    });
  }

  const span = () => {
    let activeObj = canvasContext.canvas.getActiveObject();
    activeObj.rotate(activeObj.angle + 90);
    canvasContext.canvas.renderAll();
  }

  const upload = (prop) => {
    console.log(prop)
    const objectURL = URL.createObjectURL(prop.target.files[0]);
    fabric.Image.fromURL(objectURL, (oImg) => {
      // oImg.scale(0.05);
      canvasContext.canvas.add(oImg);
      console.log(canvasContext.canvas.getObjects())
      setObjs(()=>{return canvasContext.canvas.getObjects()})
    });

    prop.target.value = '';

  }

  const z_index_change = (option) => {
    let activeObj = canvasContext.canvas.getActiveObject();
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
    console.log('图层操作')
    setObjs(()=>{return canvasContext.canvas.getObjects()})
    canvasContext.canvas.renderAll()
  }

  const upload_overlay = (prop) => {
    // console.log(prop.target.files)
    const objectURL = URL.createObjectURL(prop.target.files[0]);
    canvasContext.canvas.setOverlayImage(objectURL, canvasContext.canvas.renderAll.bind(canvasContext.canvas),{scaleX: 0.05, scaleY:0.05});
    canvasContext.canvas.renderAll();
  }

  const outputData = () => {
    console.log('output---')
    console.log(objs)
    console.log(canvasContext.canvas.getObjects())
    console.log('output---end')
  }

  const [num, setNum] = useState(1);
  useEffect(()=>{
    console.log("start")
  }, [num])



  useEffect(()=> {
    // setObjs(canvasContext.canvas.getObjects())
    // console.log(11)
    console.log('useEffect---')
    console.log(objs)
    console.log((canvasContext.canvas.getObjects()))
    console.log('useEffect---end')
  }, [objs])

  const selectObj = (index) => {
    canvasContext.canvas.discardActiveObject();
    const len = canvasContext.canvas.getObjects().length;
    canvasContext.canvas.setActiveObject(canvasContext.canvas.getObjects()[len-1-index]);
    console.log('selectObj fun');
    canvasContext.canvas.renderAll();
  }

  let _clipboard;
  const copy = () => {
    let activeObj = canvasContext.canvas.getActiveObject();

    console.log(activeObj);

    if (activeObj) {
      activeObj.clone((cloned) => {
        _clipboard = cloned;

        canvasContext.canvas.discardActiveObject();
        _clipboard.set({
          left: _clipboard.left + 10,
          top: _clipboard.top + 10,
          evented: true,
        });

        if (_clipboard.type === 'activeSelection') {
          // active selection needs a reference to the canvas.
          _clipboard.canvas = canvasContext.canvas;
          _clipboard.forEachObject(function(obj) {
            canvasContext.canvas.add(obj);
          });
          // this should solve the unselectability
          _clipboard.setCoords();
        } else {
          canvasContext.canvas.add(_clipboard);
        }

        canvasContext.canvas.setActiveObject(_clipboard);
        setObjs(()=>{return canvasContext.canvas.getObjects()})
        canvasContext.canvas.requestRenderAll();
      });

    }
  }

  useEffect(()=>{
    let mouseDown = false;

    if (canvasContext.canvas) {
      console.log('on')
      canvasContext.canvas.on({
        // 滚轮放大缩小
        // 'mouse:wheel': opt => {
        //   const delta = opt.e.deltaY > 0 ? 100 : -100 // 读取滚轮操作
        //   let zoom = canvasContext.canvas.getZoom()
        //   zoom *= 0.999 ** delta
        //   zoom = zoom < 20 ? zoom : 20;
        //   zoom = zoom > 0.01 ? zoom : 0.01;
        //
        //   canvasContext.canvas.zoomToPoint(
        //     {
        //       x: opt.e.offsetX,
        //       y: opt.e.offsetY
        //     },
        //     zoom
        //   )
        // },
        'mouse:down': opt => {
          // this.panning = true;
          mouseDown = true
        },
        'mouse:up': opt => {
          mouseDown = false
        },
        'mouse:move': opt => {
          // console.log(canvasContext.panning,111);
          if (canvasContext.panning && mouseDown && opt && opt.e) {
            canvasContext.canvas.discardActiveObject();
            const delta = new fabric.Point(opt.e.movementX, opt.e.movementY);
            canvasContext.canvas.relativePan(delta)
          }
        }
     })
    }
    // return ()=>{canvasContext.canvas.on({})}
  }, [])

  const zoom = (delta) => {
    // canvasContext.canvas.setZoom(delta)
  }

  const pan = () => {
    canvasContext.canvas.discardActiveObject();
    // canvasContext.canvas.Object.prototype.selectable = false
    canvasContext.canvas.selection = !canvasContext.canvas.selection;
    canvasContext.panning = !canvasContext.panning

    console.log("p", canvasContext.panning, "sel", canvasContext.canvas.selection)
  }

  console.log(canvasContext.canvas)

  const group = () => {
    if (!canvasContext.canvas.getActiveObject()) {
      return;
    }
    if (canvasContext.canvas.getActiveObject().type !== 'activeSelection') {
      return;
    }
    canvasContext.canvas.getActiveObject().toGroup();
    setObjs(()=>{return canvasContext.canvas.getObjects()})
    // canvasContext.canvas.renderAll()
    canvasContext.canvas.requestRenderAll();
  }

  const ungroup = () => {
    if (!canvasContext.canvas.getActiveObject()) {
      return;
    }
    if (canvasContext.canvas.getActiveObject().type !== 'group') {
      return;
    }
    canvasContext.canvas.getActiveObject().toActiveSelection();
    setObjs(()=>{return canvasContext.canvas.getObjects()})
    // canvasContext.canvas.renderAll()
    canvasContext.canvas.requestRenderAll();
  }

  const objStyle = {
    "one": { border: "2px solid black"},
    "group": { border: "2px solid red", overflow: "hidden"}
  }
  const objectList = (item, index, type="one") => {
    if (item._originalElement) {
      return (
        <div key={index} style={objStyle[type]} onClick={() => selectObj(index)}>
          <img src={item._originalElement.currentSrc} height={100}/>
        </div>
      );
    }
    else {
      if (item._objects) {
        return objectList(item._objects[0], index, "group");
      }
    }
  }

  const save = (e) => {
    const url = canvasContext.canvas.toDataURL({
      format: "jpeg",
      quality: 1
    })
    // e.download(url);
    // console.log(url)
    // this.download(url)

    const a = document.createElement('a')
    a.href = url
    a.download = `image.jpg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <>
      <div>
        <div style={{float: "right"}}>
          {
            objs?.reverse().map((item,index) => (
                objectList(item, index)
            ))
          }
        </div>
        <h1>{num}</h1>
        <button id="btnNum" onClick={()=>setNum(num + 1)}>点击</button>
        <canvas id="canvas" ref={canvasEl} style={{width: 1500, height: 1500}} />
      {/*<canvas id="canvas"/>*/}
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
        <button id="btn-copy" onClick={copy}>复制</button>
        <button id="ok" onClick={ () => outputData()}>输出数据信息</button>
        <button id="btn-zoom" onClick={() => zoom(1)}>恢复比例</button>

        <button id="btn-pan" onClick={pan}>移动画布</button>
        <button id="btn-pan" onClick={group}>合并对象</button>
        <button id="btn-pan" onClick={ungroup}>拆开对象</button>
        <button id="btna" onClick={()=>{console.log(objs)}}>log</button>
      </div>
      <div>
        <button id="btn-save" onClick={save}>导出图片</button>
      </div>
    </>
  )
}

export default App
