import React, {
  useEffect,
  forwardRef,
  useRef,
  useState,
  useImperativeHandle,
  useCallback,
  useLayoutEffect,
} from 'react';
import { message, Spin } from 'antd';
import zip from 'zip-js-esm';
import { fs } from './zip-fs.js';
import classnames from 'classnames';
//import EditForm from '../EditForm'
interface PointConfig {
  [name: string]: any;
}
import {
  Vector3,
  AnimationClip,
  AnimationMixer,
  sRGBEncoding,
  LoaderUtils,
  LoadingManager,
  REVISION,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  AmbientLight,
  DirectionalLight,
  Light,
  Object3D,
  Camera,
  AnimationAction,
  Box3,
} from 'three';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {
  MAP_NAMES,
  AMBIENTCOLOR,
  AMBIENTINTENSITY,
  DIRECTINTENSITY,
  DIRECTCOLOR,
  EXPORSURE,
  BASE_ASPECT,
  TIME_LEN,
} from './constant';
import s from './index.less';

zip.useWebWorkers = false;
const MANAGER = new LoadingManager();
const THREE_PATH = `https://unpkg.com/three@0.${REVISION}.x`;
const DRACO_LOADER = new DRACOLoader(MANAGER).setDecoderPath(
  `${THREE_PATH}/examples/js/libs/draco/gltf/`
);
const KTX2_LOADER = new KTX2Loader(MANAGER).setTranscoderPath(
  `${THREE_PATH}/examples/js/libs/basis/`
);

interface ViewerProps {
  curType: 'readonly' | 'edit';
  modelFile: File;
  pointConfig: PointConfig;
  actions: { value: number; label: string; data?: any }[];
  setActions: Function;
  setcurType: Function;
  onChange: Function;
  onBeforeSave?: (prev: PointConfig, next: PointConfig) => Promise<boolean>;
  setPointConfig: (cb: ((v: PointConfig) => PointConfig) | PointConfig) => void;
  beforeEditValueRef: React.MutableRefObject<PointConfig>;
  initValueRef: React.MutableRefObject<PointConfig>;
  curTypeRef: React.MutableRefObject<'readonly' | 'edit'>;
}

export interface ViewerInstance {
  genPreviewImg: () => Promise<void>;
}

