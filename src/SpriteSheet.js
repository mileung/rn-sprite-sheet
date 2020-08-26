import { Animated, Easing, View } from "react-native";
import Svg,{Image}from 'react-native-svg';

import PropTypes from "prop-types";
import React from "react";
import resolveAssetSource from "react-native/Libraries/Image/resolveAssetSource";

const stylePropType = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.object,
  PropTypes.array
]);

const sourcePropType = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.object
]);

export default class SpriteSheet extends React.PureComponent {
  static propTypes = {
    source: sourcePropType.isRequired, // source must be required
    columns: PropTypes.number.isRequired,
    rows: PropTypes.number.isRequired,
    animations: PropTypes.object.isRequired, // see example
    viewStyle: stylePropType, // styles for the sprite sheet container
    imageStyle: stylePropType, // styles for the sprite sheet
    height: PropTypes.number, // set either height, width, or neither
    width: PropTypes.number, // do not set both height and width
    onLoad: PropTypes.func,
    frameWidth: PropTypes.number,
    frameHeight: PropTypes.number,
  };

  static defaultPropTypes = {
    columns: 1,
    rows: 1,
    animations: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      imageHeight: 0,
      imageWidth: 0,
      defaultFrameHeight: 0,
      defaultFrameWidth: 0,
      translateYInputRange: [0, 1],
      translateYOutputRange: [0, 1],
      translateXInputRange: [0, 1],
      translateXOutputRange: [0, 1]
    };

    this.time = new Animated.Value(0);
    this.interpolationRanges = {};

    let { source, height, width, rows, columns, frameHeight, frameWidth, offsetY = 0, offsetX = 0 } = this.props;
    let image = resolveAssetSource(source);
    let ratio = 1;
    let imageHeight = image.height;
    let imageWidth = image.width;
    offsetX = -offsetX;
    offsetY = -offsetY;
    frameHeight = frameHeight || image.height / rows;
    frameWidth = frameWidth || image.width / columns;

    if (width) {
      ratio = (width * columns) / image.width;
      imageHeight = image.height * ratio;
      imageWidth = width * columns;
      frameHeight = (image.height / rows) * ratio;
      frameWidth = width;
    } else if (height) {
      ratio = (height * rows) / image.height;
      imageHeight = height * rows;
      imageWidth = image.width * ratio;
      frameHeight = height;
      frameWidth = (image.width / columns) * ratio;
    }

    Object.assign(this.state, {
      imageHeight,
      imageWidth,
      frameHeight,
      frameWidth,
      offsetX,
      offsetY
    });

    this.generateInterpolationRanges();
  }

  render() {
    let {
      imageHeight,
      imageWidth,
      frameHeight,
      frameWidth,
      animationType,
      offsetX,
      offsetY
    } = this.state;
    let { viewStyle, imageStyle, source, onLoad } = this.props;

    let {
      translateY = { in: [0,0], out: [offsetY, offsetY] },
      translateX = { in: [0,0], out: [offsetX, offsetX] }
    } = this.interpolationRanges[animationType] || {};

    return (
      <View
        style={[
          viewStyle,
          {
            height: frameHeight,
            width: frameWidth,
            overflow: "hidden"
          }
        ]}
      >
        <Animated.Image
          source={source}
          onLoad={onLoad}
          style={[
            imageStyle,
            {
              height: imageHeight,
              width: imageWidth,
              // Transform properties are GPU accelerated and supported by Native Driver
              transform: [
                {
                  translateX: this.time.interpolate({
                    inputRange: translateX.in,
                    outputRange: translateX.out
                  })
                },
                {
                  translateY: this.time.interpolate({
                    inputRange: translateY.in,
                    outputRange: translateY.out
                  })
                }
              ]
            }
          ]}
        />
      </View>
    );
  }

  generateInterpolationRanges = () => {
    let { animations } = this.props;

    for (let key in animations) {
      let { length } = animations[key];
      let input = [].concat(...Array.from({ length }, (_, i) => [i, i + 1]));
      this.interpolationRanges[key] = {
        translateY: {
          in: input,
          out: [].concat(
            ...animations[key].map(i => {
              let { y } = this.getFrameCoords(i);
              return [y, y];
            })
          )
        },
        translateX: {
          in: input,
          out: [].concat(
            ...animations[key].map(i => {
              let { x } = this.getFrameCoords(i);
              return [x, x];
            })
          )
        }
      };
    }
  };

  stop = cb => {
    this.time.stopAnimation(cb);
  };

  reset = cb => {
    this.time.stopAnimation(cb);
    this.time.setValue(0);
  };

  play = ({
    type,
    fps = 24,
    loop = false,
    resetAfterFinish = false,
    onFinish = () => {}
  }) => {
    let { animations } = this.props;
    let { length } = animations[type];

    this.setState({ animationType: type }, () => {
      let animation = Animated.timing(this.time, {
        toValue: length,
        duration: (length / fps) * 1000,
        easing: Easing.linear,
        useNativeDriver: true // Using native animation driver instead of JS
      });

      this.time.setValue(0);

      if (loop) {
        Animated.loop(animation).start();
      } else {
        animation.start(() => {
          if (resetAfterFinish) {
            this.time.setValue(0);
          }
          onFinish();
        });
      }
    });
  };

  getFrameCoords = i => {
    let { columns, offsetX, offsetY } = this.props;
    let { frameHeight, frameWidth } = this.state;
    let currentColumn = i % columns;
    let xAdjust = -currentColumn * frameWidth;
    xAdjust -= offsetX;
    let yAdjust = -((i - currentColumn) / columns) * frameHeight ;
    yAdjust -= offsetY;

    return {
      x: xAdjust,
      y: yAdjust
    };
  };
}
