import './App.css'
import React, {useEffect, useRef, useState} from 'react';
import {fabric} from 'fabric';
import {Button, Col, Divider, Layout, Modal, Row, Space, Spin, Switch, Upload} from 'antd'
import {
    CaretDownOutlined,
    CaretUpOutlined, CopyOutlined,
    DeleteOutlined, PictureOutlined, SaveOutlined, UploadOutlined,
    VerticalAlignBottomOutlined,
    VerticalAlignTopOutlined
} from '@ant-design/icons'

const {Header, Content, Sider} = Layout;

const canvasContext = {'canvas': null, 'panning': false, 'canvas2': null, 'json': null}

fabric.Object.NUM_FRACTION_DIGITS = 100

const objStyle = {
    "one": {border: "2px solid black"},
    "group": {border: "2px solid red", overflow: "hidden"}
}

const selectObj = (index) => {
    canvasContext.canvas.discardActiveObject();
    // const len = canvasContext.canvas.getObjects().length;
    canvasContext.canvas.setActiveObject(canvasContext.canvas.getObjects()[index]);
    console.log('selectObj fun');
    canvasContext.canvas.renderAll();
}


const App = () => {
    const canvasEl = useRef(null);
    const canvasEl2 = useRef(null);
    const [objs, setObjs] = useState(null)
    const [mainStyle, setMainStyle] = useState({display: 'none'})

    const options = {
        width: 500,
        height: 500,
        // fireRightClick: true,
        // fireMiddleClick: true,
        stopContextMenu: true,
        backgroundColor: '#eeeeee',
        // backgroundImage: undefined,
    };

    const Lii = (prop) => {
        const target = prop.target
        if (target) {
            return target.map((item, index) => (
                objectList(item, index)
            )).reverse()
        } else {
            return null
        }

        // console.log('Lii', prop)
    }

    const objectList = (item, index, type = "one") => {
        let groupTag = null
        if (type === "group") {
            groupTag = <div style={{marginLeft: 263, marginTop: 13, backgroundColor: "white", width: 28}}>组合</div>
        }

        if (item._originalElement) {
            return (

                <div style={{height: 140, width: 295, marginBottom: -2, ...objStyle[type]}} key={index}
                     onClick={() => selectObj(index)}>
                    <div style={{
                        width: 140,
                        height: 136,
                        backgroundColor: "gray",
                        backgroundPosition: "center center",
                        backgroundImage: `url(${item._originalElement.currentSrc})`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "contain",
                        float: "left"
                    }}/>
                    <div style={{marginTop: 40, marginLeft: 150}}>
                        <Button icon={<VerticalAlignTopOutlined/>} onClick={(e) => {
                            z_index_change("FRONT", index);
                            e.stopPropagation()
                        }}/>
                        <Button icon={<CaretUpOutlined/>} onClick={(e) => {
                            z_index_change("FORWARD", index);
                            e.stopPropagation()
                        }}/>
                        <Button icon={<CaretDownOutlined/>} onClick={(e) => {
                            z_index_change("BACKWARD", index);
                            e.stopPropagation()
                        }}/>
                        <Button icon={<VerticalAlignBottomOutlined/>} onClick={(e) => {
                            z_index_change("BACK", index);
                            e.stopPropagation()
                        }}/>
                        <Button icon={<CopyOutlined/>} onClick={(e) => {
                            copy(index);
                            e.stopPropagation()
                        }}/>
                        <Button danger icon={<DeleteOutlined/>} onClick={(e) => {
                            selectObj(index);
                            del();
                            e.stopPropagation()
                        }}/>
                    </div>
                    {groupTag}
                </div>
            );
        } else {
            if (item._objects) {
                return objectList(item._objects[0], index, "group");
            }
        }
    }

    useEffect(() => {
        console.log("useEffect")
        // const canvas = new fabric.Canvas('canvas', options);
        // setCanvas(new fabric.Canvas('canvas', options));
        const canvas = new fabric.Canvas(canvasEl.current, options);
        const canvas2 = new fabric.Canvas(canvasEl2.current, options);
        setMainStyle({display: 'none'})
        // make the fabric.Canvas instance available to your app
        // updateCanvasContext(canvas);
        canvasContext.canvas = canvas
        canvasContext.canvas2 = canvas2

        return () => {
            console.log("destroy")
            // 销毁时调用 如初始化一些参数
            if (canvas) {
                canvas.dispose();
                canvasContext.canvas = null
                canvas2.dispose();
                canvasContext.canvas2 = null
            }
            setObjs(null)
            setMainStyle(null)
        }
    }, []);

    const upload = (prop) => {
        console.log(prop)
        // const filePath = prop.target.value
        // const fileName = prop.target.files[0].name
        // const file = prop.target.files[0]
        const file = prop.file
        // const extn = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase()
        showModal()
        if (window.FileReader) {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend = (e) => {
                const base64String = e.target.result
                fabric.Image.fromURL(base64String, (oImg) => {
                    oImg.scale(0.1);
                    canvasContext.canvas.add(oImg);
                    console.log(canvasContext.canvas.getObjects())
                    setObjs(() => {
                        return canvasContext.canvas.getObjects()
                    })
                    closeModal()
                });
            }
        }

        // prop.target.value = '';
    }

    const z_index_change = (option, objIndex) => {
        if (objIndex || objIndex === 0) {
            selectObj(objIndex)
        }
        console.log('objIndex', objIndex)

        let activeObj = canvasContext.canvas.getActiveObject();
        try {
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
        } catch (e) {

        }

        console.log('图层操作')
        setObjs(() => {
            return canvasContext.canvas.getObjects()
        })
        canvasContext.canvas.discardActiveObject()
        canvasContext.canvas.renderAll()
    }

    let _clipboard;
    const copy = (objIndex) => {
        if (objIndex || objIndex === 0) {
            selectObj(objIndex)
        }

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
                    _clipboard.forEachObject(function (obj) {
                        canvasContext.canvas.add(obj);
                    });
                    // this should solve the unselectability
                    _clipboard.setCoords();
                } else {
                    canvasContext.canvas.add(_clipboard);
                }

                canvasContext.canvas.setActiveObject(_clipboard);
                setObjs(() => {
                    return canvasContext.canvas.getObjects()
                })
                canvasContext.canvas.requestRenderAll();
            });

        }
    }

    useEffect(() => {
        let mouseDown = false;

        if (canvasContext.canvas) {
            console.log('on')
            canvasContext.canvas.on({
                // 滚轮放大缩小
                'mouse:wheel': opt => {
                    if (opt.e.altKey === true) {
                        const delta = opt.e.deltaY > 0 ? 100 : -100 // 读取滚轮操作
                        let zoom = canvasContext.canvas.getZoom()
                        zoom *= 0.999 ** delta
                        zoom = zoom < 20 ? zoom : 20;
                        zoom = zoom > 0.01 ? zoom : 0.01;

                        canvasContext.canvas.zoomToPoint(
                            {
                                x: opt.e.offsetX,
                                y: opt.e.offsetY
                            },
                            zoom
                        )
                    }
                },
                'mouse:down': opt => {
                    // this.panning = true;
                    mouseDown = true
                    if (!canvasContext.panning) {
                        getElement(opt)
                    }
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


    const pan = () => {
        canvasContext.canvas.discardActiveObject();
        // canvasContext.canvas.Object.prototype.selectable = false
        canvasContext.canvas.selection = !canvasContext.canvas.selection;
        canvasContext.panning = !canvasContext.panning

        console.log("p", canvasContext.panning, "sel", canvasContext.canvas.selection)
    }

    const group = () => {
        if (!canvasContext.canvas.getActiveObject()) {
            return;
        }
        if (canvasContext.canvas.getActiveObject().type !== 'activeSelection') {
            return;
        }
        canvasContext.canvas.getActiveObject().toGroup();
        setObjs(() => {
            return canvasContext.canvas.getObjects()
        })
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
        setObjs(() => {
            return canvasContext.canvas.getObjects()
        })
        // canvasContext.canvas.renderAll()
        canvasContext.canvas.requestRenderAll();
    }

    let isSaving = false
    const save = (hasPattern) => {
        if (isSaving) {
            return
        } else {
            isSaving = true
        }
        // showModal()
        rePos()

        const canvasObject = canvasContext.canvas.toJSON(['width', 'height'])
        canvasTimes(canvasObject, 10)
        // closeModal()
        // console.log(JSON.stringify(canvasObject))
        // console.log(canvasObject)

        canvasContext.canvas2.loadFromJSON(canvasObject, () => {
            canvasContext.canvas2.setWidth(canvasObject.width)
            canvasContext.canvas2.setHeight(canvasObject.height)
            // console.log(hasPattern, !hasPattern)
            if (hasPattern) {
                canvasContext.canvas2.setOverlayImage(null)
            }
            canvasContext.canvas2.renderAll()

            const url = canvasContext.canvas2.toDataURL({
                format: "jpeg",
                quality: 1
            })

            const a = document.createElement('a')
            a.href = url
            a.download = `image.jpg`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            console.log("loaded")
            // closeModal()
            isSaving = false
        })

    }

    const newCanvasFromUpload = (prop) => {
        showModal()
        console.log(prop)
        // const objectURL = URL.createObjectURL(prop.target.files[0]);
        // const objectURL = URL.createObjectURL(prop.file);
        // const img = new Image();
        // img.src = objectURL;

        // const filePath = prop.target.value
        // const fileName = prop.target.files[0].name
        // const file = prop.target.files[0]
        const file = prop.file
        // const extn = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase()

        if (window.FileReader) {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend = (e) => {
                const base64String = e.target.result
                // console.log(base64String)
                fabric.Image.fromURL(base64String, (oImg) => {
                    // oImg.scale(0.1);
                    // canvasContext.canvas.add(oImg);
                    // console.log(canvasContext.canvas.getObjects())
                    // setObjs(()=>{return canvasContext.canvas.getObjects()})

                    canvasContext.canvas.setWidth(oImg.width / 10)
                    canvasContext.canvas.setHeight(oImg.height / 10)

                    const bg = new fabric.Rect({
                        width: oImg.width / 10,
                        height: oImg.height / 10,
                        fill: 'white',
                        evented: false,
                        selectable: false
                    });
                    bg.canvas = canvasContext.canvas;
                    canvasContext.canvas.backgroundImage = bg;
                    // canvasContext.canvas.renderAll()

                    canvasContext.canvas.setOverlayImage(oImg, canvasContext.canvas.renderAll.bind(canvasContext.canvas), {
                        scaleX: 0.1,
                        scaleY: 0.1
                    });
                    canvasContext.canvas.renderAll();

                    setMainStyle(null)
                    closeModal()
                });
            }
        }

    }

    // 读取新版型并按宽度缩放原图
    const uploadNewPattern = (prop) => {
        showModal()
        console.log(prop)
        // const objectURL = URL.createObjectURL(prop.target.files[0]);
        // const img = new Image();
        // img.src = objectURL;

        // const file = prop.target.files[0]
        const file = prop.file;

        if (window.FileReader) {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend = (e) => {
                const base64String = e.target.result
                fabric.Image.fromURL(base64String, (oImg) => {
                    canvasContext.canvas.discardActiveObject();

                    const scaleX = (oImg.width / 10) / canvasContext.canvas.width
                    // const scaleY = (oImg.height/10) / canvasContext.canvas.height
                    // 以宽度为默认花纹缩放比例
                    const scaleY = (oImg.width / 10) / canvasContext.canvas.width

                    if (canvasContext.canvas.getObjects()) {
                        let sel = new fabric.ActiveSelection(canvasContext.canvas.getObjects(), {
                            canvas: canvasContext.canvas,
                        });
                        canvasContext.canvas.setActiveObject(sel);
                        canvasContext.canvas.getActiveObject().toGroup();
                        canvasContext.canvas.discardActiveObject();

                        const group = canvasContext.canvas.getObjects()[0]
                        group.top = group.top * scaleY
                        group.left = group.left * scaleX
                        group.scaleX = scaleX
                        group.scaleY = scaleY

                        group.toActiveSelection()

                        // sel = new fabric.ActiveSelection(canvasContext.canvas.getObjects(), {
                        //   canvas: canvasContext.canvas,
                        // });
                        // canvasContext.canvas.setActiveObject(sel);
                        // canvasContext.canvas.getActiveObject().
                    }

                    canvasContext.canvas.setWidth(oImg.width / 10)
                    canvasContext.canvas.setHeight(oImg.height / 10)

                    const bg = new fabric.Rect({
                        width: oImg.width / 10,
                        height: oImg.height / 10,
                        fill: 'white',
                        evented: false,
                        selectable: false
                    });
                    bg.canvas = canvasContext.canvas;
                    canvasContext.canvas.backgroundImage = bg;

                    canvasContext.canvas.setOverlayImage(oImg, canvasContext.canvas.renderAll.bind(canvasContext.canvas), {
                        scaleX: 0.1,
                        scaleY: 0.1
                    });

                    // if (canvasContext.canvas.getObjects()) {
                    //    const sel = new fabric.ActiveSelection(canvasContext.canvas.getObjects(), {
                    //      canvas: canvasContext.canvas,
                    //    });
                    //    canvasContext.canvas.setActiveObject(sel);
                    //    canvasContext.canvas.getActiveObject().toActiveSelection();
                    //
                    //    canvasContext.canvas.discardActiveObject();
                    //  }

                    setObjs(() => {
                        return canvasContext.canvas.getObjects()
                    })
                    canvasContext.canvas.renderAll();
                    closeModal()
                });
            }
        }
    }

    // 读取新版型并居中延伸
    const uploadNewPattern2 = (prop) => {
        showModal()
        console.log(prop)
        // const objectURL = URL.createObjectURL(prop.target.files[0]);
        // const img = new Image();
        // img.src = objectURL;

        // const file = prop.target.files[0]

        const file = prop.file;

        if (window.FileReader) {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend = (e) => {
                const base64String = e.target.result
                fabric.Image.fromURL(base64String, (oImg) => {
                    canvasContext.canvas.discardActiveObject();

                    const objects = {"obj": null}
                    if (canvasContext.canvas.getObjects()) {
                        const sel = new fabric.ActiveSelection(canvasContext.canvas.getObjects(), {
                            canvas: canvasContext.canvas,
                        });
                        canvasContext.canvas.setActiveObject(sel);
                        canvasContext.canvas.getActiveObject().toGroup();
                        canvasContext.canvas.discardActiveObject();

                        objects.obj = canvasContext.canvas.getObjects()[0]
                        objects.obj.left = oImg.width / 10 / 2 - (objects.obj.width - objects.obj.left) / 2
                        objects.obj.top = oImg.height / 10 / 2 - (objects.obj.height - objects.obj.top) / 2

                        objects.obj.toActiveSelection()
                    }

                    canvasContext.canvas.setWidth(oImg.width / 10)
                    canvasContext.canvas.setHeight(oImg.height / 10)

                    const bg = new fabric.Rect({
                        width: oImg.width / 10,
                        height: oImg.height / 10,
                        fill: 'white',
                        evented: false,
                        selectable: false
                    });
                    bg.canvas = canvasContext.canvas;
                    canvasContext.canvas.backgroundImage = bg;

                    canvasContext.canvas.setOverlayImage(oImg, canvasContext.canvas.renderAll.bind(canvasContext.canvas), {
                        scaleX: 0.1,
                        scaleY: 0.1
                    });

                    // if (canvasContext.canvas.getObjects()) {
                    //    const sel = new fabric.ActiveSelection(canvasContext.canvas.getObjects(), {
                    //      canvas: canvasContext.canvas,
                    //    });
                    //    canvasContext.canvas.setActiveObject(sel);
                    //    canvasContext.canvas.getActiveObject().toActiveSelection();
                    //
                    //    canvasContext.canvas.discardActiveObject();
                    //  }

                    setObjs(() => {
                        return canvasContext.canvas.getObjects()
                    })
                    canvasContext.canvas.renderAll();
                    closeModal()
                });
            }
        }
    }

    const toJSON = () => {
        console.log(canvasContext.canvas.toJSON(['width', 'height']))
    }

    const toJSON2 = () => {
        if (isSaving) {
            return
        } else {
            isSaving = true
        }
        // showModal()
        const canvasObject = canvasContext.canvas.toJSON(['width', 'height'])
        canvasTimes(canvasObject, 10)
        // console.log(JSON.stringify(canvasObject))

        const a = document.createElement('a')

        const blob = new Blob([JSON.stringify(canvasObject)])
        a.href = URL.createObjectURL(blob)
        a.download = `save.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        // closeModal()
        isSaving = false
    }


    const rePos = () => {
        canvasContext.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    }

    const loadJSON = (hasPattern) => {

    }

    const canvasTimes = (canvasObj, times) => {
        canvasObj.height = canvasObj.height * times
        canvasObj.width = canvasObj.width * times
        if (canvasObj.backgroundImage) {
            canvasObj.backgroundImage.height = canvasObj.backgroundImage.height * times
            canvasObj.backgroundImage.width = canvasObj.backgroundImage.width * times
        }
        if (canvasObj.overlayImage) {
            canvasObj.overlayImage.scaleX = canvasObj.overlayImage.scaleX * times
            canvasObj.overlayImage.scaleY = canvasObj.overlayImage.scaleY * times
        }

        canvasObj.objects.map((item) => objectTimes(item, times))
    }

    const objectTimes = (obj, times) => {
        if (obj.type === 'image') {
            obj.scaleX = obj.scaleX * times
            obj.scaleY = obj.scaleY * times
            obj.top = obj.top * times
            obj.left = obj.left * times
        } else if (obj.type === 'group') {
            obj.width = obj.width * times
            obj.height = obj.height * times
            obj.top = obj.top * times
            obj.left = obj.left * times
            obj.objects.map((item) => objectTimes(item, times))
        }
    }


    useEffect(() => {
        // setObjs(canvasContext.canvas.getObjects())
        // console.log(11)
        console.log('useEffect---')
        console.log(objs)
        console.log((canvasContext.canvas.getObjects()))
        console.log('useEffect---end')
        canvasContext.canvas.renderAll()
    }, [objs])


    const uploadJSON = (prop) => {
        // const file = prop.target.files[0];
        showModal()
        const file = prop.file;

        if (window.FileReader) {
            const reader = new FileReader()
            reader.readAsText(file, "UTF-8")
            reader.onloadend = (e) => {
                const canvasObject = JSON.parse(e.target.result)
                console.log(canvasObject)

                canvasTimes(canvasObject, 0.1)
                canvasContext.canvas.loadFromJSON(canvasObject, () => {
                    canvasContext.canvas.setWidth(canvasObject.width)
                    canvasContext.canvas.setHeight(canvasObject.height)

                    canvasContext.canvas.renderAll()
                    setObjs(() => {
                        return canvasContext.canvas.getObjects()
                    })
                    console.log('setObjs')
                    console.log(canvasContext.canvas.getObjects())
                })
                setMainStyle(null)
                closeModal()
            }
        }
    }


    const selectAllObjects = () => {
        canvasContext.canvas.discardActiveObject();
        const sel = new fabric.ActiveSelection(canvasContext.canvas.getObjects(), {
            canvas: canvasContext.canvas,
        });
        canvasContext.canvas.setActiveObject(sel);
        canvasContext.canvas.requestRenderAll();
    }

    const selectOff = () => {
        canvasContext.canvas.discardActiveObject();
        canvasContext.canvas.requestRenderAll();
    }

    const loopOnObjects = (e) => {
        let mouse = canvasContext.canvas.getPointer(e.e, false);
        let point = new fabric.Point(mouse.x, mouse.y)

        let count = 0;
        canvasContext.canvas.getObjects().forEach((object, index) => {
            if (object.containsPoint(point)) {
                count++;
            }
        });
    }
    const getElement = (e) => {
        loopOnObjects(e);
    }

    const groupAll = () => {
        canvasContext.canvas.discardActiveObject();
        const sel = new fabric.ActiveSelection(canvasContext.canvas.getObjects(), {
            canvas: canvasContext.canvas,
        });
        canvasContext.canvas.setActiveObject(sel).toGroup();
        canvasContext.canvas.requestRenderAll();
    }

    const del = () => {
        canvasContext.canvas.remove(canvasContext.canvas.getActiveObject());
        canvasContext.canvas.discardActiveObject();
        setObjs(() => {
            return canvasContext.canvas.getObjects()
        })
        canvasContext.canvas.requestRenderAll();
    }

    const checkSelect = () => {
        console.log(canvasContext.canvas.getActiveObject())
    }

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        console.log('showModal')
        setIsModalOpen(() => true);
    };

    const closeModal = () => {
        console.log('closeModal')
        setIsModalOpen(() => false);
    };

    return (
        <Layout>
            <Header style={{backgroundColor: "rgb(170 182 209)", position: "sticky", top: 0, zIndex: 1}}>
                {/*<Space wrap id="hello">*/}
                <Row>

                    <Col span={9}>
                        <Space wrap>
                            <Upload customRequest={newCanvasFromUpload} showUploadList={false}
                                    accept="image/png, image/jpeg">
                                <Button type="primary" size="small">导入排版新建画布</Button>
                            </Upload>


                            <Upload customRequest={uploadJSON} showUploadList={false} accept=".json">
                                <Button size="small">导入JSON存档文件</Button>
                            </Upload>

                            <Button size="small" id="btn-save" onClick={toJSON2} type="primary" ghost
                                    icon={<SaveOutlined/>}>保存为JSON存档文件</Button>
                        </Space>
                    </Col>

                    <Col span={6} style={{textAlign: "center"}}>
                        <Space wrap>
                            <Button type="primary" size="small" ghost id="btn-save-with-pattern" onClick={() => {
                                save(false)
                            }} icon={<PictureOutlined/>}>导出带版型图片</Button>
                            <Button type="primary" size="small" ghost id="btn-save-without-pattern" onClick={() => {
                                save(true)
                            }} icon={<PictureOutlined/>}>导出无版型图片</Button>

                        </Space>
                    </Col>


                    {/*<Divider type="vertical"/>*/}

                    <Col span={9} style={{textAlign: "right"}}>
                        <Space wrap>
                            <Upload customRequest={uploadNewPattern} showUploadList={false} accept="image/png, image/jpeg">
                                <Button size="small" shape="round" icon={<UploadOutlined/>}>读取新版型图, 宽度比例缩放</Button>
                            </Upload>
                            <Upload customRequest={uploadNewPattern2} showUploadList={false} accept="image/png, image/jpeg">
                                <Button size="small" shape="round" icon={<UploadOutlined/>}>读取新版型图，花纹居中</Button>
                            </Upload>
                        </Space>
                    </Col>
                </Row>

                {/*</Space>*/}

            </Header>
            <Layout>
                <Sider trigger={null} width={300}
                       style={{backgroundColor: "#aaaaaa", border: "5px #888888 solid", borderRight: "0"}}>
                    <Header id="tuceng-header">图层列表</Header>
                    <div style={{float: "left", overflowY: "auto", height: "calc(100vh - 128px)"}}>
                        <Lii target={objs}/>
                    </div>
                </Sider>
                <Layout style={{border: "5px #888888 solid"}}>
                    <Modal title="Loading" open={isModalOpen} footer={null} closable={false}
                           style={{textAlign: "center"}}>
                        <Spin/>
                    </Modal>
                    <div id="main">
                        <Header id="tools-header">
                            <Space wrap>
                                <Upload customRequest={upload} showUploadList={false}>
                                    <Button size="small">导入图片</Button>
                                </Upload>

                                <Button size="small" id="btn-group" onClick={group}>合并图层</Button>
                                <Button size="small" id="btn-ungroup" onClick={ungroup}>拆开图层</Button>
                                <Button size="small" id="btn-select-all" onClick={selectAllObjects}>选择所有</Button>
                                <Button size="small" id="btn-select-off" onClick={selectOff}>取消选中</Button>

                                <Button size="small" danger onClick={del} icon={<DeleteOutlined/>}> 删除选中</Button>
                            </Space>
                        </Header>

                        <Header id="tools-header2">
                            <Space wrap>
                                <Switch id="btn-pan" checkedChildren="移动画布" unCheckedChildren="移动画布" onChange={pan}/>
                                <Button id="repos" size="small" onClick={rePos}>位置复原</Button>
                            </Space>
                        </Header>
                        <div style={{paddingTop: "5px", overflow:"auto", height:"calc(100vh - 180px)", width:"calc(100vw - 310px)"}}>
                            {/*<div style={{float: "left"}}>*/}
                            {/*    <Lii target={objs}/>*/}
                            {/*</div>*/}
                            <canvas id="canvas" ref={canvasEl} style={{width: 1500, height: 1500}}/>
                        </div>
                    </div>
                    <div style={{display: "none"}}>
                        <canvas id="canvas2" ref={canvasEl2}/>
                    </div>
                </Layout>
            </Layout>


        </Layout>
    )
}

export default App
