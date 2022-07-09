import { useDrag, useGesture } from '@use-gesture/react'
import { useWindowSize } from '../hooks'
import { useSpring, animated, config } from 'react-spring'
export default function Swipeable ({
  onSwipeRight,
  onSwipeLeft,
  children,
  style
}: {
  onSwipeRight: any
  onSwipeLeft: any
  children: any
  style: any
}) {
  const windowSize = useWindowSize()
  const [{ x, rotate, scale }, api] = useSpring(() => ({
    x: 0,
    rotate: 0,
    scale: 1
  }))

  

  const bind = useGesture(
    {
      onDrag:
        // @ts-ignore
        ({ down, movement: [mx], direction: [dx], velocity: [vx] }) => {
          if (!windowSize || !windowSize.width) {return}
          const trigger = Math.abs(mx) + Math.abs(vx) > windowSize.width / 2
          // @ts-ignore
          api.start(() => {
            const x = !down?0:trigger?mx*5:mx
            const rotate = down ? mx / 20 : 0
            const scale = down ? 1.05 : 1

          

            return {
              x,
              rotate,
              scale,
              config: config.gentle
            }
          })
        },
        
      onDragEnd: ({
        down,
        // @ts-ignore
        movement: [mx],
        // @ts-ignore
        direction: [dx],
        // @ts-ignore
        velocity: [vx]
      }) => {
        if (!windowSize || !windowSize.width) {return}
        const trigger = Math.abs(mx) + Math.abs(vx) > windowSize.width / 2
        // @ts-ignore
        api.start(() => {
          function handleTrigger () {
            if (dx > 0) {
              console.log('Swipe Right')
              onSwipeRight()
            } else {
              console.log('Swipe Left')
              onSwipeLeft()
            }

            
          }
          
          if (trigger) {
            handleTrigger()
          }

          return {
            x: 0,
            rotate: 0,
            scale: 1
          }


        })
      }
    },
    { drag: { filterTaps: true } }
  )

  return (
    <animated.div
      className='absolute w-full h-auto flex flex-col justify-start items-center'
      {...bind()}
      style={{
        x,
        rotate,
        scale,
        ...style,
        touchAction: 'none'
      }}
    >
      {children}
    </animated.div>
  )
}
