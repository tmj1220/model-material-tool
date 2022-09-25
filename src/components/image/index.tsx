/* eslint-disable jsx-a11y/alt-text */
import React, {
  forwardRef, useImperativeHandle, useRef, useState, useMemo,
} from 'react'
import type { ForwardRefRenderFunction } from 'react'
import s from './index.less'

export interface ImageProps {
  src:string
  fallback?:string
  alt:string
  height?:number|string
  width?:number|string
  placeholder?:React.ReactNode
  rootClassName?:string
  crossorigin?:string
  onLoad?:Function
  onError?:Function
  thumbRgb?:string
}

type Status = 'unload' | 'loading' |'success'|'fail'

interface ImageInstance {
  status:Status
  getImgRef:()=>HTMLImageElement
}

const Image:ForwardRefRenderFunction<ImageInstance, ImageProps> = ({
  thumbRgb = '#cccccc',
  src,
  fallback = undefined,
  alt,
  height = '100%',
  width = '100%',
  placeholder,
  rootClassName,
  crossorigin = 'anonymous',
  onLoad = () => {},
  onError = () => {},
}, ref) => {
  const [status, setStatus] = useState<Status>('unload')
  const imgRef = useRef<HTMLImageElement>()

  useImperativeHandle(
    ref,
    () => ({
      status,
      getImgRef: () => imgRef.current,
    }),
    [status],
  )

  const imgProps = useMemo(() => {
    const props:Record<string, string|number> = {
      src,
      alt,
      height,
      width,
      crossOrigin: crossorigin,
    }
    if (rootClassName) {
      props.className = rootClassName
    }
    return props
  }, [src,
    alt,
    height,
    width,
    rootClassName,
    crossorigin])

  return (
    <div
      className={s['img-root']}
      style={{
        background: thumbRgb ?? '#cccccc',
      }}
    >
      {!!placeholder && ['loading', 'unload'].includes(status) && placeholder}
      {!!fallback && status === 'fail' && <img src={fallback} alt="fail img" />}
      <img
        ref={imgRef}
        loading="lazy"
        onLoad={() => {
          setStatus('success')
          onLoad()
        }}
        onError={() => {
          // console.log('onError');
          setStatus('fail')
          onError()
        }}
        {...imgProps}
        style={{
          visibility: status === 'success' ? 'visible' : 'hidden',
        }}
      />
    </div>
  )
};

export default forwardRef(Image)
