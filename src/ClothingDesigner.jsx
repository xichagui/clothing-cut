// import LZQ from './LZQ8002.png'
// import './App.css'
// import React, {useEffect, useRef, useState} from 'react';
// import { fabric } from 'fabric';
//
// const canvasContext = {'canvas': null, 'panning': false, 'canvas2': null, 'json': null }
//
// fabric.Object.NUM_FRACTION_DIGITS = 100
//
// const objStyle = {
//   "one": { border: "2px solid black"},
//   "group": { border: "2px solid red", overflow: "hidden"}
// }
//
// const selectObj = (index) => {
//   canvasContext.canvas.discardActiveObject();
//   // const len = canvasContext.canvas.getObjects().length;
//   canvasContext.canvas.setActiveObject(canvasContext.canvas.getObjects()[index]);
//   console.log('selectObj fun');
//   canvasContext.canvas.renderAll();
// }
//
//
// const Lii = (prop) => {
//   const target = prop.target
//   if (target) {
//     return target.map((item,index) => (
//       objectList(item, index)
//     )).reverse()
//   } else {
//     return null
//   }
//
//   // console.log('Lii', prop)
// }
//
// const objectList = (item, index, type="one") => {
//   if (item._originalElement) {
//     return (
//       <div key={index} style={objStyle[type]} onClick={() => selectObj(index)}>
//         <img src={item._originalElement.currentSrc} height={100}/>
//       </div>
//     );
//   }
//   else {
//     if (item._objects) {
//       return objectList(item._objects[0], index, "group");
//     }
//   }
// }
//
// const App = () => {
//   const canvasEl = useRef(null);
//   const canvasEl2 = useRef(null);
//   const [objs, setObjs] = useState(null)
//
//   const options = {
//     width: 500,
//     height: 500,
//     // fireRightClick: true,
//     // fireMiddleClick: true,
//     stopContextMenu: true,
//     backgroundColor: '#eeeeee',
//     // backgroundImage: undefined,
//   };
//
//   useEffect(() => {
//     console.log("useEffect")
//     // const canvas = new fabric.Canvas('canvas', options);
//     // setCanvas(new fabric.Canvas('canvas', options));
//     const canvas = new fabric.Canvas(canvasEl.current, options);
//     const canvas2 = new fabric.Canvas(canvasEl2.current, options);
//     // make the fabric.Canvas instance available to your app
//     // updateCanvasContext(canvas);
//     canvasContext.canvas = canvas
//     canvasContext.canvas2 = canvas2
//
//     return () => {
//       console.log("destroy")
//       // 销毁时调用 如初始化一些参数
//       if(canvas) {
//         canvas.dispose();
//         canvasContext.canvas = null
//         canvas2.dispose();
//         canvasContext.canvas2 = null
//       }
//       setObjs(null)
//     }
//   }, []);
//
//   // const initCanvas = () => (
//   //   new fabric.Canvas('canvas', options)
//   // )
//
//   const click = () => {
//     fabric.Image.fromURL(LZQ, (oImg) => {
//
//       canvasContext.canvas.add(oImg);
//     });
//   }
//
//   const span = () => {
//     let activeObj = canvasContext.canvas.getActiveObject();
//     activeObj.rotate(activeObj.angle + 90);
//     canvasContext.canvas.renderAll();
//   }
//
//   const upload = (prop) => {
//     console.log(prop)
//     // const filePath = prop.target.value
//     // const fileName = prop.target.files[0].name
//     const file = prop.target.files[0]
//     // const extn = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase()
//
//     if (window.FileReader) {
//       const reader = new FileReader()
//       reader.readAsDataURL(file)
//       reader.onloadend = (e) => {
//         const base64String = e.target.result
//         fabric.Image.fromURL(base64String, (oImg) => {
//           oImg.scale(0.1);
//           canvasContext.canvas.add(oImg);
//           console.log(canvasContext.canvas.getObjects())
//           setObjs(()=>{return canvasContext.canvas.getObjects()})
//         });
//       }
//     }
//
//     prop.target.value = '';
//   }
//
//   // const upload2 = (prop) => {
//   //   console.log(prop)
//   //   const objectURL = URL.createObjectURL(prop.target.files[0]);
//   //
//   //   const reader = new FileReader();
//   //   // reader.onload
//   //
//   //   const img = new Image();
//   //   img.src = objectURL;
//   //   img.onload = () => {
//   //     console.log(img.width, img.height)
//   //   }
//   //
//   //   fabric.Image.fromURL(objectURL, (oImg) => {
//   //     // oImg.scale(0.05);
//   //     canvasContext.canvas.add(oImg);
//   //     console.log(canvasContext.canvas.getObjects())
//   //     setObjs(()=>{return canvasContext.canvas.getObjects()})
//   //   });
//   //
//   //   prop.target.value = '';
//   // }
//
//   const z_index_change = (option) => {
//     let activeObj = canvasContext.canvas.getActiveObject();
//     switch (option) {
//       case "FORWARD":
//         activeObj.bringForward();
//         break;
//       case "BACKWARD":
//         activeObj.sendBackwards()
//         break;
//       case "FRONT":
//         activeObj.bringToFront()
//         break;
//       case "BACK":
//         activeObj.sendToBack()
//         break;
//       default:
//         break;
//     }
//     console.log('图层操作')
//     setObjs(()=>{return canvasContext.canvas.getObjects()})
//     canvasContext.canvas.renderAll()
//   }
//
//   const upload_overlay = (prop) => {
//     // console.log(prop.target.files)
//     const objectURL = URL.createObjectURL(prop.target.files[0]);
//     canvasContext.canvas.setOverlayImage(objectURL, canvasContext.canvas.renderAll.bind(canvasContext.canvas),{scaleX: 0.05, scaleY:0.05});
//     canvasContext.canvas.renderAll();
//   }
//
//
//   const outputData = () => {
//     console.log('output---')
//     console.log(objs)
//     console.log(canvasContext.canvas.getObjects())
//     console.log('output---end')
//   }
//
//   const [num, setNum] = useState(1);
//   useEffect(()=>{
//     console.log("start")
//   }, [num])
//
//
//   let _clipboard;
//   const copy = () => {
//     let activeObj = canvasContext.canvas.getActiveObject();
//
//     console.log(activeObj);
//
//     if (activeObj) {
//       activeObj.clone((cloned) => {
//         _clipboard = cloned;
//
//         canvasContext.canvas.discardActiveObject();
//         _clipboard.set({
//           left: _clipboard.left + 10,
//           top: _clipboard.top + 10,
//           evented: true,
//         });
//
//         if (_clipboard.type === 'activeSelection') {
//           // active selection needs a reference to the canvas.
//           _clipboard.canvas = canvasContext.canvas;
//           _clipboard.forEachObject(function(obj) {
//             canvasContext.canvas.add(obj);
//           });
//           // this should solve the unselectability
//           _clipboard.setCoords();
//         } else {
//           canvasContext.canvas.add(_clipboard);
//         }
//
//         canvasContext.canvas.setActiveObject(_clipboard);
//         setObjs(()=>{return canvasContext.canvas.getObjects()})
//         canvasContext.canvas.requestRenderAll();
//       });
//
//     }
//   }
//
//   useEffect(()=>{
//     let mouseDown = false;
//
//     if (canvasContext.canvas) {
//       console.log('on')
//       canvasContext.canvas.on({
//         // 滚轮放大缩小
//         'mouse:wheel': opt => {
//           const delta = opt.e.deltaY > 0 ? 100 : -100 // 读取滚轮操作
//           let zoom = canvasContext.canvas.getZoom()
//           zoom *= 0.999 ** delta
//           zoom = zoom < 20 ? zoom : 20;
//           zoom = zoom > 0.01 ? zoom : 0.01;
//
//           canvasContext.canvas.zoomToPoint(
//             {
//               x: opt.e.offsetX,
//               y: opt.e.offsetY
//             },
//             zoom
//           )
//         },
//         'mouse:down': opt => {
//           // this.panning = true;
//           mouseDown = true
//         },
//         'mouse:up': opt => {
//           mouseDown = false
//         },
//         'mouse:move': opt => {
//           // console.log(canvasContext.panning,111);
//           if (canvasContext.panning && mouseDown && opt && opt.e) {
//             canvasContext.canvas.discardActiveObject();
//             const delta = new fabric.Point(opt.e.movementX, opt.e.movementY);
//             canvasContext.canvas.relativePan(delta)
//           }
//         }
//       })
//     }
//     // return ()=>{canvasContext.canvas.on({})}
//   }, [])
//
//
//   const pan = () => {
//     canvasContext.canvas.discardActiveObject();
//     // canvasContext.canvas.Object.prototype.selectable = false
//     canvasContext.canvas.selection = !canvasContext.canvas.selection;
//     canvasContext.panning = !canvasContext.panning
//
//     console.log("p", canvasContext.panning, "sel", canvasContext.canvas.selection)
//   }
//
//   const group = () => {
//     if (!canvasContext.canvas.getActiveObject()) {
//       return;
//     }
//     if (canvasContext.canvas.getActiveObject().type !== 'activeSelection') {
//       return;
//     }
//     canvasContext.canvas.getActiveObject().toGroup();
//     setObjs(()=>{return canvasContext.canvas.getObjects()})
//     // canvasContext.canvas.renderAll()
//     canvasContext.canvas.requestRenderAll();
//   }
//
//   const ungroup = () => {
//     if (!canvasContext.canvas.getActiveObject()) {
//       return;
//     }
//     if (canvasContext.canvas.getActiveObject().type !== 'group') {
//       return;
//     }
//     canvasContext.canvas.getActiveObject().toActiveSelection();
//     setObjs(()=>{return canvasContext.canvas.getObjects()})
//     // canvasContext.canvas.renderAll()
//     canvasContext.canvas.requestRenderAll();
//   }
//
//
//   const save = (hasPattern) => {
//
//     loadJSON(hasPattern)
//
//     const url = canvasContext.canvas2.toDataURL({
//       format: "jpeg",
//       quality: 1
//     })
//     // e.download(url);
//     // console.log(url)
//     // this.download(url)
//
//     const a = document.createElement('a')
//     a.href = url
//     a.download = `image.jpg`
//     document.body.appendChild(a)
//     a.click()
//     document.body.removeChild(a)
//   }
//
//   const newCanvasFromUpload = (prop) => {
//     console.log(prop)
//     const objectURL = URL.createObjectURL(prop.target.files[0]);
//     const img = new Image();
//     img.src = objectURL;
//
//     // const filePath = prop.target.value
//     // const fileName = prop.target.files[0].name
//     const file = prop.target.files[0]
//     // const extn = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase()
//
//     if (window.FileReader) {
//       const reader = new FileReader()
//       reader.readAsDataURL(file)
//       reader.onloadend = (e) => {
//         const base64String = e.target.result
//         // console.log(base64String)
//         fabric.Image.fromURL(base64String, (oImg) => {
//           // oImg.scale(0.1);
//           // canvasContext.canvas.add(oImg);
//           // console.log(canvasContext.canvas.getObjects())
//           // setObjs(()=>{return canvasContext.canvas.getObjects()})
//
//           canvasContext.canvas.setWidth(oImg.width/10)
//           canvasContext.canvas.setHeight(oImg.height/10)
//
//           const bg = new fabric.Rect({ width: oImg.width/10, height: oImg.height/10, fill: 'white', evented: false, selectable: false });
//           bg.canvas = canvasContext.canvas;
//           canvasContext.canvas.backgroundImage = bg;
//           // canvasContext.canvas.renderAll()
//
//           canvasContext.canvas.setOverlayImage(oImg, canvasContext.canvas.renderAll.bind(canvasContext.canvas), {scaleX: 0.1, scaleY:0.1});
//           canvasContext.canvas.renderAll();
//         });
//       }
//     }
//
//   }
//
//   // 读取新版型并按宽度缩放原图
//   const uploadNewPattern = (prop) => {
//     console.log(prop)
//     const objectURL = URL.createObjectURL(prop.target.files[0]);
//     const img = new Image();
//     img.src = objectURL;
//
//     const file = prop.target.files[0]
//
//     if (window.FileReader) {
//       const reader = new FileReader()
//       reader.readAsDataURL(file)
//       reader.onloadend = (e) => {
//         const base64String = e.target.result
//         fabric.Image.fromURL(base64String, (oImg) => {
//           canvasContext.canvas.discardActiveObject();
//
//           const scaleX = (oImg.width/10) / canvasContext.canvas.width
//           // const scaleY = (oImg.height/10) / canvasContext.canvas.height
//           // 以宽度为默认花纹缩放比例
//           const scaleY = (oImg.width/10) / canvasContext.canvas.width
//
//           if (canvasContext.canvas.getObjects()) {
//             const sel = new fabric.ActiveSelection(canvasContext.canvas.getObjects(), {
//               canvas: canvasContext.canvas,
//             });
//             canvasContext.canvas.setActiveObject(sel);
//             canvasContext.canvas.getActiveObject().toGroup();
//             canvasContext.canvas.discardActiveObject();
//
//             const group = canvasContext.canvas.getObjects()[0]
//             group.top = group.top * scaleY
//             group.left = group.left * scaleX
//             group.scaleX = scaleX
//             group.scaleY = scaleY
//           }
//
//           canvasContext.canvas.setWidth(oImg.width/10)
//           canvasContext.canvas.setHeight(oImg.height/10)
//
//           const bg = new fabric.Rect({ width: oImg.width/10, height: oImg.height/10, fill: 'white', evented: false, selectable: false });
//           bg.canvas = canvasContext.canvas;
//           canvasContext.canvas.backgroundImage = bg;
//
//           canvasContext.canvas.setOverlayImage(oImg, canvasContext.canvas.renderAll.bind(canvasContext.canvas), {scaleX: 0.1, scaleY:0.1});
//
//           // if (canvasContext.canvas.getObjects()) {
//           //    const sel = new fabric.ActiveSelection(canvasContext.canvas.getObjects(), {
//           //      canvas: canvasContext.canvas,
//           //    });
//           //    canvasContext.canvas.setActiveObject(sel);
//           //    canvasContext.canvas.getActiveObject().toActiveSelection();
//           //
//           //    canvasContext.canvas.discardActiveObject();
//           //  }
//
//           setObjs(()=>{return canvasContext.canvas.getObjects()})
//           canvasContext.canvas.renderAll();
//         });
//       }
//     }
//   }
//
//   // 读取新版型并居中延伸
//   const uploadNewPattern2 = (prop) => {
//     console.log(prop)
//     const objectURL = URL.createObjectURL(prop.target.files[0]);
//     const img = new Image();
//     img.src = objectURL;
//
//     const file = prop.target.files[0]
//
//     if (window.FileReader) {
//       const reader = new FileReader()
//       reader.readAsDataURL(file)
//       reader.onloadend = (e) => {
//         const base64String = e.target.result
//         fabric.Image.fromURL(base64String, (oImg) => {
//           canvasContext.canvas.discardActiveObject();
//
//           const objects = {"obj": null}
//           if (canvasContext.canvas.getObjects()) {
//             const sel = new fabric.ActiveSelection(canvasContext.canvas.getObjects(), {
//               canvas: canvasContext.canvas,
//             });
//             canvasContext.canvas.setActiveObject(sel);
//             canvasContext.canvas.getActiveObject().toGroup();
//             canvasContext.canvas.discardActiveObject();
//
//             objects.obj = canvasContext.canvas.getObjects()[0]
//             objects.obj.left = oImg.width/10/2 - (objects.obj.width-objects.obj.left)/2
//             objects.obj.top = oImg.height/10/2 - (objects.obj.height-objects.obj.top)/2
//           }
//
//           canvasContext.canvas.setWidth(oImg.width/10)
//           canvasContext.canvas.setHeight(oImg.height/10)
//
//           const bg = new fabric.Rect({ width: oImg.width/10, height: oImg.height/10, fill: 'white', evented: false, selectable: false });
//           bg.canvas = canvasContext.canvas;
//           canvasContext.canvas.backgroundImage = bg;
//
//           canvasContext.canvas.setOverlayImage(oImg, canvasContext.canvas.renderAll.bind(canvasContext.canvas), {scaleX: 0.1, scaleY:0.1});
//
//           // if (canvasContext.canvas.getObjects()) {
//           //    const sel = new fabric.ActiveSelection(canvasContext.canvas.getObjects(), {
//           //      canvas: canvasContext.canvas,
//           //    });
//           //    canvasContext.canvas.setActiveObject(sel);
//           //    canvasContext.canvas.getActiveObject().toActiveSelection();
//           //
//           //    canvasContext.canvas.discardActiveObject();
//           //  }
//
//           setObjs(()=>{return canvasContext.canvas.getObjects()})
//           canvasContext.canvas.renderAll();
//         });
//       }
//     }
//   }
//
//   const toJSON = () => {
//     console.log(canvasContext.canvas.toJSON(['width', 'height']))
//   }
//
//   const toJSON2 = () => {
//
//     const canvasObject = canvasContext.canvas.toJSON(['width', 'height'])
//     canvasTimes(canvasObject, 10)
//     console.log(JSON.stringify(canvasObject))
//
//     const a = document.createElement('a')
//
//     const blob = new Blob([JSON.stringify(canvasObject)])
//     a.href = URL.createObjectURL(blob)
//     a.download = `save.json`
//     document.body.appendChild(a)
//     a.click()
//     document.body.removeChild(a)
//   }
//
//
//   const rePos = () => {
//     canvasContext.canvas.setViewportTransform([1,0,0,1,0,0]);
//   }
//
//   const loadJSON = (hasPattern) => {
//     const canvasObject = canvasContext.canvas.toJSON(['width', 'height'])
//     canvasTimes(canvasObject, 10)
//     console.log(canvasObject)
//     canvasContext.canvas2.loadFromJSON(canvasObject,() => {
//       canvasContext.canvas2.setWidth(canvasObject.width)
//       canvasContext.canvas2.setHeight(canvasObject.height)
//       if (!hasPattern) {
//         canvasContext.canvas2.setOverlayImage(null)
//       }
//       canvasContext.canvas2.renderAll()
//     })
//
//   }
//
//   const canvasTimes = (canvasObj, times) => {
//     canvasObj.height = canvasObj.height * times
//     canvasObj.width = canvasObj.width * times
//     if (canvasObj.backgroundImage) {
//       canvasObj.backgroundImage.height = canvasObj.backgroundImage.height * times
//       canvasObj.backgroundImage.width = canvasObj.backgroundImage.width * times
//     }
//     if (canvasObj.overlayImage) {
//       canvasObj.overlayImage.scaleX = canvasObj.overlayImage.scaleX * times
//       canvasObj.overlayImage.scaleY = canvasObj.overlayImage.scaleY * times
//     }
//
//     canvasObj.objects.map((item)=>objectTimes(item, times))
//   }
//
//   const objectTimes = (obj, times) => {
//     if (obj.type === 'image') {
//       obj.scaleX = obj.scaleX * times
//       obj.scaleY = obj.scaleY * times
//       obj.top = obj.top * times
//       obj.left = obj.left * times
//     } else if (obj.type === 'group') {
//       obj.width = obj.width * times
//       obj.height = obj.height * times
//       obj.top = obj.top * times
//       obj.left = obj.left * times
//       obj.objects.map((item)=>objectTimes(item, times))
//     }
//   }
//
//
//   useEffect(()=> {
//     // setObjs(canvasContext.canvas.getObjects())
//     // console.log(11)
//     console.log('useEffect---')
//     console.log(objs)
//     console.log((canvasContext.canvas.getObjects()))
//     console.log('useEffect---end')
//   }, [objs])
//
//
//   const uploadJSON = (prop) => {
//     const file = prop.target.files[0];
//
//     if (window.FileReader) {
//       const reader = new FileReader()
//       reader.readAsText(file, "UTF-8")
//       reader.onloadend = (e) => {
//         const canvasObject = JSON.parse(e.target.result)
//         console.log(canvasObject)
//
//         canvasTimes(canvasObject, 0.1)
//         canvasContext.canvas.loadFromJSON(canvasObject, () => {
//           canvasContext.canvas.setWidth(canvasObject.width)
//           canvasContext.canvas.setHeight(canvasObject.height)
//
//           canvasContext.canvas.renderAll()
//           setObjs(canvasContext.canvas.getObjects())
//           console.log('setObjs')
//           console.log(canvasContext.canvas.getObjects())
//         })
//
//       }
//     }
//
//     prop.target.value = '';
//   }
//
//
//   const selectAllObjects = () => {
//     canvasContext.canvas.discardActiveObject();
//     var sel = new fabric.ActiveSelection(canvasContext.canvas.getObjects(), {
//       canvas: canvasContext.canvas,
//     });
//     canvasContext.canvas.setActiveObject(sel);
//     canvasContext.canvas.requestRenderAll();
//   }
//
//   const groupAll = () => {
//     canvasContext.canvas.discardActiveObject();
//     const sel = new fabric.ActiveSelection(canvasContext.canvas.getObjects(), {
//       canvas: canvasContext.canvas,
//     });
//     canvasContext.canvas.setActiveObject(sel).toGroup();
//     canvasContext.canvas.requestRenderAll();
//   }
//
//   return (
//     <>
//       <div>
//         <div style={{float: "right"}}>
//           {/*  {*/}
//           {/*    objs?.reverse().map((item,index) => (*/}
//           {/*        objectList(item, index)*/}
//           {/*    ))*/}
//           {/*  }*/}
//           <Lii target={objs}/>
//         </div>
//
//         <h1>{num}</h1>
//         <button id="btnNum" onClick={()=>setNum(num + 1)}>点击</button>
//         <canvas id="canvas" ref={canvasEl} style={{width: 1500, height: 1500}} />
//         {/*<canvas id="canvas"/>*/}
//         <button id="btn1" onClick={click}>点击</button>
//         <button id="btn2" onClick={span}>旋转</button>
//         <input type="file" id="upload" onChange={upload}/>
//         <input type="file" id="upload2" onChange={upload_overlay}/>
//         <button id="z-index-forward" onClick={ () => z_index_change("FORWARD")}>图层提升</button>
//         <button id="z-index-backward" onClick={ () => z_index_change("BACKWARD")}>图层下降</button>
//         <button id="z-index-front" onClick={ () => z_index_change("FRONT")}>图层置顶</button>
//         <button id="z-index-back" onClick={ () => z_index_change("BACK")}>图层置底</button>
//       </div>
//       <div>
//         <button id="btn-copy" onClick={copy}>复制</button>
//         <button id="ok" onClick={ () => outputData()}>输出数据信息</button>
//         <button id="btn-zoom" onClick={() => zoom(1)}>恢复比例</button>
//
//         <button id="btn-pan" onClick={pan}>移动画布</button>
//         <button id="btn-pan" onClick={group}>合并对象</button>
//         <button id="btn-pan" onClick={ungroup}>拆开对象</button>
//         <button id="btna" onClick={()=>{console.log(objs)}}>log</button>
//         <button id="btn-pan" onClick={selectAllObjects}>选择所有对象</button>
//
//       </div>
//       <div>
//         <button id="btn-save" onClick={()=>{save(false)}}>导出图片</button>
//         <button id="btn-save" onClick={()=>{save(true)}}>导出无版型图片</button>
//         <button id="btn-save" onClick={toJSON}>JSON</button>
//       </div>
//       <div>
//         <input type="file" id="uploadCanvas" onChange={newCanvasFromUpload}/>
//         {/*<input type="file" id="upload" onChange={upload}/>*/}
//         <button id="repos" onClick={rePos}>位置复原</button>
//       </div>
//       <div style={{display: "none"}}>
//         <canvas id="canvas2" ref={canvasEl2} />
//       </div>
//
//       {/*<button id="btn-save" onClick={loadJSON}>读取JSON</button>*/}
//       <button id="btn-save" onClick={toJSON2}>JSON</button>
//       <input type="file" id="uploadJSON" onChange={uploadJSON}/>读取JSON文件并赋值到小canvas
//
//
//       <button id="btn-f5" onClick={groupAll}>合并</button>
//       <button id="btna" onClick={()=>{console.log(canvasContext.canvas.toObject())}}>log2</button>
//       <div>
//         <input type="file" id="uploadNewPattern" onChange={uploadNewPattern}/> 读取新版型
//       </div>
//       <div>
//         <input type="file" id="uploadNewPattern2" onChange={uploadNewPattern2}/> 读取新版型
//       </div>
//     </>
//   )
// }
//
// export default App
