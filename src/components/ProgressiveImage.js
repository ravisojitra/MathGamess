import React, { Component } from 'react'
import { Image, Animated, View } from 'react-native'

type ProgressiveImageState = {
  thumbnailOpacity: number,
  key: string
}

type ProgressiveImageProps = {
  backgroundColor: string,
  style: any,
  width: number,
  height: number,
  source: string,
  thumbnail: string
}

let i = 0
const genKey = (): string => {
  return `key:${++i}`
}

export class ProgressiveImage extends Component {
  props: ProgressiveImageProps
  state: ProgressiveImageState

  constructor(props: any, context: any) {
    super(props, context)

    this.state = {
      thumbnailOpacity: new Animated.Value(0),
      key: genKey()
    }
  }

  onLoad = () => {
    Animated.timing(this.state.thumbnailOpacity, {
      toValue: 0,
      duration: 250
    }).start();
  }  

  onThumbnailLoad = () => {
    Animated.timing(this.state.thumbnailOpacity, {
      toValue: 1,
      duration: 250
    }).start();
  }

  render() {
    const { key, thumbnailOpacity } = this.state
    const { width, height, source, thumbnail, style } = this.props

    return (
      <View
        width={width}
        height={height}
        backgroundColor={'#CCC'}>
        <Animated.Image 
          resizeMode={'contain'}
          key={key} 
          style={[
            style,
            {
              position: 'absolute',
            }            
          ]}
          source={source}
          onLoad={this.onLoad} />
        <Animated.Image 
          resizeMode={'contain'}
          key={key} 
          style={[
            style,
            {
              opacity: thumbnailOpacity
            }
          ]}
          source={thumbnail}
          onLoad={this.onThumbnailLoad} />
      </View>      
    )
  }
}