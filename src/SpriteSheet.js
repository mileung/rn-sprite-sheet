import { Animated, Easing, View } from "react-native";

import PropTypes from "prop-types";
import React from "react";
import resolveAssetSource from "react-native/Libraries/Image/resolveAssetSource";

const stylePropType = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.object,
  PropTypes.array
]);

export default class SpriteSheet extends React.PureComponent {
  static propTypes = {
    source: PropTypes.number.isRequired, // source must be required; { uri } will not work
    columns: PropTypes.number.isRequired,
    rows: PropTypes.number.isRequired,
    animations: PropTypes.object.isRequired, // see example
    viewStyle: stylePropType, // styles for the sprite sheet container
    imageStyle: stylePropType, // styles for the sprite sheet
    height: PropTypes.number, // set either height, width, or neither
    width: PropTypes.number, // do not set both height and width
    onLoad: PropTypes.func
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

    let { source, height, width, rows, columns } = this.props;
    let image = resolveAssetSource(source);
    let ratio = 1;
    let imageHeight = image.height;
    let imageWidth = image.width;
    let frameHeight = image.height / rows;
    let frameWidth = image.width / columns;

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
      frameWidth
    });

    this.generateInterpolationRanges();
  }

  render() {
    let {
      imageHeight,
      imageWidth,
      frameHeight,
      frameWidth,
      animationType
    } = this.state;
    let { viewStyle, imageStyle, source, onLoad } = this.props;

    let {
      translateY = { in: [0, 0], out: [0, 0] },
      translateX = { in: [0, 0], out: [0, 0] }
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
    let { columns } = this.props;
    let { frameHeight, frameWidth } = this.state;
    let currentColumn = i % columns;
    let xAdjust = -currentColumn * frameWidth;
    let yAdjust = -((i - currentColumn) / columns) * frameHeight;

    return {
      x: xAdjust,
      y: yAdjust
    };
  };
}