const Viewer = (
  {
    modelFile,
    curType,
    setPointConfig,
    onChange,
    curTypeRef
  }: ViewerProps,
  ref
) => {
  const getCanvasInfo = useCallback(() => {
    let width: number;
    let height: number;
    const { clientHeight, clientWidth } = window.document.body;
    const windowAspect = clientWidth / clientHeight;
    if (windowAspect === BASE_ASPECT) {
      width = clientWidth;
      height = clientHeight;
    } else if (windowAspect > BASE_ASPECT) {
      height = clientHeight;
      width = height * BASE_ASPECT;
    } else {
      width = clientWidth;
      height = width / BASE_ASPECT;
    }
    // width = 1280
    // height = 720
    return {
      width,
      height,
    };
  }, [curType]);

  const [canvasInfo, setCanvasInfo] = useState(getCanvasInfo());

  const [genPriviewImgIng, setgenPriviewImgIng] = useState(false);

  const prevModelFile = useRef<Map<string, File>>();

  const hasInitRef = useRef(false);
  const [status, setStatus] = useState('uninitialized');
  const rootRef = useRef<HTMLDivElement>();
  const mainSceneRef = useRef<Object3D>();
  const rendererRef = useRef<WebGLRenderer>();
  const controlsRef = useRef<OrbitControls>();
  const lightRef = useRef<Light[]>([]);

  const requestRef = useRef<Function>();
  const aniIdRef = useRef<number>();
  const mixerRef = useRef<AnimationMixer>();
  const clipsRef = useRef<AnimationClip[]>();
  const lastTimeRef = useRef(new Date().getTime());
  const prevtTimeRef = useRef<number>(0);
  const canvasBoxRef = useRef<HTMLDivElement>();
  const curActionRef = useRef<string | AnimationClip>();
  const sceneRef = useRef<Scene>(new Scene());
  const defaultCameraRef = useRef<PerspectiveCamera>();
  const activeCameraRef = useRef<Camera>(defaultCameraRef.current);
  const actionRef = useRef<AnimationAction>();

  useEffect(() => {
    initFunc();
    return () => {
      requestRef.current && requestRef.current();
      window.onresize = null;
    };
  }, []);

  useEffect(() => {
    setCanvasInfo(getCanvasInfo());
  }, [getCanvasInfo]);

  useLayoutEffect(() => {
    defaultCameraRef.current && canvasBoxRef.current && resize();
  }, [canvasInfo]);

  const genPreviewImg = useCallback(async (): Promise<void> => {
    setgenPriviewImgIng(true);
    try {
      const renderer = rendererRef.current;
      if (!renderer) {
        throw new Error();
      }
      const blob = await new Promise<Blob>((res) => {
        render();
        renderer.domElement.toBlob(
          (data) => {
            res(data);
          },
          'image/png',
          1
        );
      });
      const index = modelFile.name.lastIndexOf('.');
      const name = modelFile.name.slice(0, index);
      const file = new File([blob], `preivew-${name}.png`);
      const formData = new FormData();
      formData.append('file', file);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    } finally {
      requestRef.current = undefined;
      setgenPriviewImgIng(false);
    }
  }, [modelFile]);

  useImperativeHandle(
    ref,
    () => {
      return {
        genPreviewImg,
      };
    },
    [genPreviewImg]
  );

  const resize = useCallback(() => {
    const { clientHeight, clientWidth } = canvasBoxRef.current;
    // console.log('resize+++++', clientHeight, clientWidth);

    const camera = defaultCameraRef.current;
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
    // if (vignertteRef.current) {
    //   vignertteRef.current.style({ aspect: camera.aspect });
    // }
    rendererRef.current.setSize(clientWidth, clientHeight);
  }, []);

  const render = useCallback(() => {
    if (rendererRef.current) {
      rendererRef.current.render(sceneRef.current, defaultCameraRef.current);
    }
  }, []);

  const onListenCanvas = useCallback(() => {
    if (curTypeRef.current === 'readonly') return;
    const lastTime = lastTimeRef.current;
    const thisTime = new Date().getTime();
    // const c = defaultCameraRef.current
    // if (c) {
    //   console.log('camera', c.getFocalLength(), c.getEffectiveFOV(), c.filmGauge, c.scale, c.filmOffset);

    // }
    // const a = controlsRef.current
    // if (a) {
    //   console.log('control', a, a.center, a.getDistance(), a.zoomO,);

    // }
    if (thisTime % TIME_LEN < lastTime % TIME_LEN) {
      if (activeCameraRef.current) {
        const { x, y, z } = activeCameraRef.current.position;
        // console.log('cameraPos', [x, y, z], y.toString());
        setPointConfig((pre) => ({
          ...pre,
          cameraPositionX: x,
          cameraPositionY: y,
          cameraPositionZ: z,
        }));
      }
      if (controlsRef.current) {
        const { x, y, z } = controlsRef.current.target;
        // console.log('targetPos', [x, y, z]);
        setPointConfig((pre) => ({
          ...pre,
          focusPositionX: x,
          focusPositionY: y,
          focusPositionZ: z,
        }));
      }
    }
    lastTimeRef.current = thisTime;
  }, []);

  const animate = useCallback((time) => {
    aniIdRef.current = requestAnimationFrame(animate);
    const dt = (time - prevtTimeRef.current) / 1000;
    controlsRef.current.update();
    mixerRef.current &&
      curActionRef.current !== 'none' &&
      mixerRef.current.update(dt);
    render();
    prevtTimeRef.current = time;
  }, []);

  const initFunc = useCallback(() => {
    console.log(
      'initFunc',
      rendererRef.current,
      hasInitRef.current,
      defaultCameraRef.current,
      controlsRef.current
    );
    try {
      if (!hasInitRef.current) {
        if (!defaultCameraRef.current) {
          const camera = new PerspectiveCamera(
            43,
            canvasBoxRef.current.clientWidth /
              canvasBoxRef.current.clientHeight,
            0.01,
            1000
          );
          defaultCameraRef.current = camera;
          activeCameraRef.current = camera;
          sceneRef.current.add(camera);
        }
        if (!rendererRef.current) {
          const renderer = new WebGLRenderer({ antialias: true });
          rendererRef.current = renderer;
          const updateRenderer = () => {
            renderer.physicallyCorrectLights = true;
            renderer.outputEncoding = sRGBEncoding;
            renderer.setClearColor(0xcccccc);
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(
              canvasBoxRef.current.clientWidth,
              canvasBoxRef.current.clientHeight
            );
          };
          updateRenderer();
        }
        canvasBoxRef.current.addEventListener('mousemove', onListenCanvas);
        defaultCameraRef.current.position.set(0, 0, 3);

        if (!controlsRef.current) {
          // console.log('rendererRef.current.domElement', rendererRef.current.domElement);

          const controls = new OrbitControls(
            defaultCameraRef.current,
            rendererRef.current.domElement
          );
          controlsRef.current = controls;
          controls.autoRotate = false;
          controls.autoRotateSpeed = -10;
          controls.screenSpacePanning = true;
          controls.addEventListener('change', render);
          // controls.minDistance = 2;
          // controls.maxDistance = 10;
          // window.addEventListener('resize', onWindowResize);
        }

        // if (vignertteRef.current) {
        //   const bg = createBackground({
        //     aspect: BASE_ASPECT,
        //     // clearColor: 'rgb(51,51,51)',
        //     grainScale: IS_IOS ? 0 : 0.001, // mattdesl/three-vignette-background#1
        //     colors: [BGCOLOR1, BGCOLOR2]
        //   })
        //   bg.name = 'Vignette';
        //   bg.renderOrder = -1;
        //   vignertteRef.current = bg
        // }
        canvasBoxRef.current.appendChild(rendererRef.current.domElement);
        // canvasBoxRef.current.addEventListener('resize', resize)
        aniIdRef.current = requestAnimationFrame(animate);
        hasInitRef.current = true;
        setStatus('inited');
      }
    } catch (error) {
      setStatus('fail');
      // message.error('webgl 初始化失败！')
      console.log('webgl 初始化失败！', error);
      if (defaultCameraRef.current) {
        if (sceneRef.current.children.includes(defaultCameraRef.current)) {
          sceneRef.current.remove(defaultCameraRef.current);
        }
        defaultCameraRef.current = undefined;
      }

      if (rendererRef.current) {
        if (
          rendererRef.current.domElement &&
          [...(canvasBoxRef.current.children as any)].includes(
            rendererRef.current.domElement
          )
        ) {
          canvasBoxRef.current.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current = undefined;
      }
      if (canvasBoxRef.current) {
        canvasBoxRef.current.removeEventListener('mousemove', onListenCanvas);
      }
      if (aniIdRef.current) {
        cancelAnimationFrame(aniIdRef.current);
      }
      controlsRef.current = undefined;
    }
  }, []);

  useEffect(() => {
    status === 'inited' && handlModelFile(modelFile);
  }, [modelFile, status]);

  const handlModelFile = useCallback(async (originFile) => {
    // if ((originFile === prevModelFile.current) || !originFile || !hasInitRef.current) {
    //   return
    // }
    const tmpMap = new Map();
    try {
      const name = originFile.name;
      const isZip = name.endsWith('.zip');
      if (!isZip) {
        tmpMap.set(name, originFile);
      } else {
        await new Promise<void>((res, rej) => {
          const pending = [];
          const archive = new fs.FS();
          // const rightStart = modelFile.name.split('.')[0]
          const traverse = (node: {
            directory: any;
            children: any[];
            name: string[];
            getData: (arg0: any, arg1: (blob: any) => void) => void;
            getFullname: () => any;
          }) => {
            // console.log('node', node);
            if (node.directory) {
              node.children.forEach(traverse);
            } else if (node.name[0] !== '.') {
              pending.push(
                new Promise<void>((resolve) => {
                  node.getData(new zip.BlobWriter(), (blob: { name: any }) => {
                    blob.name = node.name;
                    tmpMap.set(node.getFullname(), blob);
                    resolve();
                  });
                })
              );
            }
          };

          archive.importBlob(
            originFile,
            () => {
              traverse((archive as any).root);
              Promise.all(pending).then(() => {
                res();
              });
            },
            (err: any) => {
              console.log('archive.importBlob -error', err);
              rej(err);
            }
          );
        });
      }
      prevModelFile.current = originFile;
      await handleFileMap(tmpMap);
    } catch (error) {
      message.error('文件加载错误');
      console.log('handlModelFile', error);
    }
  }, []);

  const handleFileMap = useCallback(async (fileMap) => {
    try {
      let rootFile: any;
      let rootPath: any;
      Array.from(fileMap).forEach(([path, file]) => {
        if (file.name.match(/\.(gltf|glb)$/)) {
          rootFile = file;
          rootPath = path.replace(file.name, '');
        }
      });
      const fileURL =
        typeof rootFile === 'string' ? rootFile : URL.createObjectURL(rootFile);

      await loadSource(fileURL, rootPath, fileMap);
      if (typeof rootFile === 'object') URL.revokeObjectURL(fileURL);
      console.timeEnd('load');
    } catch (error) {
      console.log('handleFileMap -error', error);
    }
  }, []);

  const loadSource = useCallback(
    async (url, rootPath, assetMap) =>
      new Promise((res, rej) => {
        const baseURL = LoaderUtils.extractUrlBase(url);
        return new Promise((res, rej) => {
          const blobURLs = [];
          MANAGER.setURLModifier((...data) => {
            const [url, path] = data as any;
            // URIs in a glTF file may be escaped, or not. Assume that assetMap is
            // from an un-escaped source, and decode all URIs before lookups.
            // See: https://github.com/donmccurdy/three-gltf-viewer/issues/146
            const normalizedURL =
              rootPath +
              decodeURI(url)
                .replace(baseURL, '')
                .replace(/^(\.?\/)/, '');

            if (assetMap.has(normalizedURL)) {
              const blob = assetMap.get(normalizedURL);
              const blobURL = URL.createObjectURL(blob);
              blobURLs.push(blobURL);
              return blobURL;
            }

            return (path || '') + url;
          });
          const loader = new GLTFLoader(MANAGER)
            .setCrossOrigin('anonymous')
            .setDRACOLoader(DRACO_LOADER)
            .setKTX2Loader(KTX2_LOADER.detectSupport(rendererRef.current))
            .setMeshoptDecoder(MeshoptDecoder);

          loader.load(
            url,
            (gltf) => {
              const scene = gltf.scene || gltf.scenes[0];
              const clips = gltf.animations || [];
              const model = gltf.scene;
              model.position.set( 1, 1, 0 );
              model.scale.set( 0.02, 0.02, 0.02 );
              if (!scene) {
                // Valid, but not supported by this viewer.
                throw new Error(
                  'This model contains no scene, and cannot be viewed here. However,' +
                    ' it may contain individual 3D resources.'
                );
              }
              setContent(scene, clips);
              blobURLs.forEach(URL.revokeObjectURL);
              // See: https://github.com/google/draco/issues/349
              // DRACOLoader.releaseDecoderModule();
              res(gltf);
            },
            undefined,
            rej
          );
          window.onresize = function () {

            defaultCameraRef.current.aspect = canvasBoxRef.current.clientWidth / canvasBoxRef.current.clientHeight;
            defaultCameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize( canvasBoxRef.current.clientWidth, canvasBoxRef.current.clientHeight );
    
          };
        });
      }),
    []
  );

  /**
   * @param {Three.Object3D} object
   * @param {Array<Three.AnimationClip>} object
   */
  const setContent = useCallback((object: Object3D, clips) => {
    clear();
    const camera = defaultCameraRef.current;
    const control = controlsRef.current;
    const box = new Box3().setFromObject(object);
    const size = box.getSize(new Vector3()).length();
    const center = box.getCenter(new Vector3());
    control.reset();
    object.position.x += object.position.x - center.x;
    object.position.y += object.position.y - center.y;
    object.position.z += object.position.z - center.z;

    control.maxDistance = size * 10;
    camera.near = size / 100;
    camera.far = size * 100;
    camera.updateProjectionMatrix();
    camera.position.copy(center);
    camera.position.x += 50 / 2.0;
    camera.position.y += 50 / 5.0;
    camera.position.z += 50 / 2.0;
    camera.lookAt(center);
    setPointConfig((pre) => ({
      ...pre,
      cameraPositionX: camera.position.x,
      cameraPositionY: camera.position.y,
      cameraPositionZ: camera.position.z,
      focusPositionX: controlsRef.current.target.x,
      focusPositionY: controlsRef.current.target.y,
      focusPositionZ: controlsRef.current.target.z,
    }));
    controlsRef.current.saveState();
    sceneRef.current.add(object);
    mainSceneRef.current = object;
    object.traverse((node) => {
      if ((node as any).isLight) {
      } else if ((node as any).isMesh) {
        // TODO(https://github.com/mrdoob/three.js/pull/18235): Clean up.
        (node as any).material.depthWrite = !(node as any).material.transparent;
      }
    });
    setClips(clips);
    updateLights();
    updateGUI();
    // updateEnvironment()
    updateTextureEncoding();
  }, []);

  const setClips = useCallback((clips: AnimationClip[]) => {
    const mixer = mixerRef.current;
    if (mixer) {
      mixer.stopAllAction();
      mixer.uncacheRoot(mixer.getRoot());
      mixerRef.current = undefined;
    }
    clipsRef.current = clips;
    if (!clipsRef.current.length) return;
    mixerRef.current = new AnimationMixer(mainSceneRef.current);
  }, []);

  const addLights = useCallback(() => {
    const light1 = new AmbientLight(AMBIENTCOLOR, AMBIENTINTENSITY);
    light1.name = 'ambient_light';
    defaultCameraRef.current.add(light1);

    const light2 = new DirectionalLight(DIRECTCOLOR, DIRECTINTENSITY);
    light2.position.set(0.5, 0, 0.866); // ~60º
    light2.name = 'main_light';
    defaultCameraRef.current.add(light2);

    lightRef.current.push(light1, light2);
  }, []);
  const updateLights = useCallback(() => {
    const lights = lightRef.current;
    if (!lights.length) {
      addLights();
    }
    rendererRef.current.toneMappingExposure = EXPORSURE;
    if (lights.length === 2) {
      lights[0].intensity = AMBIENTINTENSITY;
      lights[0].color.setHex(AMBIENTCOLOR);
      lights[1].intensity = DIRECTINTENSITY;
      lights[1].color.setHex(DIRECTCOLOR);
    }
  }, []);

  const updateGUI = useCallback(() => {
    const cameraNames = [];
    const morphMeshes = [];
    mainSceneRef.current.traverse((node) => {
      const child: any = node;
      if (child.isMesh && child.morphTargetInfluences) {
        morphMeshes.push(child);
      }
      if (child.isCamera) {
        child.name = node.name || `VIEWER__camera_${cameraNames.length + 1}`;
        cameraNames.push(child.name);
      }
    });
    const clips = clipsRef.current;

    const tmpActions = [];
    clips.forEach((clip, clipIndex) => {
      clip.name = `${clipIndex + 1}.${clip.name}`;
      tmpActions.push({ value: clipIndex, label: clip.name, data: clip });
    });
    let index = -1;
    // if (initValueRef.current) {
    //   if (initValueRef.current.modelAction > -1) {
    //     index = initValueRef.current.modelAction
    //   }
    // } else {
    if (tmpActions.length) {
      index = 0;
    }
    //}
    setPointConfig((pre) => {
      const data = {
        ...pre,
        modelAction: index,
      };
      // console.log('updateGUI', data);

      onChange && onChange(data);
      return data;
    });
    if (tmpActions[index]) {
      const clip = tmpActions[index].data;
      curActionRef.current = clip;
      actionRef.current = mixerRef.current.clipAction(clip);
      actionRef.current.play();
    }
  }, []);


  const updateTextureEncoding = useCallback(() => {
    // const encoding = this.state.textureEncoding === 'sRGB'
    //   ? sRGBEncoding
    //   : LinearEncoding;
    const encoding = sRGBEncoding;
    traverseMaterials(
      mainSceneRef.current,
      (material: {
        map: { encoding: import('three').TextureEncoding };
        emissiveMap: { encoding: import('three').TextureEncoding };
        needsUpdate: boolean;
      }) => {
        if (material.map) material.map.encoding = encoding;
        if (material.emissiveMap) material.emissiveMap.encoding = encoding;
        if (material.map || material.emissiveMap) material.needsUpdate = true;
      }
    );
  }, []);

  const clear = useCallback(() => {
    if (!mainSceneRef.current) return;
    if (sceneRef.current) {
      sceneRef.current.remove(mainSceneRef.current);
    }

    //setActions([{ value: 'none', label: '无' }])
    // setCutAction('none')
    curActionRef.current = 'none';

    mainSceneRef.current.traverse((node) => {
      if (!(node as any).isMesh) return;
      (node as any).geometry.dispose();
    });
    // dispose textures
    traverseMaterials(
      mainSceneRef.current,
      (material: { [x: string]: { dispose: () => void } }) => {
        MAP_NAMES.forEach((map) => {
          if (material[map]) material[map].dispose();
        });
      }
    );
  }, []);

  const traverseMaterials = useCallback((object: Object3D, cb) => {
    object.traverse((node) => {
      if (!(node as any).isMesh) return;
      const materials = Array.isArray((node as any).material)
        ? (node as any).material
        : [(node as any).material];
      materials.forEach(cb);
    });
  }, []);


  return (
    <div
      className={classnames(
        s.root,
        {
          [s['readonly-root']]: curType === 'readonly',
        },
        {
          [s.editRoot]: curType === 'edit',
        }
      )}
      ref={rootRef}
    >
      {genPriviewImgIng && (
        <div className={s.loading}>
          <Spin />
          加载中。。。
        </div>
      )}
      {status === 'fail' && <div className={s.loading}>加载失败</div>}
      <div
        ref={canvasBoxRef}
        className={s['canvas-box']}
        style={{
          width: '100%',
          height: `100%`,
        }}
      >
      </div>
    </div>
  );
};

export default forwardRef(Viewer);
