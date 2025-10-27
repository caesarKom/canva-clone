export interface AnimationKeyframe {
  time: number // Time in ms a start
  properties: Record<string, number>
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out'
}

export interface ObjectAnimation {
  objectId: string
  name: string
  duration: number
  loop: boolean
  delay: number
  keyframes: AnimationKeyframe[]
}

export interface ProjectAnimations {
  animations: ObjectAnimation[]
  timeline: {
    duration: number
    autoPlay: boolean
    loop: boolean
  }
}
